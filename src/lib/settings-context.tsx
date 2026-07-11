"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";
type Lang = "fr" | "ar";

type SettingsContextType = {
  theme: Theme;
  lang: Lang;
  dir: "ltr" | "rtl";
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
};

const SettingsContext = createContext<SettingsContextType>({
  theme: "dark",
  lang: "fr",
  dir: "ltr",
  setTheme: () => {},
  setLang: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState] = useState<Lang>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("souki_theme") as Theme | null;
    const savedLang = localStorage.getItem("souki_lang") as Lang | null;
    if (savedTheme) setThemeState(savedTheme);
    if (savedLang) setLangState(savedLang);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("souki_theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("souki_lang", lang);
  }, [lang, mounted]);

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <SettingsContext.Provider value={{ theme, lang, dir, setTheme: setThemeState, setLang: setLangState }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
