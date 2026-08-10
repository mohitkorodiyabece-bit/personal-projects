import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import toast from 'react-hot-toast';
import {
  loginUser as loginUserService,
  registerUser as registerUserService,
  getCurrentUser,
} from '../services/authService.js';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'framesync_token';
const USER_KEY = 'framesync_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          clearSession();
        }
      }

      try {
        const response = await getCurrentUser();
        if (response?.data?.user) {
          setUser(response.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [clearSession]);

  const login = useCallback(
    async (credentials) => {
      const response = await loginUserService(credentials);
      const { token, user: userData } = response.data;
      persistSession(token, userData);
      return userData;
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      const response = await registerUserService(payload);
      const { token, user: userData } = response.data;
      persistSession(token, userData);
      return userData;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    clearSession();
    toast.success('Logged out successfully');
  }, [clearSession]);

  const updateStoredUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateStoredUser,
    }),
    [user, loading, login, register, logout, updateStoredUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};