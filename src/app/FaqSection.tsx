import Reveal from "./Reveal";
import type { FaqItem } from "./landing-content";

type FaqSectionProps = {
  faq: FaqItem[];
};

export default function FaqSection({ faq }: FaqSectionProps) {
  return (
    <section className="section section-soft" aria-labelledby="faq-title">
      <Reveal className="section-heading">
        <span className="kicker">FAQ</span>
        <h2 id="faq-title">Plain-language answers based on the repository as it exists today.</h2>
        <p>
          The goal here is clarity, not inflated product positioning.
        </p>
      </Reveal>

      <div className="faq-list">
        {faq.map((item, index) => (
          <Reveal key={item.question} delay={index * 0.08}>
            <article className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
