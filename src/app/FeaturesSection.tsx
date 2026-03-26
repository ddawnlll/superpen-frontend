import Reveal from "./Reveal";
import type { Feature } from "./landing-content";

type FeaturesSectionProps = {
  features: Feature[];
};

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="section section-soft" aria-labelledby="features-title">
      <Reveal className="section-heading">
        <span className="kicker">What Superpen actually is</span>
        <h2 id="features-title">A lightweight overlay for live annotation on top of your desktop.</h2>
        <p>
          Superpen is built with Qt and currently ships as an alpha early-access
          desktop app. The product is closer to a fast on-screen markup layer
          than a full whiteboard suite, which is exactly what makes it useful
          during live work.
        </p>
      </Reveal>

      <div className="feature-grid">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.08}>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <span />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
