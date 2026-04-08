export const i18nConfig = {
  defaultLocale: "en",
  supportedLocales: ["en", "tr"] as const,
  storageKey: "superpen-locale",
  cookieName: "superpen-locale",
  browserDetectionEnabled: true,
} as const;

export type Locale = (typeof i18nConfig.supportedLocales)[number];

const supportedLocaleSet = new Set<string>(i18nConfig.supportedLocales);

export function isSupportedLocale(value: string): value is Locale {
  return supportedLocaleSet.has(value);
}

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const base = normalized.split(/[-_]/)[0];
  return isSupportedLocale(base) ? base : null;
}

export function parseAcceptLanguage(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const [first] = value.split(",");
  return first?.trim() || null;
}

export function resolveLocale({
  savedLocale,
  browserLocale,
}: {
  savedLocale?: string | null;
  browserLocale?: string | null;
}): Locale {
  const saved = normalizeLocale(savedLocale);
  if (saved) {
    return saved;
  }

  if (i18nConfig.browserDetectionEnabled) {
    const browser = normalizeLocale(browserLocale);
    if (browser) {
      return browser;
    }
  }

  return i18nConfig.defaultLocale;
}

export function getIntlLocale(locale: Locale) {
  return locale === "tr" ? "tr-TR" : "en-US";
}
