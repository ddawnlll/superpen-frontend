"use client";

import Reveal from "./Reveal";
import { useLandingContent } from "./LocaleProvider";

export default function FeaturesSection() {
  const content = useLandingContent();
  const features = content.featuresSection.items;
  return (
    <section
      className="mx-auto my-0 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-[var(--line)] bg-[var(--surface-soft)] px-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(3.5rem,7vw,5.5rem)] shadow-[var(--shadow)] max-[820px]:w-[min(100%-1.25rem,1180px)] max-[700px]:rounded-[1.5rem] max-[700px]:py-[3rem] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:rounded-[1.25rem] max-[520px]:px-4 max-[520px]:py-[2.35rem]"
      aria-labelledby="features-title"
    >
      <Reveal className="mx-auto max-w-[44rem] text-center max-[700px]:text-left">
        <span className="inline-flex items-center rounded-full border border-[rgba(255,127,102,0.2)] bg-[var(--surface-strong)] px-3 py-[0.55rem] text-[0.76rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d] shadow-[0_10px_24px_rgba(210,124,102,0.08)]">
          {content.featuresSection.badge}
        </span>
        <h2
          id="features-title"
          className="mt-4 text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.035em] text-[var(--foreground)]"
        >
          {content.featuresSection.title}
        </h2>
        <p className="mt-4 text-[1.02rem] leading-[1.8] text-[var(--muted)] max-[520px]:text-[0.96rem]">
          {content.featuresSection.description}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.08}>
            <article className="h-full rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_36px_rgba(79,63,37,0.08)] transition duration-200 hover:-translate-y-1 max-[520px]:rounded-[1.25rem] max-[520px]:p-5">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,127,102,0.16),rgba(114,213,183,0.2))] text-[#c7664d] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" aria-hidden="true">
                <span className="h-3.5 w-3.5 rounded-full bg-current shadow-[0_0_0_8px_rgba(199,102,77,0.12)]" />
              </div>
              <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                {feature.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
