"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Release } from "@/lib/superpen-api";
import { buildTrackedDownloadUrl } from "@/lib/download-tracking";
import { useLandingContent } from "./LocaleProvider";

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
  const content = useLandingContent();
  const demoModes = content.hero.modes;
  const toolbarButtons = content.hero.toolbarButtons;
  const [activeMode, setActiveMode] = useState<(typeof demoModes)[number]>(demoModes[0]);

  return (
    <section className="relative mx-auto grid min-h-screen w-[min(1180px,calc(100%-2rem))] items-center overflow-x-clip py-8 max-[820px]:w-[min(100%-1.25rem,1180px)] max-[700px]:min-h-0 max-[700px]:w-[min(100%-1rem,1180px)] max-[700px]:pt-4 max-[520px]:pt-3">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[-2%] top-[4%] h-64 w-64 animate-[floatBlob_10s_ease-in-out_infinite] rounded-full bg-[rgba(255,207,191,0.42)] blur-[10px] opacity-70 dark:bg-[rgba(255,127,102,0.16)]" />
        <span className="absolute right-[6%] top-[14%] h-44 w-44 animate-[floatBlob_10s_ease-in-out_infinite] rounded-full bg-[rgba(202,233,255,0.45)] blur-[10px] opacity-70 [animation-delay:-2s] dark:bg-[rgba(140,185,255,0.16)]" />
        <span className="absolute bottom-[8%] right-[32%] h-40 w-40 animate-[floatBlob_10s_ease-in-out_infinite] rounded-full bg-[rgba(114,213,183,0.22)] blur-[10px] opacity-70 [animation-delay:-4s] dark:bg-[rgba(114,213,183,0.12)]" />
      </div>

      <div className="relative z-10 grid min-h-[calc(100vh-2rem)] grid-cols-[1.02fr_0.98fr] items-center gap-[clamp(1.5rem,3vw,2.5rem)] max-[980px]:min-h-0 max-[980px]:grid-cols-1 max-[980px]:pt-12">
        <motion.div className="min-w-0" {...fadeUp}>
          <span className="inline-flex items-center gap-[0.45rem] rounded-full border border-[rgba(255,127,102,0.22)] bg-[var(--surface-strong)] px-4 py-[0.7rem] font-extrabold tracking-[0.02em] text-[#b95845] shadow-[0_10px_30px_rgba(210,124,102,0.12)] max-[520px]:text-[0.76rem]">
            {content.hero.badge}
          </span>
          <h1 className="mt-5 max-w-[10ch] text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(3.6rem,8vw,6.6rem)] leading-[0.98] tracking-[-0.04em] max-[980px]:max-w-[12ch] max-[700px]:text-[clamp(3rem,15vw,4.4rem)] max-[520px]:max-w-[11ch] max-[520px]:text-[clamp(2.45rem,14vw,3.35rem)]">
            {content.hero.titleLead}
            <span className="text-[var(--coral)] italic"> {content.hero.titleAccent}</span>
          </h1>
          <p className="mt-4 text-[0.92rem] font-extrabold uppercase tracking-[0.08em] text-[#c7664d]">
            {content.hero.kicker}
          </p>
          <p className="mt-6 max-w-[34rem] text-pretty text-[1.12rem] leading-[1.7] text-[var(--muted)] max-[700px]:text-base max-[520px]:mt-4">
            {content.hero.description}
          </p>
          {currentRelease && (
            <p className="mt-4 font-extrabold text-[var(--foreground)]">
              {content.hero.currentReleaseLabel} <strong>{currentRelease.version}</strong> {content.hero.currentReleaseConnector} {currentRelease.platform}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-[0.9rem] max-[700px]:flex-col">
            <a
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#ff7f66] px-[1.4rem] py-[0.9rem] font-extrabold text-white shadow-[0_12px_24px_rgba(255,127,102,0.18)] transition duration-200 hover:-translate-y-0.5 dark:shadow-[0_16px_30px_rgba(255,127,102,0.22)] max-[700px]:w-full aria-disabled:pointer-events-none aria-disabled:opacity-60"
              href={buildTrackedDownloadUrl(currentRelease, "Hero download", "hero-download", "/")}
              data-analytics-event="click"
              data-analytics-label="Hero download"
              data-analytics-target="hero-download"
              data-analytics-release={currentRelease?.version || ""}
              aria-disabled={!currentRelease}
            >
              {currentRelease ? content.hero.primaryCtaReady : content.hero.primaryCtaPending}
            </a>
            <a
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-[1.4rem] py-[0.9rem] font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5 max-[700px]:w-full"
              href="#demo"
              data-analytics-event="click"
              data-analytics-label="Hero demo"
              data-analytics-target="hero-demo"
            >
              {content.hero.secondaryCta}
            </a>
          </div>

          <ul className="mt-8 grid gap-[0.9rem] p-0" aria-label={content.hero.benefitsAriaLabel}>
            <li className="flex items-start gap-3 font-bold text-[var(--foreground)] before:mt-1 before:h-[0.85rem] before:w-[0.85rem] before:flex-none before:rounded-full before:bg-[var(--mint-deep)] before:shadow-[0_0_0_6px_rgba(114,213,183,0.18)] before:content-['']">
              {content.hero.benefits[0]}
            </li>
            <li className="flex items-start gap-3 font-bold text-[var(--foreground)] before:mt-1 before:h-[0.85rem] before:w-[0.85rem] before:flex-none before:rounded-full before:bg-[var(--mint-deep)] before:shadow-[0_0_0_6px_rgba(114,213,183,0.18)] before:content-['']">
              {content.hero.benefits[1]}
            </li>
            <li className="flex items-start gap-3 font-bold text-[var(--foreground)] before:mt-1 before:h-[0.85rem] before:w-[0.85rem] before:flex-none before:rounded-full before:bg-[var(--mint-deep)] before:shadow-[0_0_0_6px_rgba(114,213,183,0.18)] before:content-['']">
              {content.hero.benefits[2]}
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="w-full rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] backdrop-blur-[18px] max-[980px]:max-w-full max-[520px]:rounded-[1.35rem] max-[520px]:p-[0.8rem]"
          id="demo"
          {...fadeUp}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-[0.4rem] pb-4 pt-[0.35rem] max-[520px]:grid-cols-[auto_1fr] max-[520px]:px-[0.15rem] max-[520px]:pb-[0.8rem] max-[520px]:pt-[0.15rem]">
            <div className="flex gap-[0.45rem]" aria-hidden="true">
              <span className="h-[0.7rem] w-[0.7rem] rounded-full bg-[rgba(37,65,58,0.18)] dark:bg-[rgba(219,235,229,0.16)]" />
              <span className="h-[0.7rem] w-[0.7rem] rounded-full bg-[rgba(37,65,58,0.18)] dark:bg-[rgba(219,235,229,0.16)]" />
              <span className="h-[0.7rem] w-[0.7rem] rounded-full bg-[rgba(37,65,58,0.18)] dark:bg-[rgba(219,235,229,0.16)]" />
            </div>
            <span className={`justify-self-end rounded-full px-3 py-2 text-[0.9rem] font-extrabold max-[520px]:text-[0.8rem] ${activeMode.badgeClass}`}>
              {activeMode.badge}
            </span>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-[0.6rem] max-[700px]:grid-cols-1" role="tablist" aria-label={content.hero.demoAriaLabel}>
            {demoModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={activeMode.id === mode.id}
                className={
                  activeMode.id === mode.id
                    ? "min-w-0 rounded-full border border-[rgba(37,65,58,0.22)] bg-[var(--surface-strong)] px-[0.95rem] py-3 font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5 max-[520px]:px-[0.7rem] max-[520px]:py-[0.68rem] max-[520px]:text-[0.92rem]"
                    : "min-w-0 rounded-full border border-[rgba(37,65,58,0.12)] bg-[var(--surface-soft)] px-[0.95rem] py-3 font-extrabold text-[var(--muted)] transition duration-200 hover:-translate-y-0.5 max-[520px]:px-[0.7rem] max-[520px]:py-[0.68rem] max-[520px]:text-[0.92rem]"
                }
                onClick={() => setActiveMode(mode)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div
            className={
              activeMode.id === "board"
                ? "relative min-h-[clamp(26rem,50vw,31rem)] overflow-hidden rounded-[1.6rem] border border-[rgba(37,65,58,0.08)] bg-linear-to-b from-[rgba(28,31,31,0.98)] to-[rgba(18,19,19,0.98)] max-[700px]:min-h-[27rem] max-[700px]:rounded-[1.25rem] max-[520px]:min-h-[25rem]"
                : activeMode.id === "screenshot"
                  ? "relative min-h-[clamp(26rem,50vw,31rem)] overflow-hidden rounded-[1.6rem] border border-[rgba(37,65,58,0.08)] bg-linear-to-b from-[rgba(246,255,251,0.98)] to-[rgba(240,251,247,0.94)] max-[700px]:min-h-[27rem] max-[700px]:rounded-[1.25rem] max-[520px]:min-h-[25rem] dark:border-[rgba(203,221,214,0.12)] dark:bg-linear-to-b dark:from-[rgba(16,27,24,0.98)] dark:to-[rgba(14,23,21,0.96)]"
                  : "relative min-h-[clamp(26rem,50vw,31rem)] overflow-hidden rounded-[1.6rem] border border-[rgba(37,65,58,0.08)] bg-linear-to-b from-[rgba(255,255,255,0.96)] to-[rgba(250,246,239,0.92)] max-[700px]:min-h-[27rem] max-[700px]:rounded-[1.25rem] max-[520px]:min-h-[25rem] dark:border-[rgba(203,221,214,0.12)] dark:bg-linear-to-b dark:from-[rgba(20,26,26,0.98)] dark:to-[rgba(15,19,19,0.95)]"
            }
          >
            <div
              className={
                activeMode.id === "board"
                  ? "absolute inset-0 bg-[linear-gradient(rgba(37,65,58,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(37,65,58,0.06)_1px,transparent_1px)] bg-[size:2.4rem_2.4rem] opacity-[0.18] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.95),rgba(0,0,0,0.45))]"
                  : "absolute inset-0 bg-[linear-gradient(rgba(37,65,58,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(37,65,58,0.06)_1px,transparent_1px)] bg-[size:2.4rem_2.4rem] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.95),rgba(0,0,0,0.45))]"
              }
              aria-hidden="true"
            />

            <div className={activeMode.id === "board" ? "absolute inset-[4.9rem_1.1rem_5.7rem] overflow-hidden rounded-[1.35rem] border border-[rgba(37,65,58,0.08)] bg-[rgba(255,255,255,0.7)] opacity-[0.18] max-[700px]:inset-[7rem_0.9rem_9.2rem] max-[520px]:inset-[7.6rem_0.75rem_10.1rem] max-[520px]:rounded-[1rem] dark:border-[rgba(203,221,214,0.1)] dark:bg-[rgba(21,27,27,0.76)]" : "absolute inset-[4.9rem_1.1rem_5.7rem] overflow-hidden rounded-[1.35rem] border border-[rgba(37,65,58,0.08)] bg-[rgba(255,255,255,0.7)] max-[700px]:inset-[7rem_0.9rem_9.2rem] max-[520px]:inset-[7.6rem_0.75rem_10.1rem] max-[520px]:rounded-[1rem] dark:border-[rgba(203,221,214,0.1)] dark:bg-[rgba(21,27,27,0.76)]"}>
              <div className="grid min-h-full grid-rows-[auto_1fr]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(37,65,58,0.08)] bg-[var(--surface-soft)] px-4 py-[0.8rem] max-[520px]:px-[0.8rem] dark:border-[rgba(203,221,214,0.1)]">
                  <span className="text-[0.9rem] font-extrabold">{content.hero.sharedScreen}</span>
                  <span className="text-[0.9rem] font-extrabold text-[var(--muted)]">{content.hero.lessonNotes}</span>
                </div>

                <div className="grid min-h-full grid-cols-[10rem_1fr] max-[700px]:grid-cols-1">
                  <div className="grid content-start gap-3 border-r border-[rgba(37,65,58,0.08)] bg-[var(--surface-subtle)] p-4 max-[700px]:grid-flow-col max-[700px]:auto-cols-[minmax(0,1fr)] max-[700px]:overflow-x-auto max-[700px]:border-b max-[700px]:border-r-0 max-[520px]:px-[0.8rem] dark:border-[rgba(203,221,214,0.1)]">
                    <span className="rounded-[0.95rem] bg-[rgba(255,207,191,0.72)] px-3 py-[0.65rem] text-[0.9rem] font-extrabold text-[#9a513f]">{content.hero.algebra}</span>
                    <span className="rounded-[0.95rem] bg-[var(--surface-strong)] px-3 py-[0.65rem] text-[0.9rem] font-extrabold text-[var(--muted)]">{content.hero.screenshots}</span>
                    <span className="rounded-[0.95rem] bg-[var(--surface-strong)] px-3 py-[0.65rem] text-[0.9rem] font-extrabold text-[var(--muted)]">{content.hero.customShapes}</span>
                  </div>

                  <div className="grid content-start gap-[1.2rem] p-[1.2rem] max-[520px]:px-[0.8rem]">
                    <div className="max-w-[18rem] rounded-2xl border border-[rgba(37,65,58,0.08)] bg-[var(--surface-strong)] px-[1.1rem] py-4">
                      <span className="block text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[#cf7056]">
                        {content.hero.visibleUnderneath}
                      </span>
                      <h3 className="mt-2 text-[1.2rem] font-semibold max-[520px]:text-[1.05rem]">{content.hero.quadraticReview}</h3>
                      <p className="m-0 leading-[1.6] text-[var(--muted)]">{content.hero.quadraticReviewDescription}</p>
                    </div>

                    <div className="grid gap-[0.8rem]" aria-hidden="true">
                      <span className="block h-[0.85rem] w-[85%] rounded-full bg-[rgba(37,65,58,0.1)] dark:bg-[rgba(219,235,229,0.16)]" />
                      <span className="block h-[0.85rem] w-[72%] rounded-full bg-[rgba(37,65,58,0.1)] dark:bg-[rgba(219,235,229,0.16)]" />
                      <span className="block h-[0.85rem] w-[78%] rounded-full bg-[rgba(37,65,58,0.1)] dark:bg-[rgba(219,235,229,0.16)]" />
                      <span className="block h-[0.85rem] w-[60%] rounded-full bg-[rgba(37,65,58,0.1)] dark:bg-[rgba(219,235,229,0.16)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-4 top-4 z-[2] flex w-[min(20rem,calc(100%-2rem))] flex-wrap gap-[0.65rem] max-[700px]:relative max-[700px]:left-auto max-[700px]:top-auto max-[700px]:w-auto max-[700px]:justify-start max-[700px]:px-[0.9rem] max-[700px]:pt-[0.9rem] max-[520px]:gap-2 max-[520px]:px-[0.75rem] max-[520px]:pt-[0.75rem]">
              <div className={activeMode.id === "board" ? "min-w-0 flex-1 basis-32 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(35,38,39,0.9)] px-[0.85rem] py-[0.7rem] text-[#f3f3f3] shadow-[0_10px_28px_rgba(78,63,37,0.1)]" : "min-w-0 flex-1 basis-32 rounded-2xl border border-[rgba(37,65,58,0.1)] bg-[var(--surface-panel)] px-[0.85rem] py-[0.7rem] shadow-[0_10px_28px_rgba(78,63,37,0.1)]"}>
                <span className={activeMode.id === "board" ? "mb-1 block text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[rgba(255,255,255,0.66)] max-[520px]:text-[0.66rem]" : "mb-1 block text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)] max-[520px]:text-[0.66rem]"}>
                  {content.hero.activeToolLabel}
                </span>
                <strong>{activeMode.activeTool}</strong>
              </div>
              <div className={activeMode.id === "board" ? "min-w-0 flex-1 basis-32 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(35,38,39,0.9)] px-[0.85rem] py-[0.7rem] text-[#f3f3f3] shadow-[0_10px_28px_rgba(78,63,37,0.1)]" : "min-w-0 flex-1 basis-32 rounded-2xl border border-[rgba(37,65,58,0.1)] bg-[var(--surface-panel)] px-[0.85rem] py-[0.7rem] shadow-[0_10px_28px_rgba(78,63,37,0.1)]"}>
                <span className={activeMode.id === "board" ? "mb-1 block text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[rgba(255,255,255,0.66)] max-[520px]:text-[0.66rem]" : "mb-1 block text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)] max-[520px]:text-[0.66rem]"}>
                  {content.hero.overlayStateLabel}
                </span>
                <strong>{activeMode.status}</strong>
              </div>
            </div>

            <div className={activeMode.id === "board" ? "absolute inset-x-4 bottom-4 z-[3] grid grid-cols-[repeat(9,minmax(0,auto))] items-center justify-start gap-[0.55rem] overflow-x-auto rounded-[1.2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(35,38,39,0.96)] p-[0.65rem] shadow-[0_12px_34px_rgba(78,63,37,0.12)] [scrollbar-width:none] max-[700px]:inset-x-[0.9rem] max-[700px]:grid-cols-3 max-[700px]:gap-[0.45rem] max-[700px]:p-[0.55rem] max-[520px]:inset-x-[0.75rem] max-[520px]:bottom-[0.75rem] max-[520px]:gap-[0.4rem] [&::-webkit-scrollbar]:hidden" : "absolute inset-x-4 bottom-4 z-[3] grid grid-cols-[repeat(9,minmax(0,auto))] items-center justify-start gap-[0.55rem] overflow-x-auto rounded-[1.2rem] border border-[rgba(37,65,58,0.1)] bg-[var(--surface-strong)] p-[0.65rem] shadow-[0_12px_34px_rgba(78,63,37,0.12)] [scrollbar-width:none] max-[820px]:grid-cols-7 max-[700px]:inset-x-[0.9rem] max-[700px]:grid-cols-3 max-[700px]:gap-[0.45rem] max-[700px]:p-[0.55rem] max-[520px]:inset-x-[0.75rem] max-[520px]:bottom-[0.75rem] max-[520px]:gap-[0.4rem] [&::-webkit-scrollbar]:hidden"} aria-hidden="true">
              {toolbarButtons.map((button) => (
                <span
                  key={button}
                  className={
                    button === activeMode.activeTool
                      ? activeMode.id === "board"
                        ? "inline-flex min-h-[2.2rem] items-center justify-center whitespace-nowrap rounded-[0.9rem] bg-[rgba(255,127,102,0.28)] px-3 text-[0.78rem] font-extrabold tracking-[0.02em] text-[#ffd1c6] max-[520px]:min-h-8 max-[520px]:px-[0.45rem] max-[520px]:text-[0.72rem]"
                        : "inline-flex min-h-[2.2rem] items-center justify-center whitespace-nowrap rounded-[0.9rem] bg-[rgba(255,127,102,0.2)] px-3 text-[0.78rem] font-extrabold tracking-[0.02em] text-[#b95845] max-[520px]:min-h-8 max-[520px]:px-[0.45rem] max-[520px]:text-[0.72rem]"
                      : activeMode.id === "board"
                        ? "inline-flex min-h-[2.2rem] items-center justify-center whitespace-nowrap rounded-[0.9rem] bg-[rgba(255,255,255,0.08)] px-3 text-[0.78rem] font-extrabold tracking-[0.02em] text-[rgba(255,255,255,0.7)] max-[520px]:min-h-8 max-[520px]:px-[0.45rem] max-[520px]:text-[0.72rem]"
                        : "inline-flex min-h-[2.2rem] items-center justify-center whitespace-nowrap rounded-[0.9rem] bg-[rgba(37,65,58,0.06)] px-3 text-[0.78rem] font-extrabold tracking-[0.02em] text-[var(--muted)] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#d4e1dc] max-[520px]:min-h-8 max-[520px]:px-[0.45rem] max-[520px]:text-[0.72rem]"
                  }
                >
                  {button}
                </span>
              ))}

              <div className="ml-auto inline-grid shrink-0 grid-flow-col gap-2 max-[700px]:col-span-full max-[700px]:grid-cols-2 max-[700px]:ml-0">
                <div className={activeMode.id === "board" ? "inline-grid grid-flow-col items-center justify-items-start gap-[0.45rem] whitespace-nowrap rounded-[0.9rem] bg-[rgba(255,255,255,0.06)] px-[0.7rem] py-[0.55rem] text-[0.72rem] font-extrabold text-[rgba(255,255,255,0.85)] max-[520px]:px-[0.55rem] max-[520px]:text-[0.68rem]" : "inline-grid grid-flow-col items-center justify-items-start gap-[0.45rem] whitespace-nowrap rounded-[0.9rem] bg-[rgba(37,65,58,0.06)] px-[0.7rem] py-[0.55rem] text-[0.72rem] font-extrabold text-[var(--foreground)] max-[520px]:px-[0.55rem] max-[520px]:text-[0.68rem]"}>
                  <span className="h-4 w-4 rounded-full border border-[rgba(0,0,0,0.08)] bg-[#ff4444]" />
                  <strong>{content.hero.colorValue}</strong>
                </div>
                <div className={activeMode.id === "board" ? "inline-grid grid-flow-col items-center justify-items-start gap-[0.45rem] whitespace-nowrap rounded-[0.9rem] bg-[rgba(255,255,255,0.06)] px-[0.7rem] py-[0.55rem] text-[0.72rem] font-extrabold text-[rgba(255,255,255,0.85)] max-[520px]:px-[0.55rem] max-[520px]:text-[0.68rem]" : "inline-grid grid-flow-col items-center justify-items-start gap-[0.45rem] whitespace-nowrap rounded-[0.9rem] bg-[rgba(37,65,58,0.06)] px-[0.7rem] py-[0.55rem] text-[0.72rem] font-extrabold text-[var(--foreground)] max-[520px]:px-[0.55rem] max-[520px]:text-[0.68rem]"}>
                  <span className="h-2 w-2 rounded-full bg-[#ff4444] shadow-[0_0_0_4px_rgba(255,68,68,0.18)]" />
                  <strong>{content.hero.penSize}</strong>
                </div>
              </div>
            </div>

            {activeMode.id === "annotate" && (
              <motion.svg
                key="annotate-canvas"
                viewBox="0 0 620 360"
                className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
                role="img"
                aria-label={content.hero.demoAriaLabel}
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
                <text x="355" y="112" fill="#b95845" fontSize="1.05rem" fontWeight="800" letterSpacing="0.01em">
                  {content.hero.explainThisStep}
                </text>
              </motion.svg>
            )}

            {activeMode.id === "screenshot" && (
              <>
                <div className="absolute inset-[8.3rem_2.8rem_6.4rem_11.3rem] z-[2] rounded-2xl border-2 border-[#ffcc66] bg-[rgba(255,204,102,0.08)] shadow-[inset_0_0_0_999px_rgba(16,22,21,0.18)] max-[700px]:inset-[11.2rem_1.15rem_10.2rem] max-[520px]:inset-[11.4rem_0.95rem_10.35rem]" aria-hidden="true">
                  <span className="absolute left-[-0.35rem] top-[-0.35rem] h-3 w-3 rounded-full bg-[#ffcc66]" />
                  <span className="absolute right-[-0.35rem] top-[-0.35rem] h-3 w-3 rounded-full bg-[#ffcc66]" />
                  <span className="absolute bottom-[-0.35rem] left-[-0.35rem] h-3 w-3 rounded-full bg-[#ffcc66]" />
                  <span className="absolute bottom-[-0.35rem] right-[-0.35rem] h-3 w-3 rounded-full bg-[#ffcc66]" />
                </div>

                <motion.div
                  key="screenshot-actions"
                  className="absolute bottom-20 left-60 right-auto z-[4] flex gap-[0.55rem] rounded-full border border-[rgba(37,65,58,0.1)] bg-[var(--surface-strong)] p-[0.55rem] shadow-[0_12px_28px_rgba(78,63,37,0.12)] max-[700px]:bottom-[8.8rem] max-[700px]:left-4 max-[700px]:right-4 max-[700px]:flex-wrap max-[700px]:justify-center max-[520px]:bottom-36 max-[520px]:left-[0.8rem] max-[520px]:right-[0.8rem] max-[520px]:gap-[0.4rem] max-[520px]:p-[0.45rem]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="rounded-full bg-[rgba(37,65,58,0.08)] px-[0.72rem] py-[0.45rem] text-[0.85rem] font-extrabold text-[var(--foreground)] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#d4e1dc] max-[520px]:px-[0.62rem] max-[520px]:py-[0.42rem] max-[520px]:text-[0.78rem]">{content.hero.copy}</span>
                  <span className="rounded-full bg-[rgba(37,65,58,0.08)] px-[0.72rem] py-[0.45rem] text-[0.85rem] font-extrabold text-[var(--foreground)] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#d4e1dc] max-[520px]:px-[0.62rem] max-[520px]:py-[0.42rem] max-[520px]:text-[0.78rem]">{content.hero.save}</span>
                  <span className="rounded-full bg-[rgba(37,65,58,0.08)] px-[0.72rem] py-[0.45rem] text-[0.85rem] font-extrabold text-[var(--foreground)] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#d4e1dc] max-[520px]:px-[0.62rem] max-[520px]:py-[0.42rem] max-[520px]:text-[0.78rem]">{content.hero.cancel}</span>
                </motion.div>
              </>
            )}

            {activeMode.id === "board" && (
              <>
                <motion.svg
                  key="board-canvas"
                  viewBox="0 0 620 360"
                  className="pointer-events-none absolute inset-0 z-[2] h-full w-full opacity-95"
                  role="img"
                  aria-label={content.hero.demoAriaLabel}
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
                  <text x="188" y="96" fill="#f2f2f2" fontSize="1.05rem" fontWeight="800" letterSpacing="0.01em">
                    {content.hero.boardModeOn}
                  </text>
                </motion.svg>

                <div className="absolute left-4 right-auto top-[5.9rem] z-[3] inline-flex items-center gap-[0.65rem] rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(35,38,39,0.92)] px-4 py-[0.85rem] text-[#f3f3f3] shadow-[0_10px_28px_rgba(78,63,37,0.1)] max-[700px]:left-4 max-[700px]:right-4 max-[700px]:top-44 max-[520px]:left-[0.8rem] max-[520px]:right-[0.8rem] max-[520px]:top-[11.2rem] max-[520px]:px-[0.8rem] max-[520px]:py-[0.7rem]">
                  <span className="h-[0.8rem] w-[0.8rem] rounded-full border border-[rgba(255,255,255,0.22)] bg-[#111]" />
                  <strong>{content.hero.boardBackground}</strong>
                </div>
              </>
            )}
          </div>

          <motion.div
            key={activeMode.id}
            className="relative mt-4 rounded-[1.2rem] border border-[rgba(37,65,58,0.11)] bg-[var(--surface-panel)] p-4 shadow-[0_12px_28px_rgba(78,63,37,0.12)] max-[520px]:mt-[0.8rem]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <strong className={`mb-[0.35rem] block ${activeMode.noteAccentClass}`}>{activeMode.label}</strong>
            <p className="text-[0.95rem] leading-[1.6] text-[var(--muted)]">{activeMode.note}</p>
          </motion.div>

          <div className="grid grid-flow-col items-center justify-start gap-[0.55rem] px-[0.35rem] pb-[0.2rem] pt-4 max-[820px]:grid-cols-3 max-[820px]:grid-flow-row max-[700px]:grid-cols-3 max-[700px]:grid-flow-row max-[700px]:justify-stretch max-[520px]:gap-[0.45rem] max-[520px]:pt-[0.8rem]" aria-hidden="true">
            <span className="h-4 w-4 rounded-full bg-[var(--coral)]" />
            <span className="h-4 w-4 rounded-full bg-[rgba(37,65,58,0.12)]" />
            <span className="h-4 w-4 rounded-full bg-[rgba(37,65,58,0.12)]" />
            <span className="rounded-full bg-[var(--surface-panel)] px-[0.8rem] py-[0.5rem] text-[0.92rem] font-extrabold text-[var(--muted)] max-[520px]:px-[0.55rem] max-[520px]:py-[0.45rem] max-[520px]:text-[0.8rem]">{content.hero.clickThrough}</span>
            <span className="rounded-full bg-[var(--surface-panel)] px-[0.8rem] py-[0.5rem] text-[0.92rem] font-extrabold text-[var(--muted)] max-[520px]:px-[0.55rem] max-[520px]:py-[0.45rem] max-[520px]:text-[0.8rem]">{content.hero.savedSettings}</span>
            <span className="rounded-full bg-[var(--surface-panel)] px-[0.8rem] py-[0.5rem] text-[0.92rem] font-extrabold text-[var(--muted)] max-[520px]:px-[0.55rem] max-[520px]:py-[0.45rem] max-[520px]:text-[0.8rem]">{content.hero.floatingToolbar}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
