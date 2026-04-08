"use client";

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { i18nConfig } from "@/lib/i18n";
import { useLandingContent, useLocale } from "./LocaleProvider";

type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "superpen-theme";
const THEME_ORDER: ThemePreference[] = ["system", "light", "dark"];
const themeListeners = new Set<() => void>();

let currentThemeState: { preference: ThemePreference; resolvedTheme: ResolvedTheme } | null = null;
const serverThemeSnapshot = { preference: "system" as ThemePreference, resolvedTheme: "light" as ResolvedTheme };

function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  return preference === "system" ? (prefersDark ? "dark" : "light") : preference;
}

function readThemePreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
}

function applyThemePreference(preference: ThemePreference) {
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const resolved = resolveTheme(preference, media.matches);

  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  localStorage.setItem(STORAGE_KEY, preference);

  currentThemeState = { preference, resolvedTheme: resolved };
  return resolved;
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
}

function getServerThemeSnapshot() {
  return serverThemeSnapshot;
}

function getClientThemeSnapshot() {
  if (currentThemeState) {
    return currentThemeState;
  }

  const currentPreference = document.documentElement.dataset.themePreference;
  const preference =
    currentPreference === "light" || currentPreference === "dark" || currentPreference === "system"
      ? currentPreference
      : readThemePreference();
  const resolvedTheme = document.documentElement.dataset.theme === "dark"
    ? "dark"
    : resolveTheme(preference, window.matchMedia("(prefers-color-scheme: dark)").matches);

  currentThemeState = { preference, resolvedTheme };
  return currentThemeState;
}

function setThemePreference(preference: ThemePreference) {
  const resolvedTheme = applyThemePreference(preference);
  currentThemeState = { preference, resolvedTheme };
  themeListeners.forEach((listener) => listener());
}

