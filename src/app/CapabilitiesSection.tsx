import Reveal from "./Reveal";
import type { Capability } from "./landing-content";

type CapabilitiesSectionProps = {
  capabilities: Capability[];
};

export default function CapabilitiesSection({ capabilities }: CapabilitiesSectionProps) {
  return (
    <section className="section" aria-labelledby="capabilities-title">
      <Reveal className="section-heading">
        <span className="kicker">Core capabilities</span>
        <h2 id="capabilities-title">The app already includes more than basic pen input.</h2>
        <p>
          These are implemented parts of the product, not placeholder ideas for later.
        </p>
      </Reveal>

      <div className="testimonial-grid">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.title} delay={index * 0.08}>
            <article className="testimonial-card">
              <blockquote>{capability.description}</blockquote>
              <figcaption>
                <strong>{capability.title}</strong>
              </figcaption>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
