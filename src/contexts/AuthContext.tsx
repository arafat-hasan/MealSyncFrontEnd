import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { auth } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: {
    email: string;
    password: string;
    name: string;
    username: string;
    department: string;
    employee_id: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    try {
      const token = localStorage.getItem('access_token');
      console.log('AuthProvider: Token found:', !!token);
      
      if (token) {
        try {
          const decoded = jwtDecode<{ user: User }>(token);
          console.log('AuthProvider: Token decoded successfully:', decoded);
          setUser(decoded.user);
        } catch (error) {
          console.error('AuthProvider: Token decode error:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    } catch (error) {
      console.error('AuthProvider: Initialization error:', error);
    } finally {
      console.log('AuthProvider: Initialization complete');
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting login for:', email);
    try {
      const { data } = await auth.login(email, password);
      console.log('AuthProvider: Login response:', data);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
    } catch (error) {
      console.error('AuthProvider: Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logging out');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    username: string;
    department: string;
    employee_id: string;
  }) => {
    console.log('AuthProvider: Attempting registration for:', data.email);
    try {
      await auth.register(data);
      console.log('AuthProvider: Registration successful');
    } catch (error) {
      console.error('AuthProvider: Registration error:', error);
      throw error;
    }
  };

  const contextValue = {
    user,
    isLoading,
    login,
    logout,
    register,
  };

  console.log('AuthProvider: Current state:', { user, isLoading });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 