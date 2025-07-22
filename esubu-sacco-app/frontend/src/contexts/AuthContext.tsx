import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOfficer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Verify token is still valid
        authAPI.verifyToken()
          .catch(() => {
            // Token is invalid, logout
            logout();
          });
      } catch (error) {
        // Invalid stored user data, logout
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      // Login and get token
      const authResponse = await authAPI.login(credentials);
      const { access_token } = authResponse.data;
      
      // Store token
      localStorage.setItem('access_token', access_token);
      
      // Get user profile
      const profileResponse = await authAPI.getProfile();
      const userData = profileResponse.data;
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
    } catch (error: any) {
      // Clear any stored data on login failure
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
      
      // Re-throw error for component to handle
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOfficer: user?.role === 'officer' || user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
