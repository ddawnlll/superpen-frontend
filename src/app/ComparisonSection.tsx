"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
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
      className={[
        "inline-flex shrink-0 items-center gap-3 rounded-full border border-[rgba(255,127,102,0.18)] bg-[var(--surface-strong)] px-3 py-2 text-[0.92rem] font-extrabold text-[var(--foreground)] shadow-[0_14px_30px_rgba(79,63,37,0.08)] transition-transform duration-200",
        prefersReducedMotion ? "" : "hover:-translate-y-0.5 hover:scale-[1.04] active:scale-[0.98]",
      ].join(" ")}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.82, y: 12 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.18, delay: index * 0.03 }
          : { delay: index * 0.08, type: "spring", stiffness: 280, damping: 20 }
      }
    >
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(255,127,102,0.18),rgba(114,213,183,0.24))] text-[0.78rem] font-black text-[#b95845]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="inline-flex items-center gap-2 after:inline-flex after:h-5 after:w-5 after:items-center after:justify-center after:rounded-full after:bg-[rgba(114,213,183,0.18)] after:text-[0.78rem] after:font-black after:text-[#1d7f62] after:content-['+']">
        {label}
      </span>
    </motion.span>
  );
}

type RaceBarProps = {
  ariaLabel: string;
  side: "superpen" | "epic";
  inView: boolean;
  isBoth: boolean;
};

function RaceBar({ ariaLabel, side, inView, isBoth }: RaceBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const isSuperpen = side === "superpen";
  const epicScale = isBoth ? 0.48 : 0.52;

  return (
    <div
      className={[
        "relative mt-3 h-[6px] overflow-visible rounded-full",
        isSuperpen ? "bg-[rgba(114,213,183,0.12)]" : "bg-[rgba(120,120,120,0.14)]",
      ].join(" ")}
      role="img"
      aria-label={ariaLabel}
    >
      <motion.div
        className={[
          "absolute inset-y-0 left-0 rounded-full",
          isSuperpen
            ? "bg-[linear-gradient(90deg,#72d5b7,#3db896)]"
            : "bg-[rgba(120,120,120,0.25)]",
        ].join(" ")}
        initial={prefersReducedMotion ? false : { scaleX: 0 }}
        animate={
          inView
            ? {
                scaleX: isSuperpen ? 1 : epicScale,
              }
            : undefined
        }
        style={{ width: "100%", transformOrigin: "left" }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : isSuperpen
              ? { delay: 0.12, type: "spring", stiffness: 60, damping: 18 }
              : { delay: 0.36, type: "spring", stiffness: 40, damping: 22 }
        }
      />

      {isSuperpen ? (
        <motion.span
          className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#72d5b7] shadow-[0_0_0_4px_rgba(114,213,183,0.25)]"
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 1 }}
          animate={
            inView
              ? prefersReducedMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    scale: [1, 1.5, 1],
                  }
              : undefined
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  delay: 0.52,
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
          }
        />
      ) : null}
    </div>
  );
}

type RaceRowProps = {
  row: ComparisonRow;
  superpenLeadsLabel: string;
  competitorLabel: string;
};

