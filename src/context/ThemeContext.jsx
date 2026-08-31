'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('novamart_theme') || 'dark';
    setTheme(saved);
    apply(saved);
  }, []);

  function apply(next) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(next === 'light' ? 'light' : 'dark');
    if (next === 'light') root.classList.remove('dark');
    else root.classList.add('dark');
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('novamart_theme', next);
    apply(next);
  }

  function setThemeName(next) {
    setTheme(next);
    localStorage.setItem('novamart_theme', next);
    apply(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
