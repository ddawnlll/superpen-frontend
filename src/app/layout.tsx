import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://superpen.app"),
  title: {
    default: "Superpen",
    template: "%s | Superpen",
  },
  description:
    "Superpen is a friendly digital whiteboard app for math teachers and students with live drawing, easy annotation, and a calm minimal UI.",
  openGraph: {
    title: "Superpen",
    description:
      "A warm and intuitive digital whiteboard for math teachers and students.",
    url: "https://superpen.app",
    siteName: "Superpen",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Superpen digital whiteboard app preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superpen",
    description:
      "A warm and intuitive digital whiteboard for math teachers and students.",
    images: ["/twitter-image"],
  },
  category: "education",
};

const themeScript = `
  try {
    var saved = localStorage.getItem("superpen-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
