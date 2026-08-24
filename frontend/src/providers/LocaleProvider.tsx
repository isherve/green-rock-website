"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LOCALES, type LocaleCode } from "@/lib/constants";
import { translate } from "@/lib/i18n/translations";

const STORAGE_KEY = "green-rock-locale";

type LocaleContextValue = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: (key: string) => string;
  isReady: boolean;
  locales: typeof LOCALES;
  currentLocale: (typeof LOCALES)[number];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
    if (stored && LOCALES.some((l) => l.code === stored)) {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
    setIsReady(true);
  }, []);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
  }, []);

  const t = useCallback((key: string) => translate(key, locale), [locale]);

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const value = useMemo(
    () => ({ locale, setLocale, t, isReady, locales: LOCALES, currentLocale }),
    [locale, setLocale, t, isReady, currentLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