function RaceRow({ row, superpenLeadsLabel, competitorLabel }: RaceRowProps) {
  const prefersReducedMotion = useReducedMotion();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(rowRef, { once: true, amount: 0.2 });
  const isWinning = row.winner === "superpen";
  const isBoth = row.winner === "both";

  return (
    <div
      ref={rowRef}
      className="grid gap-px border-b border-[var(--line)] bg-[var(--line)] last:border-b-0 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
      role="row"
    >
      <div
        className="bg-[rgba(255,255,255,0.72)] px-6 py-6 transition-colors duration-200 hover:bg-[rgba(114,213,183,0.05)] dark:bg-[rgba(18,26,26,0.74)] max-[520px]:px-4"
        role="cell"
      >
        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.24, delay: 0 }}
        >
          <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">{row.label}</span>
          {isWinning ? (
            <motion.span
              className="inline-flex rounded-full bg-[rgba(114,213,183,0.2)] px-2.5 py-[0.35rem] text-[0.69rem] font-extrabold uppercase tracking-[0.1em] text-[#1d7f62]"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { delay: 0.52, type: "spring", stiffness: 340, damping: 24 }
              }
            >
              {superpenLeadsLabel}
            </motion.span>
          ) : null}
        </motion.div>

        <RaceBar ariaLabel="Superpen: full score" side="superpen" inView={inView} isBoth={isBoth} />

        <motion.p
          className="mt-3 text-[0.97rem] font-semibold leading-[1.72] text-[var(--foreground)]"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.34, delay: 0.08, ease: "easeOut" }}
        >
          {row.superpen}
        </motion.p>
      </div>

      <div className="bg-[var(--surface)] px-6 py-6 max-[520px]:px-4" role="cell">
        <div className="md:hidden">
          <div
            className="mb-4 border-y border-[var(--line)] py-2 text-center text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]"
            aria-hidden="true"
          >
            ── vs ──
          </div>
        </div>

        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.24, delay: 0 }}
        >
          <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">{row.label}</span>
          <span className="sr-only">{competitorLabel}</span>
        </motion.div>

        <RaceBar ariaLabel="EpicPen: partial score" side="epic" inView={inView} isBoth={isBoth} />

        <motion.p
          className="mt-3 text-[0.95rem] leading-[1.72] text-[var(--muted)]"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, delay: 0.28, ease: "easeOut" }}
        >
          {row.epicPen}
        </motion.p>
      </div>
    </div>
  );
}

export default function ComparisonSection() {
  const content = useLandingContent();
  const comparisonRows = content.comparisonSection.rows;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

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
        transition={{ duration: 0.5, ease: "easeOut" }}
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

      <div className="mt-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="flex min-w-full gap-3 md:flex-wrap max-md:w-max max-md:flex-nowrap"
          aria-label={content.comparisonSection.highlightBadge}
        >
          {content.comparisonSection.badges.map((badge, index) => (
            <AnimatedBadge key={badge.label} {...badge} index={index} />
          ))}
        </div>
      </div>

      <motion.div
        ref={panelRef}
        className="relative mt-8"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div
          className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-[3px] rounded-full bg-[rgba(114,213,183,0.10)] md:block"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-full origin-top rounded-full bg-[linear-gradient(180deg,#ff7f66,#72d5b7)]"
            initial={prefersReducedMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div
          className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,250,248,0.98))] shadow-[var(--shadow)] dark:bg-[linear-gradient(180deg,rgba(18,26,26,0.98),rgba(14,22,20,0.98))] max-[700px]:rounded-[1.5rem] max-[520px]:rounded-[1.2rem]"
          role="table"
          aria-label={content.comparisonSection.tableAriaLabel}
        >
          <div
            className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_top_left,rgba(114,213,183,0.08),transparent_55%)] md:block"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[calc(50%+1.5rem)] border-l-[3px] border-[rgba(114,213,183,0.45)] md:block" aria-hidden="true" />

          <div className="relative z-[1]">
            <div className="border-b border-[var(--line)] md:sticky md:top-0 md:z-10 md:backdrop-blur-[8px]" role="row">
              <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                <div
                  className="border-r border-[var(--line)] bg-[rgba(255,255,255,0.92)] px-6 py-4 dark:bg-[rgba(18,26,26,0.9)] max-[520px]:px-4"
                  role="columnheader"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[#1d7f62]">
                    <span aria-hidden="true">♛</span>
                    <span>{content.comparisonSection.headers.superpen}</span>
                    <span className="inline-flex rounded-full bg-[rgba(114,213,183,0.16)] px-2.5 py-[0.35rem] text-[0.68rem] text-[#1d7f62]">
                      {content.comparisonSection.highlightBadge}
                    </span>
                  </div>
                </div>
                <div className="bg-[var(--surface)] px-6 py-4 max-[520px]:px-4" role="columnheader">
                  <div className="flex items-center gap-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
                    <span aria-hidden="true">○</span>
                    <span>{content.comparisonSection.headers.epicPen}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {comparisonRows.map((row) => (
                <RaceRow
                  key={row.label}
                  row={row}
                  superpenLeadsLabel={content.comparisonSection.superpenLeads}
                  competitorLabel={content.comparisonSection.headers.epicPen}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

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
