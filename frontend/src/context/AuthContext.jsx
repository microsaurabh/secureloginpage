import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  changePassword,
  getApiErrorMessage,
  loginUser,
  logoutUser,
  registerAccount,
  requestPasswordReset,
  resetPassword
} from '../api/auth.js';

/* eslint-disable react-refresh/only-export-components */

const AuthContext = createContext(null);
const storageKey = 'secure-login-portal-auth';

function readStoredAuth() {
  if (typeof window === 'undefined') return { user: null, accessToken: null };
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return { user: null, accessToken: null };
    const parsed = JSON.parse(stored);
    return {
      user: parsed?.user ?? null,
      accessToken: parsed?.accessToken ?? null
    };
  } catch {
    return { user: null, accessToken: null };
  }
}

function writeStoredAuth(user, accessToken) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify({ user, accessToken }));
}

function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(storageKey);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuth().user);
  const [accessToken, setAccessToken] = useState(() => readStoredAuth().accessToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) {
      writeStoredAuth(user, accessToken);
      return;
    }
    clearStoredAuth();
  }, [accessToken, user]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const session = await loginUser(credentials);
      setUser(session.user);
      setAccessToken(session.accessToken);
      return session;
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await registerAccount(payload);
        await login({ email: payload.email, password: payload.password });
        return result;
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch {
      // Ignore logout failures and still clear the local session.
    } finally {
      setUser(null);
      setAccessToken(null);
      setLoading(false);
      setError(null);
    }
  }, []);

  const requestReset = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      await requestPasswordReset(email);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(payload);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeUserPassword = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await changePassword(payload);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      loading,
      error,
      login,
      register,
      logout: signOut,
      requestReset,
      reset,
      changePassword: changeUserPassword,
      clearError
    }),
    [
      accessToken,
      changeUserPassword,
      clearError,
      error,
      loading,
      login,
      register,
      requestReset,
      reset,
      signOut,
      user
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
