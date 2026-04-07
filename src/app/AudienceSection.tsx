import Reveal from "./Reveal";
import type { Audience } from "./landing-content";

type AudienceSectionProps = {
  audiences: Audience[];
};

export default function AudienceSection({ audiences }: AudienceSectionProps) {
  return (
    <section
      className="mx-auto my-0 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-[var(--line)] bg-[var(--surface-soft)] px-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(3.5rem,7vw,5.5rem)] shadow-[var(--shadow)] max-[820px]:w-[min(100%-1.25rem,1180px)] max-[700px]:rounded-[1.5rem] max-[700px]:py-[3rem] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:rounded-[1.25rem] max-[520px]:px-4 max-[520px]:py-[2.35rem]"
      aria-labelledby="audience-title"
    >
      <Reveal className="mx-auto max-w-[44rem] text-center max-[700px]:text-left">
        <span className="inline-flex items-center rounded-full border border-[rgba(255,127,102,0.2)] bg-[var(--surface-strong)] px-3 py-[0.55rem] text-[0.76rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d] shadow-[0_10px_24px_rgba(210,124,102,0.08)]">
          Where it fits
        </span>
        <h2
          id="audience-title"
          className="mt-4 text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.035em] text-[var(--foreground)]"
        >
          Useful anywhere you need to mark up a live screen.
        </h2>
        <p className="mt-4 text-[1.02rem] leading-[1.8] text-[var(--muted)] max-[520px]:text-[0.96rem]">
          The current app clearly leans toward teaching workflows, but the core
          interaction model works for any on-screen explanation task and is
          being shaped toward a broader cross-platform release over time.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {audiences.map((audience, index) => (
          <Reveal key={audience.title} delay={index * 0.08}>
            <article className="h-full rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_36px_rgba(79,63,37,0.08)] transition duration-200 hover:-translate-y-1 max-[520px]:rounded-[1.25rem] max-[520px]:p-5">
              <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {audience.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                {audience.description}
              </p>
              <ul className="mt-5 grid gap-3">
                {audience.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[0.95rem] font-medium leading-[1.6] text-[var(--foreground)] before:mt-1 before:h-2.5 before:w-2.5 before:flex-none before:rounded-full before:bg-[var(--mint-deep)] before:shadow-[0_0_0_6px_rgba(114,213,183,0.14)] before:content-['']"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
