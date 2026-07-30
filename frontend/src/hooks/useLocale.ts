"use client";

import { useCallback, useEffect, useState } from "react";
import { LOCALES, type LocaleCode } from "@/lib/constants";

const STORAGE_KEY = "green-rock-locale";

export function useLocale() {
  const [locale, setLocaleState] = useState<LocaleCode>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
    if (stored && LOCALES.some((l) => l.code === stored)) {
      setLocaleState(stored);
    }
    setIsReady(true);
  }, []);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
  }, []);

  const t = useCallback(
    <T extends Record<LocaleCode, string>>(translations: T): string => {
      return translations[locale] ?? translations.en;
    },
    [locale]
  );

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return { locale, setLocale, t, currentLocale, isReady, locales: LOCALES };
}
