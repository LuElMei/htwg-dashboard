import { useEffect, useState, type ReactNode } from 'react';
import { getCurrentUser, loginRequest, registerRequest } from '../api';
import type { User } from '../types';
import { AuthContext } from './auth-context';

const TOKEN_STORAGE_KEY = 'htwg-dashboard-token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      return;
    }

    let isCancelled = false;

    getCurrentUser(storedToken)
      .then(({ user: restoredUser }) => {
        if (!isCancelled) {
          setUser(restoredUser);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsRestoring(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const finishAuthentication = async (newToken: string) => {
    const { user: authenticatedUser } = await getCurrentUser(newToken);
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(authenticatedUser);
  };

  const login = async (username: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const { token: newToken } = await loginRequest(username, password);
      await finishAuthentication(newToken);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const { token: newToken } = await registerRequest(username, email, password);
      await finishAuthentication(newToken);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isAuthenticating,
        isRestoring,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};