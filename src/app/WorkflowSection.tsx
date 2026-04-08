"use client";

import Reveal from "./Reveal";
import { useLandingContent } from "./LocaleProvider";

export default function WorkflowSection() {
  const content = useLandingContent();
  const steps = content.workflowSection.steps;
  return (
    <section
      className="mx-auto my-0 w-[min(1180px,calc(100%-2rem))] px-[clamp(0rem,1vw,0.25rem)] py-[clamp(3.75rem,7vw,5.75rem)] max-[820px]:w-[min(100%-1.25rem,1180px)] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:py-[2.8rem]"
      aria-labelledby="workflow-title"
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <Reveal className="max-w-[34rem]">
          <span className="inline-flex items-center rounded-full border border-[rgba(255,127,102,0.18)] bg-[var(--surface-strong)] px-3 py-[0.55rem] text-[0.76rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d] shadow-[0_10px_24px_rgba(210,124,102,0.08)]">
            {content.workflowSection.badge}
          </span>
          <h2
            id="workflow-title"
            className="mt-4 text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.35rem)] leading-[1.04] tracking-[-0.035em] text-[var(--foreground)]"
          >
            {content.workflowSection.title}
          </h2>
          <p className="mt-4 text-[1.02rem] leading-[1.8] text-[var(--muted)] max-[520px]:text-[0.96rem]">
            {content.workflowSection.description}
          </p>
        </Reveal>

        <div className="grid gap-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <article className="grid grid-cols-[auto_1fr] items-start gap-4 rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)] transition duration-200 hover:-translate-y-1 max-[520px]:rounded-[1.2rem] max-[520px]:grid-cols-1 max-[520px]:gap-3 max-[520px]:p-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,127,102,0.18),rgba(114,213,183,0.24))] text-[1rem] font-extrabold text-[#b95845] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-[1.08rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                    {step.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
