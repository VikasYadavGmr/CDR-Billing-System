import React, { createContext, useContext, useState } from 'react';
import { REGION_EUROPE } from '../types/tax';
import { BILLING_CURRENCY, DEFAULT_BILLING_COUNTRY_CODE } from '../mock-data/countryData';

/**
 * The administrator of this deployment is a European tax administrator: the
 * session is scoped to Region = Europe with a European billing jurisdiction and
 * Euro reporting currency. Nothing outside Europe is configured.
 */
export interface AuthUser {
  name: string;
  username: string;
  role: string;
  region: string;
  /** Billing/tax jurisdiction this administrator operates in. */
  billingCountryCode: string;
  currency: string;
  locale: string;
}

const EUROPEAN_ADMIN: AuthUser = {
  name: 'Admin User',
  username: 'admin',
  role: 'Tax & Billing Administrator',
  region: REGION_EUROPE,
  billingCountryCode: DEFAULT_BILLING_COUNTRY_CODE,
  currency: BILLING_CURRENCY,
  locale: 'en-IE',
};

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cdr_auth') === 'true';
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    return localStorage.getItem('cdr_auth') === 'true' ? EUROPEAN_ADMIN : null;
  });

  const login = async (username?: string, password?: string) => {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('cdr_auth', 'true');
      setIsAuthenticated(true);
      setUser(EUROPEAN_ADMIN);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('cdr_auth');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
