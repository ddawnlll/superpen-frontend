import Reveal from "./Reveal";
import type { Audience } from "./landing-content";

type AudienceSectionProps = {
  audiences: Audience[];
};

export default function AudienceSection({ audiences }: AudienceSectionProps) {
  return (
    <section className="section section-soft" aria-labelledby="audience-title">
      <Reveal className="section-heading">
        <span className="kicker">Where it fits</span>
        <h2 id="audience-title">Useful anywhere you need to mark up a live screen.</h2>
        <p>
          The current app clearly leans toward teaching workflows, but the
          core interaction model works for any on-screen explanation task and is
          being shaped toward a broader cross-platform release over time.
        </p>
      </Reveal>

      <div className="audience-grid">
        {audiences.map((audience, index) => (
          <Reveal key={audience.title} delay={index * 0.08}>
            <article className="audience-card">
              <h3>{audience.title}</h3>
              <p>{audience.description}</p>
              <ul>
                {audience.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
