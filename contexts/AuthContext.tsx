'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api, ApiError, AuthUser } from '@/lib/api';
import { getDeviceTimezoneOffset } from '@/lib/api/timezone';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  /** Cookie-based: token is implicit. Callback takes no arguments. */
  withAuth: <T>(apiCall: () => Promise<T>) => Promise<T>;
  ensureGuest: () => Promise<void>;
  withAuthOrGuest: <T>(apiCall: () => Promise<T>) => Promise<T>;
  callMaybeAuthed: <T>(apiCall: () => Promise<T>) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const guestPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => { (async () => {
    try {
      const me = await api.auth.me();
      setUser(me);
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 401)) console.warn('me failed:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  })(); }, []);

  async function login(usernameOrEmail: string, password: string) {
    const me = await api.auth.login(usernameOrEmail, password);
    setUser(me);
  }

  async function register(username: string, email: string, password: string) {
    const me = await api.auth.register(username, email, password);
    setUser(me);
    api.streak.updateTimezone(getDeviceTimezoneOffset()).catch(() => {});
  }

  async function logout() {
    try { await api.auth.logout(); } catch { /* best-effort */ }
    setUser(null);
  }

  async function verifyEmail(code: string) {
    await api.auth.verifyEmail(code);
    if (user) setUser({ ...user, isEmailVerified: true });
  }
  async function resendVerification() { await api.auth.sendVerification(); }
  async function forgotPassword(email: string) { await api.auth.forgotPassword(email); }
  async function resetPassword(email: string, code: string, newPassword: string) {
    await api.auth.resetPassword(email, code, newPassword);
    try { await login(email, newPassword); } catch { throw new Error('PASSWORD_RESET_LOGIN_FAILED'); }
  }

  async function withAuth<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
      return await apiCall();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        throw new ApiError(401, 'Session expired. Please log in again.');
      }
      throw err;
    }
  }

  async function ensureGuest(): Promise<void> {
    if (user) return;
    if (guestPromiseRef.current) return guestPromiseRef.current;
    guestPromiseRef.current = (async () => {
      const me = await api.auth.guest();
      setUser(me);
    })().finally(() => { guestPromiseRef.current = null; });
    return guestPromiseRef.current;
  }

  async function withAuthOrGuest<T>(apiCall: () => Promise<T>): Promise<T> {
    if (!user) await ensureGuest();
    return withAuth(apiCall);
  }

  async function callMaybeAuthed<T>(apiCall: () => Promise<T>): Promise<T> {
    return withAuth(apiCall);
  }

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      login, register, logout,
      verifyEmail, resendVerification, forgotPassword, resetPassword,
      withAuth, ensureGuest, withAuthOrGuest, callMaybeAuthed,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
