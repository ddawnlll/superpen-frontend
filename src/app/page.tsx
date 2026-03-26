import type { Metadata } from "next";
import Script from "next/script";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Reveal from "./Reveal";

const features = [
  {
    title: "Annotate on top of your screen",
    description:
      "Superpen runs as a transparent overlay so you can draw over slides, PDFs, websites, videos, and apps without breaking your flow.",
  },
  {
    title: "Switch tools fast",
    description:
      "Jump between cursor, pen, phosphor highlighter, shapes, text, selection, screenshot, and eraser from one floating toolbar.",
  },
  {
    title: "Built-in teaching utilities",
    description:
      "Use board mode, fading ink, math shapes, saved custom shapes, editable shortcuts, and persistent settings without opening a heavy design app.",
  },
];

const steps = [
  {
    title: "Launch the overlay",
    description:
      "Open Superpen and keep the toolbar available while the rest of your desktop stays visible underneath.",
  },
  {
    title: "Draw, type, or capture",
    description:
      "Write freehand, drop in text, place geometry and math shapes, select regions, or capture screenshots to the clipboard or to a file.",
  },
  {
    title: "Keep your setup the way you like it",
    description:
      "Your color, pen size, theme, language, shortcuts, custom shapes, and other preferences are saved between sessions.",
  },
];

const audiences = [
  {
    title: "For teaching and tutoring",
    description:
      "Explain directly on top of slides, browser tabs, worksheets, and shared screens without switching into a separate whiteboard app.",
    points: ["Live classes", "Online tutoring", "Recorded walkthroughs"],
  },
  {
    title: "For demos and presentations",
    description:
      "Use Superpen as a fast desktop annotation layer when you need to highlight, label, or sketch over any application in real time.",
    points: ["Product demos", "Screen annotation", "Explainers"],
  },
];

const capabilities = [
  {
    title: "Math and shape tools",
    description:
      "Rectangle, ellipse, line, arrow, triangle, math presets, and reusable custom shapes are all part of the app.",
  },
  {
    title: "Screenshot workflow",
    description:
      "Select a region and send it to the clipboard or save it to your computer from inside the overlay.",
  },
  {
    title: "Personalized workspace",
    description:
      "Dark and light themes, icon toggle, smoothing control, board colors, and editable shortcuts make the toolbar fit your setup.",
  },
];

const comparisonRows = [
  {
    label: "Pricing model",
    superpen: "No subscription in the current alpha early-access build",
    epicPen: "Epic Pen Pro starts with a 14-day trial, then paid billing",
    winner: "superpen",
  },
  {
    label: "Math-ready shape library",
    superpen: "48 built-in math shapes from the current app library",
    epicPen: "No built-in math shape library listed publicly",
    winner: "superpen",
  },
  {
    label: "Custom shape creation",
    superpen: "Create and save your own reusable custom shapes",
    epicPen: "No comparable custom shape creation flow listed publicly",
    winner: "superpen",
  },
  {
    label: "Color workflow",
    superpen: "Custom color picker in the app, plus persistent settings",
    epicPen: "Expanded colors and custom quick colors are described as Pro features",
    winner: "superpen",
  },
  {
    label: "Core annotation tools",
    superpen: "Pen, highlight, text, screenshots, board mode, shapes, math shapes, fading ink",
    epicPen: "Pen, highlighter, screenshots, text, shapes, whiteboard and blackboard, fading ink",
    winner: "both",
  },
  {
    label: "Power-user customization",
    superpen: "Editable shortcuts, theme options, smoothing, saved preferences, custom shapes",
    epicPen: "Hotkey support and Pro customization options are documented publicly",
    winner: "superpen",
  },
];

