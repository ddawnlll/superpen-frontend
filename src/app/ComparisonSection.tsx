"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
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
      className="inline-flex shrink-0 items-center gap-3 rounded-full border border-[rgba(255,127,102,0.18)] bg-[var(--surface-strong)] px-3 py-2 text-[0.92rem] font-extrabold text-[var(--foreground)] shadow-[0_14px_30px_rgba(79,63,37,0.08)]"
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
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(255,127,102,0.18),rgba(114,213,183,0.24))] text-[0.78rem] font-black text-[#b95845]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>{label}</span>
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(114,213,183,0.18)] text-[0.78rem] font-black text-[#1d7f62]"
        aria-hidden="true"
      >
        +
      </span>
    </motion.span>
  );
}

type ColumnEntryProps = {
  row: ComparisonRow;
  index: number;
  superpenLeadsLabel: string;
  side: "superpen" | "epic";
  prefersReducedMotion: boolean | null;
};

function ColumnEntry({ row, index, superpenLeadsLabel, side, prefersReducedMotion }: ColumnEntryProps) {
  const isSuperpen = side === "superpen";
  const isWinning = row.winner === "superpen";

  const entryVariants: Variants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: isSuperpen ? -20 : 20 },
    show: (customIndex: number) => ({
      opacity: 1,
      x: 0,
      transition: prefersReducedMotion
        ? { duration: 0.2, delay: isSuperpen ? customIndex * 0.03 : 0 }
        : {
            duration: 0.42,
            delay: isSuperpen ? 0.14 + customIndex * 0.08 : 0.22,
            ease: "easeOut",
          },
    }),
  };

  const badgeVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.84 },
    show: {
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0.2, delay: 0.04 }
        : { delay: 0.38 + index * 0.08, type: "spring", stiffness: 360, damping: 24 },
    },
  };

  return (
    <motion.div
      className="border-b border-[var(--line)] px-5 py-5 last:border-b-0 max-[520px]:px-4"
      variants={entryVariants}
      custom={index}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">{row.label}</span>
        {isSuperpen && isWinning ? (
          <motion.span
            className="inline-flex rounded-full bg-[rgba(114,213,183,0.2)] px-2.5 py-[0.35rem] text-[0.69rem] font-extrabold uppercase tracking-[0.1em] text-[#1d7f62]"
            variants={badgeVariants}
          >
            {superpenLeadsLabel}
          </motion.span>
        ) : null}
      </div>

      <p
        className={[
          "mt-3 text-[0.98rem] leading-[1.72]",
          isSuperpen ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted)]",
        ].join(" ")}
      >
        {isSuperpen ? row.superpen : row.epicPen}
      </p>
    </motion.div>
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

  const panelVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : { duration: 0.55, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.02 },
    },
  };

  const glowVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: prefersReducedMotion ? 0.2 : 1,
      transition: prefersReducedMotion ? { duration: 0.2 } : { delay: 0.46, duration: 0.7, ease: "easeOut" },
    },
  };

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
        className="relative mt-8"
        ref={tableRef}
        role="table"
        aria-label={content.comparisonSection.tableAriaLabel}
        variants={panelVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.24 }}
      >
        <div
          className="h-1 overflow-hidden rounded-full bg-[rgba(37,65,58,0.08)] dark:bg-[rgba(203,221,214,0.1)]"
          aria-hidden="true"
        >
          <motion.div
            className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#ff7f66,#72d5b7)]"
            style={{ scaleX: prefersReducedMotion ? 1 : progressScaleX }}
          />
        </div>

        <div className="relative mt-4 overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,250,248,0.98))] shadow-[var(--shadow)] dark:bg-[linear-gradient(180deg,rgba(18,26,26,0.98),rgba(14,22,20,0.98))] max-[700px]:rounded-[1.5rem] max-[520px]:rounded-[1.2rem]">
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[56%] bg-[radial-gradient(ellipse_at_top_left,rgba(114,213,183,0.10),transparent_60%)] md:block"
            aria-hidden="true"
            variants={glowVariants}
          />

          <div className="relative grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="hidden border-b border-[var(--line)] md:contents" role="row">
              <div
                className="border-r border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-6 py-5 text-left dark:bg-[rgba(18,26,26,0.74)]"
                role="columnheader"
              >
                <div className="flex items-center gap-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[#1d7f62]">
                  <span aria-hidden="true">♛</span>
                  <span>{content.comparisonSection.headers.superpen}</span>
                </div>
              </div>
              <div className="bg-[var(--surface)] px-6 py-5 text-left" role="columnheader">
                <div className="flex items-center gap-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <span aria-hidden="true">○</span>
                  <span>{content.comparisonSection.headers.epicPen}</span>
                </div>
              </div>
            </div>

            <div className="border-r border-[rgba(114,213,183,0.5)] bg-[rgba(255,255,255,0.82)] dark:bg-[rgba(18,26,26,0.82)] md:border-l-[3px] md:border-r md:border-r-[var(--line)]" role="row">
              <div className="border-b border-[var(--line)] px-6 pb-6 pt-6 max-[520px]:px-4" role="cell">
                <div className="flex items-center gap-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[#1d7f62] md:hidden">
                  <span aria-hidden="true">♛</span>
                  <span>{content.comparisonSection.headers.superpen}</span>
                </div>
                <div className="mt-0 md:mt-0">
                  <span className="inline-flex items-center rounded-full bg-[rgba(114,213,183,0.18)] px-3 py-[0.45rem] text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[#1d7f62]">
                    {content.comparisonSection.highlightBadge}
                  </span>
                  <h3 className="mt-4 text-balance text-[clamp(1.45rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {content.comparisonSection.highlightTitle}
                  </h3>
                  <p className="mt-3 max-w-[34rem] text-[0.97rem] leading-[1.72] text-[var(--muted)]">
                    {content.comparisonSection.highlightDescription}
                  </p>
                </div>
              </div>

              {comparisonRows.map((row, index) => (
                <ColumnEntry
                  key={`superpen-${row.label}`}
                  row={row}
                  index={index}
                  superpenLeadsLabel={content.comparisonSection.superpenLeads}
                  side="superpen"
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            <div className="bg-[var(--surface)]" role="cell">
              <div
                className="mx-6 border-b border-[var(--line)] py-3 text-center text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--muted)] md:hidden max-[520px]:mx-4"
                aria-hidden="true"
              >
                ── vs ──
              </div>

              <div className="border-b border-[var(--line)] px-6 pb-6 pt-6 max-[520px]:px-4">
                <div className="flex items-center gap-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)] md:hidden">
                  <span aria-hidden="true">○</span>
                  <span>{content.comparisonSection.headers.epicPen}</span>
                </div>
                <h3 className="text-balance text-[clamp(1.15rem,2vw,1.45rem)] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {content.comparisonSection.headers.epicPen}
                </h3>
                <p className="mt-3 max-w-[28rem] text-[0.95rem] leading-[1.72] text-[var(--muted)]">
                  {content.comparisonSection.description}
                </p>
              </div>

              {comparisonRows.map((row, index) => (
                <ColumnEntry
                  key={`epic-${row.label}`}
                  row={row}
                  index={index}
                  superpenLeadsLabel={content.comparisonSection.superpenLeads}
                  side="epic"
                  prefersReducedMotion={prefersReducedMotion}
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
