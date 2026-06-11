import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('admin_token');
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const response = await adminService.getProfile();
          if (response.success) {
            setAdminUser(response.data);
            setIsAuthenticated(true);
            localStorage.setItem('admin_user', JSON.stringify(response.data));
          } else {
            throw new Error('Verification failed');
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await adminService.login(email, password);
      if (response.success && response.data) {
        const { token, admin } = response.data;
        setIsAuthenticated(true);
        setAdminUser(admin);
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(admin));
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password credentials.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await adminService.logout();
    } catch (error) {
      console.error('Logout error on server:', error);
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

