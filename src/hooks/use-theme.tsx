import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_KEY = "theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  if (typeof window !== "undefined") {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark") return stored;
    } catch {}
    if (typeof window !== "undefined") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
