'use client';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

type ThemePref = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  pref: ThemePref;
  resolved: ResolvedTheme;
}

interface ThemeContextValue {
  pref: ThemePref;
  resolved: ResolvedTheme;
  setPref: (p: ThemePref) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(pref: ThemePref): ResolvedTheme {
  if (pref === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

type Action =
  | { type: 'init'; pref: ThemePref; resolved: ResolvedTheme }
  | { type: 'set'; pref: ThemePref; resolved: ResolvedTheme }
  | { type: 'system-change'; resolved: ResolvedTheme };

function reducer(_state: ThemeState, action: Action): ThemeState {
  switch (action.type) {
    case 'init':
    case 'set':
      return { pref: action.pref, resolved: action.resolved };
    case 'system-change':
      return { pref: 'system', resolved: action.resolved };
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { pref: 'system', resolved: 'light' });

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as ThemePref | null) ?? 'system';
    const r = resolveTheme(stored);
    document.documentElement.setAttribute('data-theme', r);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      r === 'dark' ? '#11181C' : '#ffffff',
    );
    dispatch({ type: 'init', pref: stored, resolved: r });
  }, []);

  useEffect(() => {
    if (state.pref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const r: ResolvedTheme = mq.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', r);
      dispatch({ type: 'system-change', resolved: r });
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [state.pref]);

  function setPref(next: ThemePref) {
    localStorage.setItem('theme', next);
    const r = resolveTheme(next);
    document.documentElement.setAttribute('data-theme', r);
    dispatch({ type: 'set', pref: next, resolved: r });
  }

  return (
    <ThemeContext.Provider value={{ pref: state.pref, resolved: state.resolved, setPref }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
