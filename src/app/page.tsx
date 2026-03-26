import type { Metadata } from "next";
import Script from "next/script";
import Hero from "./Hero";

const features = [
  {
    title: "Draw over anything",
    description:
      "Annotate slides, PDFs, browser lessons, and whiteboard apps without interrupting the flow of class.",
  },
  {
    title: "Math-first tools",
    description:
      "Clean strokes, quick highlights, and simple shapes help teachers explain equations, graphs, and geometry faster.",
  },
  {
    title: "Gentle, minimal UI",
    description:
      "Students stay focused on the lesson while teachers get the tools they need in one calm floating toolbar.",
  },
];

const steps = [
  {
    title: "Open Superpen",
    description:
      "Launch the app in seconds and keep it ready while teaching live, recording, or tutoring online.",
  },
  {
    title: "Pick a tool",
    description:
      "Switch from pen to highlighter to shapes with a small friendly toolbar that stays out of the way.",
  },
  {
    title: "Explain clearly",
    description:
      "Circle mistakes, sketch graphs, underline formulas, and keep every idea visible as you teach.",
  },
];

const audiences = [
  {
    title: "For teachers",
    description:
      "Make algebra, calculus, and geometry feel more human with fast visual explanations during class or tutoring.",
    points: ["Live lessons", "Recorded walkthroughs", "Slide annotation"],
  },
  {
    title: "For students",
    description:
      "Solve problems on-screen, mark up examples, and review lessons with a drawing tool that feels easy from day one.",
    points: ["Homework help", "Exam prep", "Collaborative study"],
  },
];

const testimonials = [
  {
    quote:
      "My students finally stay with the graph instead of getting lost in the menus.",
    name: "Mina",
    role: "High school math teacher",
  },
  {
    quote:
      "It feels playful, but it is still fast enough for real tutoring sessions.",
    name: "Daniel",
    role: "Private SAT math tutor",
  },
  {
    quote:
      "I use it while revising problem sets and it makes online study sessions way less awkward.",
    name: "Sara",
    role: "Engineering student",
  },
];

const faq = [
  {
    question: "Who is Superpen for?",
    answer:
      "Superpen is built for math teachers, tutors, and students who need a quick way to draw, highlight, and explain on top of any screen.",
  },
  {
    question: "What makes it different?",
    answer:
      "The focus is speed and warmth: a friendly interface, low-friction drawing tools, and a classroom-first experience instead of a giant design suite.",
  },
  {
    question: "Can visitors try it quickly?",
    answer:
      "Yes. The site is designed to drive trial with a clear download CTA and an interactive preview that shows how the app feels before install.",
  },
];

export const metadata: Metadata = {
  title: "Superpen | Friendly digital whiteboard for math teaching",
  description:
    "Superpen is a warm, intuitive digital whiteboard app for math teachers and students. Draw in real time, annotate any screen, and teach with a calm minimal UI.",
  keywords: [
    "Superpen",
    "digital whiteboard",
    "math teacher app",
    "screen annotation tool",
    "teaching app for math",
    "drawing overlay app",
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
  applicationCategory: "EducationalApplication",
  operatingSystem: "Windows, macOS",
  description:
    "A friendly digital whiteboard app for math teachers and students with live drawing, easy annotation, and a minimal interface.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  audience: [
    {
      "@type": "EducationalAudience",
      educationalRole: "teacher",
    },
    {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="superpen-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareStructuredData) }}
      />

      <main className="superpen-shell">
        <Hero />

        <section className="section section-soft" aria-labelledby="features-title">
          <div className="section-heading">
            <span className="kicker">Why teachers pick Superpen</span>
            <h2 id="features-title">Simple enough for class. Smart enough for math.</h2>
            <p>
              Every part of the experience is tuned for explaining ideas quickly,
              clearly, and with less friction.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  <span />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="workflow-title">
          <div className="two-column">
            <div className="section-heading section-heading-left">
              <span className="kicker">Teaching flow</span>
              <h2 id="workflow-title">Built for quick explanations, not complicated setup.</h2>
              <p>
                Superpen helps teachers stay present with students. Open it, draw
                naturally, and move on with the lesson.
              </p>
            </div>

            <div className="step-list">
              {steps.map((step, index) => (
                <article key={step.title} className="step-card">
                  <div className="step-number">{index + 1}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-soft" aria-labelledby="audience-title">
          <div className="section-heading">
            <span className="kicker">Made for real classrooms</span>
            <h2 id="audience-title">Warm enough for students. Fast enough for teachers.</h2>
            <p>
              The same product supports lesson delivery, tutoring, homework help,
              and revision without feeling too technical or too childish.
            </p>
          </div>

          <div className="audience-grid">
            {audiences.map((audience) => (
              <article key={audience.title} className="audience-card">
                <h3>{audience.title}</h3>
                <p>{audience.description}</p>
                <ul>
                  {audience.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="testimonials-title">
          <div className="section-heading">
            <span className="kicker">Early feedback</span>
            <h2 id="testimonials-title">A friendlier feel for digital teaching.</h2>
            <p>
              The product direction is all about making online explanation feel
              lighter, clearer, and more inviting.
            </p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="testimonial-card">
                <blockquote>{testimonial.quote}</blockquote>
                <figcaption>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section section-soft" aria-labelledby="faq-title">
          <div className="section-heading">
            <span className="kicker">FAQ</span>
            <h2 id="faq-title">Everything a curious visitor needs in one scroll.</h2>
            <p>
              The page is structured to support SEO, trust, and a clear path into
              trying the app.
            </p>
          </div>

          <div className="faq-list">
            {faq.map((item) => (
              <article key={item.question} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="download" className="section cta-section" aria-labelledby="cta-title">
          <div className="cta-panel">
            <div>
              <span className="kicker">Ready to launch</span>
              <h2 id="cta-title">Help people explain math with more warmth and less friction.</h2>
              <p>
                Superpen gives teachers and students an inviting way to draw,
                annotate, and understand together.
              </p>
            </div>
            <div className="cta-actions">
              <a className="primary-button" href="#">
                Download Superpen
              </a>
              <a className="secondary-button" href="#demo">
                View the interactive demo
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
