"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("superpen-theme", theme);
}

export default function Navbar() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("superpen-theme");
    const preferredDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme: Theme = saved === "dark" || (!saved && preferredDark) ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="site-nav-shell">
      <nav className="site-nav" aria-label="Primary">
        <a className="site-brand" href="#top">
          <span className="site-brand-mark">S</span>
          <span>Superpen</span>
        </a>

        <div className="site-nav-links">
          <a href="#features-title">Features</a>
          <a href="#workflow-title">Workflow</a>
          <a href="#faq-title">FAQ</a>
          <a href="#download">Download</a>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={theme === "dark"}
        >
          <span className="theme-toggle-track">
            <span className={theme === "dark" ? "theme-toggle-thumb is-dark" : "theme-toggle-thumb"} />
          </span>
          <span className="theme-toggle-label">{theme === "dark" ? "Dark" : "Light"}</span>
        </button>
      </nav>
    </div>
  );
}
