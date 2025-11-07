// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../api'; // We'll use our existing API calls

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check if we've loaded the user from localStorage

  // This effect runs once when the app starts
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (formData) => {
    const { data } = await loginUser(formData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data; // Return user data for redirection
  };

  // Register function
  const register = async (formData) => {
    const { data } = await registerUser(formData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // The value that will be available to all consuming components
  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};