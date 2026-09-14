import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  user: { name: string; username: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aocc_auth') === 'true';
  });

  const [user, setUser] = useState<{ name: string; username: string } | null>(() => {
    return localStorage.getItem('aocc_auth') === 'true' 
      ? { name: 'Admin User', username: 'admin' } 
      : null;
  });

  const login = async (username?: string, password?: string) => {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('aocc_auth', 'true');
      setIsAuthenticated(true);
      setUser({ name: 'Admin User', username: 'admin' });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('aocc_auth');
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
