"use client";

import { useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("superpen-theme", theme);
}

export default function Navbar() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const saved = localStorage.getItem("superpen-theme");
    const preferredDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme: Theme = saved === "dark" || (!saved && preferredDark) ? "dark" : "light";
    applyTheme(nextTheme);
    return nextTheme;
  });

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

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
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={theme === "dark"}
        >
          <span className="inline-flex h-[1.8rem] w-[3.2rem] items-center rounded-full bg-[rgba(37,65,58,0.12)] p-[0.2rem]">
            <span
              className={theme === "dark"
                ? "h-[1.4rem] w-[1.4rem] translate-x-[1.2rem] rounded-full bg-linear-to-br from-[#72d5b7] to-[#8cb9ff] transition-all duration-200"
                : "h-[1.4rem] w-[1.4rem] rounded-full bg-linear-to-br from-[#ffd28b] to-[#ff9d67] transition-all duration-200"
              }
            />
          </span>
          <span className="text-[0.9rem] font-extrabold max-[520px]:text-[0.82rem]">{theme === "dark" ? "Dark" : "Light"}</span>
        </button>
      </nav>
    </div>
  );
}
