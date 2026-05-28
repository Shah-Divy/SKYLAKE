import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Dummy authentication check
    if (email === 'admin@example.com' && password === 'admin123') {
      setIsAuthenticated(true);
      const user = { email, name: 'Lead Controls Administrator', role: 'System Admin' };
      setAdminUser(user);
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
