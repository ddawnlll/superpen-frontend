"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getLandingContent } from "./landing-content";
import { i18nConfig, normalizeLocale, resolveLocale, type Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const localeListeners = new Set<() => void>();
let currentClientLocale: Locale | null = null;

function readSavedLocale() {
  if (typeof window === "undefined") {
    return null;
  }

  return normalizeLocale(window.localStorage.getItem(i18nConfig.storageKey));
}

function readBrowserLocale() {
  if (typeof window === "undefined" || !i18nConfig.browserDetectionEnabled) {
    return null;
  }

  const candidates = [
    ...(navigator.languages || []),
    navigator.language,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function syncDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
}

function persistLocale(locale: Locale) {
  window.localStorage.setItem(i18nConfig.storageKey, locale);
  document.cookie = `${i18nConfig.cookieName}=${encodeURIComponent(locale)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function subscribeToLocale(listener: () => void) {
  localeListeners.add(listener);
  return () => localeListeners.delete(listener);
}

function getClientLocaleSnapshot() {
  if (currentClientLocale) {
    return currentClientLocale;
  }

  currentClientLocale = resolveLocale({
    savedLocale: readSavedLocale(),
    browserLocale: readBrowserLocale(),
  });

  return currentClientLocale;
}

function updateLocale(nextLocale: Locale, shouldPersist: boolean) {
  currentClientLocale = nextLocale;
  syncDocumentLocale(nextLocale);

  if (shouldPersist) {
    persistLocale(nextLocale);
  }

  localeListeners.forEach((listener) => listener());
}

export default function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const locale = useSyncExternalStore(subscribeToLocale, getClientLocaleSnapshot, () => initialLocale);

  useEffect(() => {
    syncDocumentLocale(locale);

    const savedLocale = readSavedLocale();
    if (savedLocale) {
      persistLocale(savedLocale);
    }
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => updateLocale(nextLocale, true),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return context;
}

export function useLandingContent() {
  const { locale } = useLocale();
  return useMemo(() => getLandingContent(locale), [locale]);
}
