"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Release } from "@/lib/superpen-api";

const demoModes = [
  {
    id: "annotate",
    label: "Annotate",
    badge: "Pen overlay",
    note: "The toolbar floats above your desktop while the canvas stays transparent over the content underneath.",
    colorClass: "is-coral",
    activeTool: "Pen",
    status: "Click-through outside toolbar",
  },
  {
    id: "screenshot",
    label: "Screenshot",
    badge: "Capture flow",
    note: "Drag a region, then copy it to the clipboard or save it to your computer from the inline action bar.",
    colorClass: "is-mint",
    activeTool: "Shot",
    status: "Selection ready",
  },
  {
    id: "board",
    label: "Board",
    badge: "Board mode",
    note: "Board mode gives you a focused background for live explanation while keeping the same tools close by.",
    colorClass: "is-gold",
    activeTool: "Board",
    status: "Black board active",
  },
] as const;

const toolbarButtons = ["Cursor", "Pen", "Erase", "Select", "Shot", "Shape", "Board"] as const;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

type HeroProps = {
  currentRelease: Release | null;
};

export default function Hero({ currentRelease }: HeroProps) {
  const [activeMode, setActiveMode] = useState(demoModes[0]);

  return (
    <section className="hero-section">
      <div className="hero-backdrop" aria-hidden="true">
        <span className="blob blob-one" />
        <span className="blob blob-two" />
        <span className="blob blob-three" />
      </div>

      <div className="hero-layout">
        <motion.div className="hero-copy" {...fadeUp}>
          <span className="pill">Screen annotation overlay</span>
          <h1>
            Superpen lets you
            <span> draw over anything on screen.</span>
          </h1>
          <p className="hero-meta">Qt-based. Alpha early access.</p>
          <p className="hero-summary">
            A desktop overlay for pen input, highlighting, text, shapes,
            screenshots, and fast live explanation, with the product heading
            toward a broader cross-platform release.
          </p>
          {currentRelease && (
            <p className="hero-release-line">
              Current release: <strong>{currentRelease.version}</strong> for {currentRelease.platform}
            </p>
          )}

          <div className="hero-actions">
            <a
              className="primary-button"
              href={currentRelease?.downloadUrl || "#download"}
              data-analytics-event="download_started"
              data-analytics-label="Hero download"
              data-analytics-target="hero-download"
              data-analytics-release={currentRelease?.version || ""}
            >
              Try Superpen free
            </a>
            <a
              className="secondary-button"
              href="#demo"
              data-analytics-event="click"
              data-analytics-label="Hero demo"
              data-analytics-target="hero-demo"
            >
              See the demo
            </a>
          </div>

          <ul className="hero-points" aria-label="Key product benefits">
            <li>Live markup over slides, browsers, PDFs, and apps</li>
            <li>Pen, phosphor highlighter, text, shapes, and screenshots</li>
            <li>Floating toolbar with saved settings and shortcuts</li>
          </ul>
        </motion.div>

        <motion.div className="hero-demo-card" id="demo" {...fadeUp}>
          <div className="demo-toolbar">
            <div className="window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className={`demo-badge ${activeMode.colorClass}`}>{activeMode.badge}</span>
          </div>

          <div className="mode-switcher" role="tablist" aria-label="Interactive Superpen demo">
            {demoModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={activeMode.id === mode.id}
                className={activeMode.id === mode.id ? "mode-button active" : "mode-button"}
                onClick={() => setActiveMode(mode)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className={`demo-stage demo-stage-${activeMode.id}`}>
            <div className="grid-surface" aria-hidden="true" />

            <div className="demo-underlay">
              <div className="demo-window">
                <div className="demo-window-bar">
                  <span className="demo-window-title">Shared screen</span>
                  <span className="demo-window-tab">Lesson notes</span>
                </div>

                <div className="demo-window-body">
                  <div className="demo-sidebar">
                    <span className="demo-sidebar-chip active">Algebra</span>
                    <span className="demo-sidebar-chip">Screenshots</span>
                    <span className="demo-sidebar-chip">Custom shapes</span>
                  </div>

                  <div className="demo-content">
                    <div className="demo-content-card">
                      <span className="demo-content-label">Visible underneath Superpen</span>
                      <h3>Quadratic review</h3>
                      <p>Factor the expression and show each step clearly.</p>
                    </div>

                    <div className="demo-lines" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overlay-header">
              <div className="overlay-chip">
                <span className="overlay-chip-label">Active tool</span>
                <strong>{activeMode.activeTool}</strong>
              </div>
              <div className="overlay-chip">
                <span className="overlay-chip-label">Overlay state</span>
                <strong>{activeMode.status}</strong>
              </div>
            </div>

            <div className="overlay-toolbar-panel" aria-hidden="true">
              {toolbarButtons.map((button) => (
                <span
                  key={button}
                  className={
                    button === activeMode.activeTool
                      ? "overlay-tool-button active"
                      : "overlay-tool-button"
                  }
                >
                  {button}
                </span>
              ))}

              <div className="overlay-toolbar-meta">
                <div className="overlay-swatch">
                  <span className="overlay-swatch-dot" />
                  <strong>#FF4444</strong>
                </div>
                <div className="overlay-size">
                  <span className="overlay-size-dot" />
                  <strong>3 px</strong>
                </div>
              </div>
            </div>

            {activeMode.id === "annotate" && (
              <motion.svg
                key="annotate-canvas"
                viewBox="0 0 620 360"
                className="demo-svg"
                role="img"
                aria-label="Preview of Superpen drawing over a shared screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                <motion.path
                  d="M188 167 C248 131, 311 121, 374 126 S493 151, 541 191"
                  fill="none"
                  stroke="rgba(255, 228, 92, 0.34)"
                  strokeWidth="26"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
                <motion.path
                  d="M176 178 C235 157, 318 150, 400 161 S508 186, 548 204"
                  fill="none"
                  stroke="#ff4444"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                />
                <motion.path
                  d="M318 108 L318 238"
                  fill="none"
                  stroke="#ff7a59"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                />
                <motion.circle
                  cx="318"
                  cy="175"
                  r="58"
                  fill="none"
                  stroke="#ff7f66"
                  strokeWidth="7"
                  strokeDasharray="8 10"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.45 }}
                />
                <text x="355" y="112" className="demo-canvas-text">
                  explain this step
                </text>
              </motion.svg>
            )}

            {activeMode.id === "screenshot" && (
              <>
                <div className="screenshot-selection" aria-hidden="true">
                  <span className="selection-handle top-left" />
                  <span className="selection-handle top-right" />
                  <span className="selection-handle bottom-left" />
                  <span className="selection-handle bottom-right" />
                </div>

                <motion.div
                  key="screenshot-actions"
                  className="screenshot-actions-bar"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <span>Copy</span>
                  <span>Save</span>
                  <span>Cancel</span>
                </motion.div>
              </>
            )}

            {activeMode.id === "board" && (
              <>
                <motion.svg
                  key="board-canvas"
                  viewBox="0 0 620 360"
                  className="demo-svg board-overlay"
                  role="img"
                  aria-label="Preview of Superpen board mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <motion.path
                    d="M150 244 C207 191, 274 157, 331 139 S457 120, 527 158"
                    fill="none"
                    stroke="#f2f2f2"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M229 242 L318 119 L417 242"
                    fill="none"
                    stroke="#ff7a59"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                  />
                  <text x="188" y="96" className="demo-canvas-text board-text">
                    board mode on
                  </text>
                </motion.svg>

                <div className="board-pill">
                  <span className="board-pill-dot" />
                  <strong>Background: black board</strong>
                </div>
              </>
            )}
          </div>

          <motion.div
            key={activeMode.id}
            className={`demo-note-row note-card ${activeMode.colorClass}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <strong>{activeMode.label}</strong>
            <p>{activeMode.note}</p>
          </motion.div>

          <div className="mini-toolbar" aria-hidden="true">
            <span className="tool-dot active" />
            <span className="tool-dot" />
            <span className="tool-dot" />
            <span className="tool-pill">Click-through</span>
            <span className="tool-pill">Saved settings</span>
            <span className="tool-pill">Floating toolbar</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
