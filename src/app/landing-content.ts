export type Feature = {
  title: string;
  description: string;
};

export type Step = {
  title: string;
  description: string;
};

export type Audience = {
  title: string;
  description: string;
  points: string[];
};

export type Capability = {
  title: string;
  description: string;
};

export type ComparisonRow = {
  label: string;
  superpen: string;
  epicPen: string;
  winner: "superpen" | "both";
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const features: Feature[] = [
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

export const steps: Step[] = [
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

export const audiences: Audience[] = [
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

export const capabilities: Capability[] = [
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

export const comparisonRows: ComparisonRow[] = [
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

export const faq: FaqItem[] = [
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

export const softwareStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Superpen",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Windows",
  description:
    "A Qt-based desktop overlay in alpha early access for drawing, highlighting, adding text, placing shapes, and capturing screenshots on top of any screen.",
  softwareVersion: "0.1.0-alpha",
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
