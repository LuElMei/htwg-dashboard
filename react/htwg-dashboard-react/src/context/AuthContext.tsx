import { useState, type ReactNode } from 'react';
import { getCurrentUser, loginRequest, registerRequest } from '../api';
import type { User } from '../types';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const finishAuthentication = async (newToken: string) => {
    // Der geschuetzte Endpunkt prueft den Token und liefert den eingeloggten User.
    const { user: authenticatedUser } = await getCurrentUser(newToken);
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
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
