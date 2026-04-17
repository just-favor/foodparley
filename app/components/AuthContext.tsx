'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  phone: string;
} | null;

type AuthContextType = {
  user: User;
  login: (name: string, phone: string) => void;
  signup: (name: string, phone: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const stored = localStorage.getItem('fp_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const persist = (u: User) => {
    setUser(u);
    if (u) localStorage.setItem('fp_user', JSON.stringify(u));
    else localStorage.removeItem('fp_user');
  };

  const login = (name: string, phone: string) => persist({ id: phone, name, phone });
  const signup = (name: string, phone: string) => persist({ id: phone, name, phone });
  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

