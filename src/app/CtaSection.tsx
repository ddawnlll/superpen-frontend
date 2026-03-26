import Reveal from "./Reveal";

export default function CtaSection() {
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
        </div>
        <div className="cta-actions">
          <a className="primary-button" href="#">
            Download for Windows
          </a>
          <a className="secondary-button" href="#demo">
            View the preview
          </a>
        </div>
      </Reveal>
    </section>
  );
}
