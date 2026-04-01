import type { Release } from "@/lib/superpen-api";
import Reveal from "./Reveal";

type CtaSectionProps = {
  currentRelease: Release | null;
  releases: Release[];
};

function formatReleaseDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CtaSection({ currentRelease, releases }: CtaSectionProps) {
  return (
    <section id="download" className="section cta-section" aria-labelledby="cta-title">
      <Reveal className="cta-panel">
        <div>
          <span className="kicker">Current build</span>
          <h2 id="cta-title">Superpen is a Qt-based alpha early-access overlay for drawing and explaining on screen.</h2>
          <p>
            The page now reflects the current Windows build while leaving room
            for the broader cross-platform direction of the product.
          </p>
          {currentRelease && (
            <div className="download-summary-card">
              <strong>{currentRelease.version}</strong>
              <span>{currentRelease.channel} channel - {currentRelease.platform}</span>
              <p>{currentRelease.summary}</p>
            </div>
          )}
        </div>
        <div className="cta-column">
          <div className="cta-actions">
            <a
              className="primary-button"
              href={currentRelease?.downloadUrl || "#"}
              data-analytics-event="download_started"
              data-analytics-label="CTA download"
              data-analytics-target="cta-download"
              data-analytics-release={currentRelease?.version || ""}
            >
              Download for Windows
            </a>
            <a
              className="secondary-button"
              href="#demo"
              data-analytics-event="click"
              data-analytics-label="CTA preview"
              data-analytics-target="cta-preview"
            >
              View the preview
            </a>
          </div>
          <div className="release-list">
            {releases.slice(0, 4).map((release) => (
              <article key={release.version} className="release-list-item">
                <div>
                  <strong>{release.version}</strong>
                  <span>{formatReleaseDate(release.publishedAt)}</span>
                </div>
                <a
                  href={release.downloadUrl}
                  data-analytics-event="download_started"
                  data-analytics-label={`Release download ${release.version}`}
                  data-analytics-target={`release-download-${release.version}`}
                  data-analytics-release={release.version}
                >
                  Download
                </a>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
