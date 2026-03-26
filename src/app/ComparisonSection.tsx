"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ComparisonRow } from "./landing-content";

const BADGES = [
  { label: "No subscription", icon: "*" },
  { label: "48 math shapes", icon: "48" },
  { label: "Saved custom shapes", icon: "<>" },
  { label: "Custom colors", icon: "o" },
  { label: "Board mode", icon: "#" },
  { label: "Editable shortcuts", icon: "K" },
];

type AnimatedBadgeProps = {
  label: string;
  icon: string;
  index: number;
};

function AnimatedBadge({ label, icon, index }: AnimatedBadgeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      className="comparison-badge"
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.82, y: 12 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.18, delay: index * 0.03 }
          : { delay: index * 0.08, type: "spring", stiffness: 280, damping: 20 }
      }
      whileHover={prefersReducedMotion ? undefined : { scale: 1.04, y: -2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
    >
      <span className="badge-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
      <span
        className="badge-check"
        aria-hidden="true"
      >
        +
      </span>
    </motion.span>
  );
}

type ComparisonRowItemProps = {
  row: ComparisonRow;
  index: number;
};

function ComparisonRowItem({ row, index }: ComparisonRowItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const prefersReducedMotion = useReducedMotion();
  const isWinning = row.winner === "superpen";
  const isBoth = row.winner === "both";

  const categoryDelay = index * 0.05;
  const superpenDelay = categoryDelay + 0.06;
  const epicDelay = categoryDelay + 0.12;

  return (
    <div
      ref={ref}
      className={[
        "comparison-row",
        isWinning ? "is-winning" : "",
        isBoth ? "is-balanced" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="row"
    >
      <motion.div
        className="comparison-cell comparison-category"
        role="cell"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
        animate={
          inView
            ? prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, x: 0 }
            : undefined
        }
        transition={{ delay: categoryDelay, duration: 0.35, ease: "easeOut" }}
      >
        <strong>{row.label}</strong>
      </motion.div>

      <motion.div
        className="comparison-cell comparison-superpen"
        role="cell"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -28 }}
        animate={
          inView
            ? prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, x: 0 }
            : undefined
        }
        transition={{ delay: superpenDelay, duration: 0.42, ease: "easeOut" }}
      >
        {isWinning ? (
          <motion.span
            className="comparison-pill"
            initial={prefersReducedMotion ? false : { scale: 0.84, opacity: 0 }}
            animate={
              inView
                ? prefersReducedMotion
                  ? { opacity: 1 }
                  : { scale: 1, opacity: 1 }
                : undefined
            }
            transition={{
              delay: superpenDelay + 0.08,
              type: "spring",
              stiffness: 360,
              damping: 26,
            }}
          >
            Superpen leads
          </motion.span>
        ) : null}
        <p>{row.superpen}</p>
      </motion.div>

      <motion.div
        className="comparison-cell"
        role="cell"
        initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
        animate={
          inView
            ? prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, x: 0 }
            : undefined
        }
        transition={{ delay: epicDelay, duration: 0.42, ease: "easeOut" }}
      >
        <p>{row.epicPen}</p>
      </motion.div>

      {isWinning ? (
        <motion.div
          className="winning-glow"
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={
            inView
              ? prefersReducedMotion
                ? { opacity: 0.22 }
                : { opacity: [0, 0.48, 0.26] }
              : undefined
          }
          transition={{ delay: epicDelay + 0.08, duration: 0.8, ease: "easeOut" }}
        />
      ) : null}
    </div>
  );
}

type ComparisonSectionProps = {
  comparisonRows: ComparisonRow[];
};

export default function ComparisonSection({ comparisonRows }: ComparisonSectionProps) {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: tableRef,
    offset: ["start 70%", "end 35%"],
  });
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="section" aria-labelledby="comparison-title">
      <motion.div
        className="section-heading"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <span className="kicker">Superpen vs Epic Pen</span>
        <h2 id="comparison-title">
          The comparison gets interesting when you look past basic screen ink.
        </h2>
        <p>
          Epic Pen is established and polished, but Superpen already pulls ahead in
          the areas that matter most for math-heavy explanation and deeper
          customization.
        </p>
      </motion.div>

      <motion.div
        className="comparison-spotlight"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
      >
        <div className="comparison-copy">
          <span className="comparison-kicker">Why Superpen stands out</span>
          <h3>More built in, less paywall, and far more math-first tooling.</h3>
          <p>
            The strongest current advantages are straightforward: no subscription,
            48 built-in math shapes, reusable custom-shape creation, and a more
            ambitious annotation workflow than the usual pen-plus-highlighter setup.
          </p>
        </div>

        <div className="comparison-badges" aria-label="Superpen advantages">
          {BADGES.map((badge, index) => (
            <AnimatedBadge key={badge.label} {...badge} index={index} />
          ))}
        </div>
      </motion.div>

      <div className="comparison-table-wrapper" ref={tableRef}>
        <div className="comparison-progress-track" aria-hidden="true">
          <motion.div
            className="comparison-progress-bar"
            style={{ scaleX: prefersReducedMotion ? 1 : progressScaleX }}
          />
        </div>

        <div className="comparison-table" role="table" aria-label="Superpen compared with Epic Pen">
          <div className="comparison-head comparison-row" role="row">
            <span role="columnheader">Category</span>
            <span role="columnheader" className="is-superpen">
              Superpen
            </span>
            <span role="columnheader">Epic Pen</span>
          </div>

          {comparisonRows.map((row, index) => (
            <ComparisonRowItem key={row.label} row={row} index={index} />
          ))}
        </div>
      </div>

      <motion.p
        className="comparison-note"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        Comparison reflects the current Superpen repository and Epic Pen&apos;s
        public features, user-guide, and pricing pages.
      </motion.p>
    </section>
  );
}