export default function Navbar() {
  const { locale, setLocale } = useLocale();
  const content = useLandingContent();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { preference, resolvedTheme } = useSyncExternalStore(
    subscribeToTheme,
    getClientThemeSnapshot,
    getServerThemeSnapshot,
  );

  const scrollToHash = useCallback((hash: string, behavior: ScrollBehavior = "smooth") => {
    if (typeof window === "undefined") {
      return;
    }

    const id = hash.replace(/^#/, "");
    if (!id) {
      return;
    }

    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const wrapperRect = wrapperRef.current?.getBoundingClientRect();
    const navbarHeight = wrapperRect?.height ?? 0;
    const stickyOffset = Math.max(wrapperRect?.top ?? 0, 0);
    const topBuffer = navbarHeight + stickyOffset + (window.innerWidth < 520 ? 14 : 20);
    const availableViewportHeight = Math.max(window.innerHeight - topBuffer, 0);
    const centeredOffset = Math.max((availableViewportHeight - target.getBoundingClientRect().height) / 2, 0);
    const targetTop = window.scrollY + target.getBoundingClientRect().top - topBuffer - centeredOffset;

    window.scrollTo({ top: Math.max(0, targetTop), behavior });
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (preference !== "system") {
        return;
      }

      const systemTheme: ResolvedTheme = event.matches ? "dark" : "light";
      document.documentElement.dataset.theme = systemTheme;
      document.documentElement.classList.toggle("dark", systemTheme === "dark");
      document.documentElement.style.colorScheme = systemTheme;
      currentThemeState = { preference: "system", resolvedTheme: systemTheme };
      themeListeners.forEach((listener) => listener());
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [preference]);

  useEffect(() => {
    if (!window.location.hash) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToHash(window.location.hash, "auto");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [scrollToHash]);

  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      const href = hash.startsWith("#") ? hash : `#${hash}`;
      event.preventDefault();
      window.history.pushState(null, "", href);
      scrollToHash(href);
    },
    [scrollToHash],
  );

  const cycleTheme = () => {
    const nextPreference = THEME_ORDER[(THEME_ORDER.indexOf(preference) + 1) % THEME_ORDER.length];
    setThemePreference(nextPreference);
  };

  const themeLabel = useMemo(() => {
    if (preference === "system") {
      const resolvedLabel = resolvedTheme === "dark" ? content.navbar.theme.dark : content.navbar.theme.light;
      return `${content.navbar.theme.auto} (${resolvedLabel})`;
    }

    return preference === "dark" ? content.navbar.theme.dark : content.navbar.theme.light;
  }, [content.navbar.theme.auto, content.navbar.theme.dark, content.navbar.theme.light, preference, resolvedTheme]);

  return (
    <div ref={wrapperRef} className="sticky top-3 z-40 mx-auto w-[min(1180px,calc(100%-2rem))] pt-3 max-[820px]:w-[min(100%-1.25rem,1180px)] max-[520px]:top-[0.45rem] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:pt-[0.45rem]">
      <nav
        className="grid min-h-[4.25rem] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-[0.95rem] py-[0.7rem] shadow-[var(--shadow)] backdrop-blur-[20px] max-[820px]:grid-cols-[1fr_auto] max-[520px]:min-h-[3.8rem] max-[520px]:px-[0.7rem] max-[520px]:py-[0.55rem]"
        aria-label={content.navbar.ariaLabel}
      >
        <a
          className="inline-flex items-center gap-3 font-black tracking-[0.02em] max-[520px]:gap-[0.55rem] max-[520px]:text-[0.95rem]"
          href="#top"
          onClick={(event) => handleNavClick(event, "#top")}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-[#ff7f66] to-[#ffb38a] text-white shadow-[0_12px_24px_rgba(255,127,102,0.24)] max-[520px]:h-8 max-[520px]:w-8">
            S
          </span>
          <span>Superpen</span>
        </a>

        <div className="flex flex-wrap justify-center gap-4 max-[820px]:hidden">
          <a className="font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]" href="#features-title" onClick={(event) => handleNavClick(event, "#features-title")}>{content.navbar.nav.features}</a>
          <a className="font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]" href="#workflow-title" onClick={(event) => handleNavClick(event, "#workflow-title")}>{content.navbar.nav.workflow}</a>
          <a className="font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]" href="#faq-title" onClick={(event) => handleNavClick(event, "#faq-title")}>{content.navbar.nav.faq}</a>
          <a className="font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]" href="#download" onClick={(event) => handleNavClick(event, "#download")}>{content.navbar.nav.download}</a>
        </div>

        <div className="flex items-center gap-2 justify-self-end max-[520px]:gap-1.5">
          <div
            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] p-[0.22rem]"
            aria-label={content.navbar.languageLabel}
            role="group"
          >
            {i18nConfig.supportedLocales.map((supportedLocale) => {
              const active = locale === supportedLocale;
              return (
                <button
                  key={supportedLocale}
                  type="button"
                  onClick={() => setLocale(supportedLocale)}
                  className={active ? "rounded-full bg-[var(--foreground)] px-[0.72rem] py-[0.42rem] text-[0.78rem] font-extrabold text-[var(--background)] transition-colors duration-200" : "rounded-full px-[0.72rem] py-[0.42rem] text-[0.78rem] font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]"}
                  aria-pressed={active}
                  title={`${content.navbar.languageLabel}: ${supportedLocale === "en" ? "English" : "Türkçe"}`}
                >
                  {content.navbar.languageNames[supportedLocale]}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-[0.7rem] rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-[0.7rem] py-[0.35rem] pr-[0.45rem] text-[var(--foreground)] max-[520px]:gap-2 max-[520px]:pl-[0.5rem]"
            onClick={cycleTheme}
            aria-label={`${content.navbar.theme.titlePrefix}: ${themeLabel}. ${content.navbar.theme.cycleAriaLabel}`}
            aria-pressed={resolvedTheme === "dark"}
            title={`${content.navbar.theme.titlePrefix}: ${themeLabel}`}
          >
            <span className="inline-flex h-[1.8rem] w-[3.2rem] items-center rounded-full bg-[rgba(37,65,58,0.12)] p-[0.2rem] dark:bg-[rgba(203,221,214,0.14)]">
              <span
                className={
                  preference === "system"
                    ? resolvedTheme === "dark"
                      ? "h-[1.4rem] w-[1.4rem] translate-x-[0.6rem] rounded-full bg-linear-to-br from-[#72d5b7] to-[#8cb9ff] transition-all duration-200"
                      : "h-[1.4rem] w-[1.4rem] translate-x-[0.6rem] rounded-full bg-linear-to-br from-[#ffd28b] to-[#ff9d67] transition-all duration-200"
                    : resolvedTheme === "dark"
                      ? "h-[1.4rem] w-[1.4rem] translate-x-[1.2rem] rounded-full bg-linear-to-br from-[#72d5b7] to-[#8cb9ff] transition-all duration-200"
                      : "h-[1.4rem] w-[1.4rem] rounded-full bg-linear-to-br from-[#ffd28b] to-[#ff9d67] transition-all duration-200"
                }
              />
            </span>
            <span className="text-[0.9rem] font-extrabold max-[520px]:hidden">{themeLabel}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
