import { createContext } from 'react';
import type { User } from '../types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isRestoring: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
