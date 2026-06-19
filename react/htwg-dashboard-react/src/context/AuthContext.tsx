import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Definition, wie unser User-Objekt aussieht
export interface User {
  id: string;
  username: string;
  email: string;
}

// Definition der Daten, die der Context bereitstellt
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    // Tipp aus der Vorlesung: Das Token wird im State behalten,
    // nicht im localStorage, um XSS-Angriffe zu erschweren!
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook, um den Context in Komponenten extrem einfach zu nutzen
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  return context;
};
