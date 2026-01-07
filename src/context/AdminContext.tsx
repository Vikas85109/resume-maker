import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface IAdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

interface IAdminContextType {
  admin: IAdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  token: string | null;
}

const ADMIN_TOKEN_KEY = 'admin-panel-token';
const ADMIN_USER_KEY = 'admin-panel-user';
const API_BASE_URL = 'http://localhost:5000/api';

const AdminContext = createContext<IAdminContextType | undefined>(undefined);

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

const getStoredAdmin = (): IAdminUser | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(ADMIN_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<IAdminUser | null>(() => getStoredAdmin());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = admin !== null && (admin.role === 'admin' || admin.role === 'superadmin');

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = getStoredToken();
      if (!storedToken) return;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success && data.user && (data.user.role === 'admin' || data.user.role === 'superadmin')) {
          setAdmin(data.user);
          setToken(storedToken);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
        } else {
          // Not an admin or invalid token
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          localStorage.removeItem(ADMIN_USER_KEY);
          setAdmin(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    };

    verifyToken();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Check if user is admin
        if (data.user.role !== 'admin' && data.user.role !== 'superadmin') {
          setIsLoading(false);
          return { success: false, error: 'Access denied. Admin privileges required.' };
        }

        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
        setAdmin(data.user);
        setToken(data.token);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'Network error. Make sure the backend server is running.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setAdmin(null);
    setToken(null);
  }, []);

  const value: IAdminContextType = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    token,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = (): IAdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// API helper for admin requests
export const adminApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  return response.json();
};
