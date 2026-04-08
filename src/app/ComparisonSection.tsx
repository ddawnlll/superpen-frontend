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
import { useLandingContent } from "./LocaleProvider";

type AnimatedBadgeProps = {
  label: string;
  icon: string;
  index: number;
};

function AnimatedBadge({ label, icon, index }: AnimatedBadgeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      className="inline-flex items-center gap-3 rounded-full border border-[rgba(255,127,102,0.18)] bg-[var(--surface-strong)] px-4 py-[0.8rem] text-[0.92rem] font-extrabold text-[var(--foreground)] shadow-[0_14px_30px_rgba(79,63,37,0.08)]"
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
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(255,127,102,0.18),rgba(114,213,183,0.24))] text-[0.78rem] font-black text-[#b95845]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>{label}</span>
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(114,213,183,0.18)] text-[0.82rem] font-black text-[#1d7f62]"
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
  superpenLeadsLabel: string;
};

function ComparisonRowItem({ row, index, superpenLeadsLabel }: ComparisonRowItemProps) {
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
        "relative grid gap-px overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-[var(--line)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)]",
        isWinning ? "shadow-[0_16px_34px_rgba(114,213,183,0.12)]" : "shadow-[0_14px_30px_rgba(79,63,37,0.06)]",
        isBoth ? "ring-1 ring-[rgba(255,127,102,0.14)]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="row"
    >
      <motion.div
        className="bg-[var(--surface-strong)] px-5 py-4 text-[0.95rem] font-semibold text-[var(--foreground)] max-[767px]:border-b max-[767px]:border-[var(--line)]"
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
        className="relative bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,251,248,0.96))] px-5 py-4 dark:bg-[linear-gradient(180deg,rgba(18,28,26,0.98),rgba(15,23,22,0.98))]"
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
            className="mb-3 inline-flex rounded-full bg-[rgba(114,213,183,0.2)] px-3 py-[0.45rem] text-[0.76rem] font-extrabold uppercase tracking-[0.08em] text-[#1d7f62]"
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
            {superpenLeadsLabel}
          </motion.span>
        ) : null}
        <p className="relative z-[1] text-[0.97rem] leading-[1.7] text-[var(--foreground)]">{row.superpen}</p>
      </motion.div>

      <motion.div
        className="bg-[var(--surface)] px-5 py-4"
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
        <p className="text-[0.97rem] leading-[1.7] text-[var(--muted)]">{row.epicPen}</p>
      </motion.div>

      {isWinning ? (
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-[33%] right-0 bg-[radial-gradient(circle_at_left,rgba(114,213,183,0.18),transparent_55%)]"
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

export default function ComparisonSection() {
  const content = useLandingContent();
  const comparisonRows = content.comparisonSection.rows;
  const tableRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: tableRef,
    offset: ["start 70%", "end 35%"],
  });
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      className="mx-auto my-0 w-[min(1180px,calc(100%-2rem))] px-[clamp(0rem,1vw,0.25rem)] py-[clamp(3.75rem,7vw,5.75rem)] max-[820px]:w-[min(100%-1.25rem,1180px)] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:py-[2.8rem]"
      aria-labelledby="comparison-title"
    >
      <motion.div
        className="mx-auto max-w-[44rem] text-center max-[700px]:text-left"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <span className="inline-flex items-center rounded-full border border-[rgba(255,127,102,0.18)] bg-[var(--surface-strong)] px-3 py-[0.55rem] text-[0.76rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d] shadow-[0_10px_24px_rgba(210,124,102,0.08)]">
          {content.comparisonSection.badge}
        </span>
        <h2
          id="comparison-title"
          className="mt-4 text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.35rem)] leading-[1.04] tracking-[-0.035em] text-[var(--foreground)]"
        >
          {content.comparisonSection.title}
        </h2>
        <p className="mt-4 text-[1.02rem] leading-[1.8] text-[var(--muted)] max-[520px]:text-[0.96rem]">
          {content.comparisonSection.description}
        </p>
      </motion.div>

      <motion.div
        className="mt-10 grid gap-6 rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(246,250,248,0.98))] p-[clamp(1.35rem,3vw,2.25rem)] shadow-[var(--shadow)] dark:bg-[linear-gradient(135deg,rgba(18,26,26,0.98),rgba(14,22,20,0.98))] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] max-[700px]:rounded-[1.5rem] max-[520px]:rounded-[1.2rem] max-[520px]:p-4"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
      >
        <div>
          <span className="inline-flex items-center rounded-full bg-[rgba(114,213,183,0.18)] px-3 py-[0.5rem] text-[0.76rem] font-extrabold uppercase tracking-[0.1em] text-[#1d7f62]">
            {content.comparisonSection.highlightBadge}
          </span>
          <h3 className="mt-4 text-balance text-[clamp(1.55rem,3vw,2.25rem)] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            {content.comparisonSection.highlightTitle}
          </h3>
          <p className="mt-4 text-[0.99rem] leading-[1.78] text-[var(--muted)]">
            {content.comparisonSection.highlightDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-3" aria-label={content.comparisonSection.highlightBadge}>
          {content.comparisonSection.badges.map((badge, index) => (
            <AnimatedBadge key={badge.label} {...badge} index={index} />
          ))}
        </div>
      </motion.div>

      <div className="mt-8" ref={tableRef}>
        <div
          className="h-2 overflow-hidden rounded-full bg-[rgba(37,65,58,0.08)] dark:bg-[rgba(203,221,214,0.1)]"
          aria-hidden="true"
        >
          <motion.div
            className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#ff7f66,#72d5b7)]"
            style={{ scaleX: prefersReducedMotion ? 1 : progressScaleX }}
          />
        </div>

        <div className="mt-4 grid gap-3" role="table" aria-label={content.comparisonSection.tableAriaLabel}>
          <div
            className="hidden grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-px overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[var(--line)] md:grid"
            role="row"
          >
            <span
              className="bg-[var(--surface-strong)] px-5 py-4 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]"
              role="columnheader"
            >
              {content.comparisonSection.headers.category}
            </span>
            <span
              className="bg-[rgba(114,213,183,0.14)] px-5 py-4 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[#1d7f62]"
              role="columnheader"
            >
              {content.comparisonSection.headers.superpen}
            </span>
            <span
              className="bg-[var(--surface-strong)] px-5 py-4 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]"
              role="columnheader"
            >
              {content.comparisonSection.headers.epicPen}
            </span>
          </div>

          {comparisonRows.map((row, index) => (
            <ComparisonRowItem key={row.label} row={row} index={index} superpenLeadsLabel={content.comparisonSection.superpenLeads} />
          ))}
        </div>
      </div>

      <motion.p
        className="mt-5 text-center text-[0.88rem] leading-[1.7] text-[var(--muted)] max-[700px]:text-left"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {content.comparisonSection.footer}
      </motion.p>
    </section>
  );
}
