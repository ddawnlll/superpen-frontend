import Reveal from "./Reveal";
import type { Step } from "./landing-content";

type WorkflowSectionProps = {
  steps: Step[];
};

export default function WorkflowSection({ steps }: WorkflowSectionProps) {
  return (
    <section className="section" aria-labelledby="workflow-title">
      <div className="two-column">
        <Reveal className="section-heading section-heading-left">
          <span className="kicker">How it works</span>
          <h2 id="workflow-title">Built around fast desktop markup, not heavyweight canvas setup.</h2>
          <p>
            Superpen stays out of the way until you need it, then gives you
            the right tool quickly for explanation, annotation, or capture.
          </p>
        </Reveal>

        <div className="step-list">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <article className="step-card">
                <div className="step-number">{index + 1}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
