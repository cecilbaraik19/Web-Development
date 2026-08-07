import { createContext, useContext, useState } from 'react';
import { contentService } from '../services/contentService.js';

const STORAGE_KEY = 'portfolio_admin_key';
const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [key, setKey] = useState(() => localStorage.getItem(STORAGE_KEY) || '');

  // Verifies the key against the backend, then stores it
  const login = async (candidate) => {
    await contentService.adminLogin(candidate);
    localStorage.setItem(STORAGE_KEY, candidate);
    setKey(candidate);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setKey('');
  };

  return (
    <AdminContext.Provider value={{ isAdmin: Boolean(key), login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
