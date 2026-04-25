"use client";

import type { Release } from "@/lib/superpen-api";
import { buildTrackedDownloadUrl } from "@/lib/download-tracking";
import { getIntlLocale } from "@/lib/i18n";
import Reveal from "./Reveal";
import { useLandingContent, useLocale } from "./LocaleProvider";

type CtaSectionProps = {
  currentRelease: Release | null;
  releases: Release[];
};

function formatReleaseDate(value: string, locale: "en" | "tr") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(getIntlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CtaSection({ currentRelease, releases }: CtaSectionProps) {
  const { locale } = useLocale();
  const content = useLandingContent();
  return (
    <section
      id="download"
      className="mx-auto my-0 w-[min(1180px,calc(100%-2rem))] px-[clamp(0rem,1vw,0.25rem)] py-[clamp(3.75rem,7vw,5.75rem)] max-[820px]:w-[min(100%-1.25rem,1180px)] max-[520px]:w-[min(100%-1rem,1180px)] max-[520px]:py-[2.8rem]"
      aria-labelledby="cta-title"
    >
      <Reveal className="grid gap-6 rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(247,241,232,0.98))] p-[clamp(1.35rem,3vw,2.5rem)] shadow-[var(--shadow)] dark:bg-[linear-gradient(135deg,rgba(20,26,26,0.96),rgba(14,20,19,0.98))] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] max-[700px]:rounded-[1.5rem] max-[520px]:rounded-[1.2rem] max-[520px]:p-4">
        <div>
          <span className="inline-flex items-center rounded-full border border-[rgba(255,127,102,0.18)] bg-[var(--surface-strong)] px-3 py-[0.55rem] text-[0.76rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d] shadow-[0_10px_24px_rgba(210,124,102,0.08)]">
            {content.ctaSection.badge}
          </span>
          <h2
            id="cta-title"
            className="mt-4 max-w-[14ch] text-balance font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.04em] text-[var(--foreground)] max-[700px]:max-w-none"
          >
            {content.ctaSection.title}
          </h2>
          <p className="mt-4 max-w-[40rem] text-[1.02rem] leading-[1.8] text-[var(--muted)] max-[520px]:text-[0.96rem]">
            {content.ctaSection.description}
          </p>
          {currentRelease ? (
            <div className="mt-6 rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)] max-[520px]:rounded-[1.15rem] max-[520px]:p-4">
              <strong className="block text-[1.1rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {currentRelease.version}
              </strong>
              <span className="mt-1 block text-[0.84rem] font-extrabold uppercase tracking-[0.08em] text-[#c7664d]">
                {currentRelease.channel} channel - {currentRelease.platform}
              </span>
              <p className="mt-3 text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                {currentRelease.summary}
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.45rem] border border-dashed border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)] max-[520px]:rounded-[1.15rem] max-[520px]:p-4">
              <strong className="block text-[1.1rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {content.ctaSection.noReleaseTitle}
              </strong>
              <p className="mt-3 text-[0.98rem] leading-[1.75] text-[var(--muted)]">
                {content.ctaSection.noReleaseDescription}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <a
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#ff7f66] px-[1.4rem] py-[0.9rem] text-center font-extrabold text-white shadow-[0_12px_24px_rgba(255,127,102,0.18)] transition duration-200 hover:-translate-y-0.5 dark:shadow-[0_16px_30px_rgba(255,127,102,0.22)] aria-disabled:pointer-events-none aria-disabled:opacity-60"
              href={buildTrackedDownloadUrl(currentRelease, "CTA download", "cta-download", "/")}
              target={currentRelease ? "_blank" : undefined}
              rel={currentRelease ? "noreferrer" : undefined}
              data-analytics-event="click"
              data-analytics-label="CTA download"
              data-analytics-target="cta-download"
              data-analytics-release={currentRelease?.version || ""}
              aria-disabled={!currentRelease}
            >
              {currentRelease ? content.ctaSection.primaryCtaReady : content.ctaSection.primaryCtaPending}
            </a>
            <a
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-[1.4rem] py-[0.9rem] text-center font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5"
              href="#demo"
              data-analytics-event="click"
              data-analytics-label="CTA preview"
              data-analytics-target="cta-preview"
            >
              {content.ctaSection.secondaryCta}
            </a>
          </div>
          <div className="grid gap-3">
            {releases.length > 0 ? (
              releases.slice(0, 4).map((release) => (
                <article
                  key={release.version}
                  className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 shadow-[0_12px_28px_rgba(79,63,37,0.07)] max-[520px]:items-start max-[520px]:rounded-[1rem]"
                >
                  <div className="min-w-0">
                    <strong className="block truncate text-[0.98rem] font-semibold text-[var(--foreground)]">
                      {release.version}
                    </strong>
                    <span className="mt-1 block text-[0.84rem] text-[var(--muted)]">
                      {formatReleaseDate(release.publishedAt, locale)}
                    </span>
                  </div>
                  <a
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[rgba(255,127,102,0.18)] bg-[var(--surface-strong)] px-4 text-[0.88rem] font-extrabold text-[#c7664d] transition duration-200 hover:-translate-y-0.5"
                    href={buildTrackedDownloadUrl(
                      release,
                      `Release download ${release.version}`,
                      `release-download-${release.version}`,
                      "/",
                    )}
                    target="_blank"
                    rel="noreferrer"
                    data-analytics-event="click"
                    data-analytics-label={`Release download ${release.version}`}
                    data-analytics-target={`release-download-${release.version}`}
                    data-analytics-release={release.version}
                  >
                    {content.ctaSection.releaseDownload}
                  </a>
                </article>
              ))
            ) : (
              <p className="rounded-[1.2rem] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[0.95rem] text-[var(--muted)] shadow-[0_12px_28px_rgba(79,63,37,0.07)]">
                {content.ctaSection.releasesEmpty}
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
