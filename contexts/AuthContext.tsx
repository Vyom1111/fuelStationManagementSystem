import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

export type UserRole = 'owner' | 'supervisor' | 'dsm' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  employeeId?: string;
  customerId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Owner',
    email: 'owner@pump.com',
    phone: '+1234567890',
    role: 'owner',
    employeeId: 'EMP001'
  },
  {
    id: '2',
    name: 'Mike Supervisor',
    email: 'supervisor@pump.com',
    phone: '+1234567891',
    role: 'supervisor',
    employeeId: 'EMP002'
  },
  {
    id: '3',
    name: 'David DSM',
    email: 'dsm@pump.com',
    phone: '+1234567892',
    role: 'dsm',
    employeeId: 'EMP003'
  },
  {
    id: '4',
    name: 'Sarah Customer',
    email: 'customer@email.com',
    phone: '+1234567893',
    role: 'customer',
    customerId: 'CUST001'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      setIsLoading(false);
      router.replace('/(tabs)');
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    router.replace('/auth');
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};