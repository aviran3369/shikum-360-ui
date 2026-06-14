import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import type { User } from '@/types';
import { currentUser } from '@/mock/mockData';
import { mockMutate } from '@/lib/mockApi';

interface AuthContextValue {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Demo starts authenticated so the dashboard is directly reachable; /login replays the flow.
  const [isAuthenticated, setAuthenticated] = useState(true);
  const [user] = useState<User>(currentUser);

  const login = useCallback(async (email: string, _password: string) => {
    await mockMutate({ email }, 900);
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => setAuthenticated(false), []);

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout }),
    [user, isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
