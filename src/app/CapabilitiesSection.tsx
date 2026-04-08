"use client";

import Reveal from "./Reveal";
import { useLandingContent } from "./LocaleProvider";

export default function CapabilitiesSection() {
  const content = useLandingContent();
  const capabilities = content.capabilitiesSection.capabilities;
  return (
    <section
      className="mx-auto my-0 w-[min(1180px,calc(100%-2rem))] px-[clamp(0rem,1vw,0.25rem)] py-[clamp(3.75rem,7vw,5.75rem)] max-[820px]:w-[min(100%-1.25rem,1180px)] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:py-[2.8rem]"
      aria-labelledby="capabilities-title"
    >
      <Reveal className="mx-auto max-w-[42rem] text-center max-[700px]:text-left">
        <span className="inline-flex items-center rounded-full border border-[rgba(255,127,102,0.18)] bg-[var(--surface-strong)] px-3 py-[0.55rem] text-[0.76rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d] shadow-[0_10px_24px_rgba(210,124,102,0.08)]">
          {content.capabilitiesSection.badge}
        </span>
        <h2
          id="capabilities-title"
          className="mt-4 text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.35rem)] leading-[1.04] tracking-[-0.035em] text-[var(--foreground)]"
        >
          {content.capabilitiesSection.title}
        </h2>
        <p className="mt-4 text-[1.02rem] leading-[1.8] text-[var(--muted)] max-[520px]:text-[0.96rem]">
          {content.capabilitiesSection.description}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.title} delay={index * 0.08}>
            <article className="flex h-full flex-col justify-between rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_36px_rgba(79,63,37,0.08)] transition duration-200 hover:-translate-y-1 max-[520px]:rounded-[1.25rem] max-[520px]:p-5">
              <blockquote className="text-[1rem] leading-[1.8] text-[var(--foreground)]">
                “{capability.description}”
              </blockquote>
              <figcaption className="mt-5 border-t border-[rgba(37,65,58,0.08)] pt-4 text-[0.94rem] font-extrabold uppercase tracking-[0.08em] text-[#c7664d] dark:border-[rgba(203,221,214,0.1)]">
                <strong>{capability.title}</strong>
              </figcaption>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
