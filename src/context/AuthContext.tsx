import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage or a token
    const checkUserAuthentication = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkUserAuthentication();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call in a real application
      // Mock login for demo purposes
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: email.includes('donor') ? UserRole.Donor : 
              email.includes('recipient') ? UserRole.Recipient : 
              email.includes('volunteer') ? UserRole.Volunteer : UserRole.Admin,
        createdAt: new Date()
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call in a real application
      // Mock registration for demo purposes
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role,
        createdAt: new Date()
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isAuthenticated: !!currentUser, 
        isLoading, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 