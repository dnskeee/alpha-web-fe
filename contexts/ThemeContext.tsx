'use client';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  /** Stored preference (same as `resolved`; kept for backwards compatibility with consumers). */
  pref: Theme;
  resolved: Theme;
  setPref: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Action = { type: 'set'; theme: Theme };

function reducer(_state: Theme, action: Action): Theme {
  switch (action.type) {
    case 'set':
      return action.theme;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, dispatch] = useReducer(reducer, 'light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initial: Theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', initial);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      initial === 'dark' ? '#11181C' : '#ffffff',
    );
    dispatch({ type: 'set', theme: initial });
  }, []);

  function setPref(next: Theme) {
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      next === 'dark' ? '#11181C' : '#ffffff',
    );
    dispatch({ type: 'set', theme: next });
  }

  return (
    <ThemeContext.Provider value={{ pref: theme, resolved: theme, setPref }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
