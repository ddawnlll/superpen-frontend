"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import { useLandingContent } from "./LocaleProvider";

const audienceAccents = [
  {
    iconBg: "rgba(255,127,102,0.14)",
    iconColor: "#c7664d",
    dividerStart: "rgba(255,127,102,0.72)",
    bulletFill: "#ff7f66",
    bulletHalo: "rgba(255,127,102,0.18)",
  },
  {
    iconBg: "rgba(114,213,183,0.16)",
    iconColor: "#1d7f62",
    dividerStart: "rgba(114,213,183,0.82)",
    bulletFill: "#72d5b7",
    bulletHalo: "rgba(114,213,183,0.18)",
  },
  {
    iconBg: "rgba(246,196,83,0.18)",
    iconColor: "#9f6c09",
    dividerStart: "rgba(246,196,83,0.8)",
    bulletFill: "#f6c453",
    bulletHalo: "rgba(246,196,83,0.18)",
  },
  {
    iconBg: "rgba(125,141,255,0.16)",
    iconColor: "#5162d6",
    dividerStart: "rgba(125,141,255,0.8)",
    bulletFill: "#7d8dff",
    bulletHalo: "rgba(125,141,255,0.18)",
  },
];

const audienceIcons = ["✍️", "🎯", "📣", "🧠"];

export default function AudienceSection() {
  const content = useLandingContent();
  const audiences = content.audienceSection.audiences;
  const prefersReducedMotion = useReducedMotion();
  const hasFeaturedMiddleCard = audiences.length === 3;

  return (
    <section
      className="mx-auto my-0 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-[var(--line)] bg-[var(--surface-soft)] px-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(3.5rem,7vw,5.5rem)] shadow-[var(--shadow)] max-[820px]:w-[min(100%-1.25rem,1180px)] max-[700px]:rounded-[1.5rem] max-[700px]:px-4 max-[700px]:py-[3rem] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:rounded-[1.25rem] max-[520px]:px-4 max-[520px]:py-[2.35rem]"
      aria-labelledby="audience-title"
    >
      <Reveal className="mx-auto max-w-[44rem] text-center max-[700px]:text-left">
        <span className="inline-flex items-center rounded-full border border-[rgba(255,127,102,0.2)] bg-[var(--surface-strong)] px-3 py-[0.55rem] text-[0.76rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d] shadow-[0_10px_24px_rgba(210,124,102,0.08)]">
          {content.audienceSection.badge}
        </span>
        <h2
          id="audience-title"
          className="mt-4 text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.035em] text-[var(--foreground)]"
        >
          {content.audienceSection.title}
        </h2>
        <p className="mt-4 text-[1.02rem] leading-[1.8] text-[var(--muted)] max-[520px]:text-[0.96rem]">
          {content.audienceSection.description}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {audiences.map((audience, index) => {
          const accent = audienceAccents[index % audienceAccents.length];
          const icon = audienceIcons[index % audienceIcons.length];
          const isFeatured = hasFeaturedMiddleCard && index === 1;
          const cardDelay = index * 0.1;

          return (
            <motion.article
              key={audience.title}
              role="article"
              className={[
                "h-full rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_36px_rgba(79,63,37,0.08)] transition-transform duration-200 max-[520px]:rounded-[1.25rem] max-[520px]:p-5",
                prefersReducedMotion
                  ? ""
                  : isFeatured
                    ? "hover:-translate-y-3"
                    : "hover:-translate-y-1",
                isFeatured
                  ? "md:-translate-y-[10px] md:border-[rgba(114,213,183,0.38)] md:bg-[linear-gradient(160deg,rgba(114,213,183,0.07),var(--surface)_55%)] md:shadow-[0_28px_56px_rgba(79,63,37,0.13)]"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.2, delay: cardDelay * 0.5 }
                  : { delay: cardDelay, type: "spring", stiffness: 260, damping: 22 }
              }
            >
              {isFeatured ? (
                <div className="mb-4 hidden md:block">
                  <span className="inline-flex rounded-full bg-[rgba(114,213,183,0.16)] px-3 py-[0.45rem] text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#1d7f62]">
                    Most Popular
                  </span>
                </div>
              ) : null}

              <motion.div
                className="inline-flex h-14 w-14 items-center justify-center rounded-[1.15rem] text-[2rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] max-[767px]:h-12 max-[767px]:w-12 max-[767px]:rounded-[1rem] max-[767px]:text-[2.8rem]"
                style={{
                  backgroundColor: accent.iconBg,
                  color: accent.iconColor,
                }}
                aria-hidden="true"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.2, delay: cardDelay * 0.5 + 0.05 }
                    : { delay: cardDelay + 0.1, type: "spring", stiffness: 280, damping: 20 }
                }
              >
                <span className="leading-none">{icon}</span>
              </motion.div>

              <h3 className="mt-5 text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {audience.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                {audience.description}
              </p>

              <motion.div
                className="mt-5 h-px origin-left bg-[linear-gradient(90deg,var(--divider-start),rgba(37,65,58,0.08))]"
                style={{ ["--divider-start" as string]: accent.dividerStart }}
                aria-hidden="true"
                initial={prefersReducedMotion ? false : { scaleX: 0 }}
                whileInView={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.2, delay: cardDelay * 0.5 + 0.08 }
                    : { delay: cardDelay + 0.18, duration: 0.4, ease: "easeOut" }
                }
              />

              <ul className="mt-5 grid gap-3">
                {audience.points.map((point, bulletIndex) => {
                  const bulletDelay = prefersReducedMotion
                    ? cardDelay * 0.5 + 0.08 + bulletIndex * 0.03
                    : cardDelay + 0.2 + bulletIndex * 0.06;

                  return (
                    <motion.li
                      key={point}
                      className="flex items-start gap-3 text-[0.95rem] font-medium leading-[1.6] text-[var(--foreground)]"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0.18, delay: bulletDelay }
                          : { duration: 0.3, delay: bulletDelay, ease: "easeOut" }
                      }
                    >
                      <span
                        className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full shadow-[0_0_0_6px_var(--bullet-halo)]"
                        style={{
                          backgroundColor: accent.bulletFill,
                          ["--bullet-halo" as string]: accent.bulletHalo,
                        }}
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
