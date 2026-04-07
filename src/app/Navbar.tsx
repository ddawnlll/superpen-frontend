"use client";

import { useEffect, useMemo, useState } from "react";

type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "superpen-theme";
const THEME_ORDER: ThemePreference[] = ["system", "light", "dark"];

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

  return resolved;
}

export default function Navbar() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof document === "undefined") {
      return "system";
    }

    const currentPreference = document.documentElement.dataset.themePreference;
    return currentPreference === "light" || currentPreference === "dark" || currentPreference === "system"
      ? currentPreference
      : readThemePreference();
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    applyThemePreference(preference);
  }, [preference]);

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
      setResolvedTheme(systemTheme);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [preference]);

  const cycleTheme = () => {
    const nextPreference = THEME_ORDER[(THEME_ORDER.indexOf(preference) + 1) % THEME_ORDER.length];
    const nextResolvedTheme = applyThemePreference(nextPreference);
    setPreference(nextPreference);
    setResolvedTheme(nextResolvedTheme);
  };

  const themeLabel = useMemo(() => {
    if (preference === "system") {
      return `Auto (${resolvedTheme})`;
    }

    return preference === "dark" ? "Dark" : "Light";
  }, [preference, resolvedTheme]);

  return (
    <div className="sticky top-3 z-40 mx-auto w-[min(1180px,calc(100%-2rem))] pt-3 max-[820px]:w-[min(100%-1.25rem,1180px)] max-[520px]:top-[0.45rem] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:pt-[0.45rem]">
      <nav
        className="grid min-h-[4.25rem] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-[0.95rem] py-[0.7rem] shadow-[var(--shadow)] backdrop-blur-[20px] max-[820px]:grid-cols-[1fr_auto] max-[520px]:min-h-[3.8rem] max-[520px]:px-[0.7rem] max-[520px]:py-[0.55rem]"
        aria-label="Primary"
      >
        <a className="inline-flex items-center gap-3 font-black tracking-[0.02em] max-[520px]:gap-[0.55rem] max-[520px]:text-[0.95rem]" href="#top">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-[#ff7f66] to-[#ffb38a] text-white shadow-[0_12px_24px_rgba(255,127,102,0.24)] max-[520px]:h-8 max-[520px]:w-8">
            S
          </span>
          <span>Superpen</span>
        </a>

        <div className="flex flex-wrap justify-center gap-4 max-[820px]:hidden">
          <a className="font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]" href="#features-title">Features</a>
          <a className="font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]" href="#workflow-title">Workflow</a>
          <a className="font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]" href="#faq-title">FAQ</a>
          <a className="font-extrabold text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]" href="#download">Download</a>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-[0.7rem] rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-[0.7rem] py-[0.35rem] pr-[0.45rem] text-[var(--foreground)] max-[520px]:gap-2 max-[520px]:pl-[0.5rem]"
          onClick={cycleTheme}
          aria-label={`Theme: ${themeLabel}. Click to cycle between automatic, light, and dark modes.`}
          aria-pressed={resolvedTheme === "dark"}
          title={`Theme: ${themeLabel}`}
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
          <span className="text-[0.9rem] font-extrabold max-[520px]:text-[0.82rem]">{themeLabel}</span>
        </button>
      </nav>
    </div>
  );
}
