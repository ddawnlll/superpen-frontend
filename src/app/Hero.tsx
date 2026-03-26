"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const demoModes = [
  {
    id: "annotate",
    label: "Annotate",
    badge: "Lesson mode",
    note: "Circle mistakes, underline steps, and highlight key ideas in seconds.",
    colorClass: "is-coral",
    path: "M50 240 C150 190, 200 190, 290 165 S435 120, 540 92",
  },
  {
    id: "graph",
    label: "Graph",
    badge: "Graph mode",
    note: "Sketch curves and explain how every point moves without opening a heavy toolset.",
    colorClass: "is-mint",
    path: "M80 250 C145 230, 180 172, 230 145 S340 160, 385 216 S470 290, 530 235",
  },
  {
    id: "geometry",
    label: "Geometry",
    badge: "Shape mode",
    note: "Walk through angles and forms with clean shapes that keep the screen calm and readable.",
    colorClass: "is-gold",
    path: "M145 250 L290 110 L448 250 Z",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Hero() {
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
          <span className="pill">Friendly digital whiteboard for math</span>
          <h1>
            Superpen helps teachers and students
            <span> draw ideas with warmth.</span>
          </h1>
          <p className="hero-summary">
            Annotate any screen, explain equations in real time, and keep the
            interface gentle enough for students while staying fast for teaching.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#download">
              Try Superpen free
            </a>
            <a className="secondary-button" href="#demo">
              See the demo
            </a>
          </div>

          <ul className="hero-points" aria-label="Key product benefits">
            <li>Live drawing over slides, browsers, and PDFs</li>
            <li>Quick highlights for formulas, graphs, and worked examples</li>
            <li>Minimal toolbar that stays out of the way</li>
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

          <div className="demo-stage">
            <div className="grid-surface" aria-hidden="true" />

            <div className="equation-card">
              <span className="equation-label">Example lesson</span>
              <p>y = x^2 - 4x + 3</p>
            </div>

            <svg
              viewBox="0 0 620 320"
              className="demo-svg"
              role="img"
              aria-label="Animated drawing preview of the Superpen app"
            >
              <line x1="70" y1="270" x2="550" y2="270" className="axis-line" />
              <line x1="130" y1="55" x2="130" y2="280" className="axis-line" />

              {activeMode.id === "geometry" ? (
                <>
                  <motion.path
                    d={activeMode.path}
                    fill="rgba(253, 214, 113, 0.16)"
                    stroke="#f4a20d"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                  <motion.circle
                    cx="290"
                    cy="110"
                    r="10"
                    fill="#f4a20d"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.6 }}
                  />
                </>
              ) : (
                <motion.path
                  key={activeMode.id}
                  d={activeMode.path}
                  fill="none"
                  stroke={activeMode.id === "annotate" ? "#ff7f66" : "#37b88f"}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              )}

              <motion.circle
                cx="445"
                cy="146"
                r="26"
                className="focus-ring"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </svg>

            <motion.div
              key={activeMode.id}
              className={`note-card ${activeMode.colorClass}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <strong>{activeMode.label}</strong>
              <p>{activeMode.note}</p>
            </motion.div>
          </div>

          <div className="mini-toolbar" aria-hidden="true">
            <span className="tool-dot active" />
            <span className="tool-dot" />
            <span className="tool-dot" />
            <span className="tool-pill">Pen</span>
            <span className="tool-pill">Highlighter</span>
            <span className="tool-pill">Shapes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
