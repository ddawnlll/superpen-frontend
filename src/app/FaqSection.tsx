import Reveal from "./Reveal";
import type { FaqItem } from "./landing-content";

type FaqSectionProps = {
  faq: FaqItem[];
};

export default function FaqSection({ faq }: FaqSectionProps) {
  return (
    <section
      className="mx-auto my-0 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-[var(--line)] bg-[var(--surface-soft)] px-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(3.5rem,7vw,5.5rem)] shadow-[var(--shadow)] max-[820px]:w-[min(100%-1.25rem,1180px)] max-[700px]:rounded-[1.5rem] max-[700px]:py-[3rem] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:rounded-[1.25rem] max-[520px]:px-4 max-[520px]:py-[2.35rem]"
      aria-labelledby="faq-title"
    >
      <Reveal className="mx-auto max-w-[44rem] text-center max-[700px]:text-left">
        <span className="inline-flex items-center rounded-full border border-[rgba(255,127,102,0.2)] bg-[var(--surface-strong)] px-3 py-[0.55rem] text-[0.76rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d] shadow-[0_10px_24px_rgba(210,124,102,0.08)]">
          FAQ
        </span>
        <h2
          id="faq-title"
          className="mt-4 text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.035em] text-[var(--foreground)]"
        >
          Plain-language answers based on the repository as it exists today.
        </h2>
        <p className="mt-4 text-[1.02rem] leading-[1.8] text-[var(--muted)] max-[520px]:text-[0.96rem]">
          The goal here is clarity, not inflated product positioning.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4">
        {faq.map((item, index) => (
          <Reveal key={item.question} delay={index * 0.08}>
            <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)] max-[520px]:rounded-[1.15rem] max-[520px]:p-4">
              <h3 className="text-[1.06rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {item.question}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                {item.answer}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