const faq = [
  {
    question: "Who is Superpen for?",
    answer:
      "Superpen is for anyone who needs a fast desktop annotation overlay, especially teachers, tutors, presenters, and people explaining ideas live on screen.",
  },
  {
    question: "What can it do today?",
    answer:
      "The current alpha build includes pen and highlighter tools, text, shapes, math shapes, custom shapes, selection, screenshots, board mode, fading ink, themes, shortcuts, saved settings, and English or Turkish language support.",
  },
  {
    question: "Which platform does this frontend describe?",
    answer:
      "This page reflects the current Windows desktop build in the repository. Superpen is built with Qt, and the product direction is cross-platform even though the active build shown here is still focused on Windows today.",
  },
];

export const metadata: Metadata = {
  title: "Superpen | Qt screen annotation overlay in alpha early access",
  description:
    "Superpen is a Qt-based screen annotation overlay in alpha early access with pen, highlighter, text, shapes, screenshots, board mode, shortcuts, and saved settings.",
  keywords: [
    "Superpen",
    "screen annotation overlay",
    "desktop annotation app",
    "Windows annotation tool",
    "screen annotation tool",
    "drawing overlay app",
    "presentation annotation app",
    "annotation software",
  ],
  alternates: {
    canonical: "/",
  },
};

const softwareStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Superpen",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Windows",
  description:
    "A Qt-based desktop overlay in alpha early access for drawing, highlighting, adding text, placing shapes, and capturing screenshots on top of any screen.",
  softwareVersion: "1.0.0-alpha",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Teachers, tutors, presenters, and desktop users who annotate on screen",
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="superpen-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareStructuredData) }}
      />

      <main id="top" className="superpen-shell">
        <Navbar />
        <Hero />

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

        <section className="section" aria-labelledby="comparison-title">
          <Reveal className="section-heading">
            <span className="kicker">Superpen vs Epic Pen</span>
            <h2 id="comparison-title">The comparison gets interesting when you look past basic screen ink.</h2>
            <p>
              Epic Pen is established and polished, but Superpen already pulls ahead in
              the areas that matter most for math-heavy explanation and deeper
              customization.
            </p>
          </Reveal>

          <Reveal className="comparison-spotlight">
            <div className="comparison-copy">
              <span className="comparison-kicker">Why Superpen stands out</span>
              <h3>More built in, less paywall, and far more math-first tooling.</h3>
              <p>
                The strongest current advantages are straightforward: no subscription,
                48 built-in math shapes, reusable custom-shape creation, and a more
                ambitious annotation workflow than the usual pen-plus-highlighter setup.
              </p>
            </div>

            <div className="comparison-badges" aria-label="Superpen advantages">
              <span>No subscription</span>
              <span>48 math shapes</span>
              <span>Saved custom shapes</span>
              <span>Custom colors</span>
              <span>Board mode</span>
              <span>Editable shortcuts</span>
            </div>
          </Reveal>

          <div className="comparison-table" role="table" aria-label="Superpen compared with Epic Pen">
            <div className="comparison-head comparison-row" role="row">
              <span role="columnheader">Category</span>
              <span role="columnheader" className="is-superpen">
                Superpen
              </span>
              <span role="columnheader">Epic Pen</span>
            </div>

            {comparisonRows.map((row, index) => (
              <Reveal key={row.label} delay={index * 0.06}>
                <div
                  className={
                    row.winner === "superpen"
                      ? "comparison-row is-winning"
                      : row.winner === "both"
                        ? "comparison-row is-balanced"
                        : "comparison-row"
                  }
                  role="row"
                >
                  <div className="comparison-cell comparison-category" role="cell">
                    <strong>{row.label}</strong>
                  </div>
                  <div className="comparison-cell comparison-superpen" role="cell">
                    <span className="comparison-pill">Superpen leads</span>
                    <p>{row.superpen}</p>
                  </div>
                  <div className="comparison-cell" role="cell">
                    <p>{row.epicPen}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="comparison-note">
            Comparison reflects the current Superpen repository and Epic Pen&apos;s public
            features, user-guide, and pricing pages.
          </Reveal>
        </section>

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
      </main>
    </>
  );
}
