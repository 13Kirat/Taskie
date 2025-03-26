import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import authStorage from '../services/authStorage';

export const AuthContext = createContext();

export default AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loadToken = async () => {
      try {
        const token = await authStorage.getToken();
        if (token) {
          const res = await api.get('/api/auth/me', {
            headers: { 'x-auth-token': token },
          });
          setUser(res.data);
        }
      } catch (error) {
        // console.error('Failed to load user', error);
        await authStorage.removeToken();
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token } = res.data;

      await authStorage.storeToken(token);

      const userRes = await api.get('/api/auth/me', {
        headers: { 'x-auth-token': token },
      });
      setUser(userRes.data);

      return { success: true };
    } catch (error) {
      // console.error('Login error', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.msg || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      await authStorage.removeToken();
      setUser(null);
      return true
    } catch (error) {
      // console.error('Logout error', error);
      return false
    }
  };

  const registerUser = async (userData) => {
    try {
      const token = await authStorage.getToken();
      const res = await api.post('/api/users/register', userData, {
        headers: { 'x-auth-token': token },
      });
      return { success: true, data: res.data };
    } catch (error) {
      // console.error('Registration error', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.msg || 'Registration failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerUser,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
