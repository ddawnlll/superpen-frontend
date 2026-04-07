import type { Metadata } from "next";
import Script from "next/script";
import AnalyticsTracker from "./AnalyticsTracker";
import AudienceSection from "./AudienceSection";
import CapabilitiesSection from "./CapabilitiesSection";
import ComparisonSection from "./ComparisonSection";
import CtaSection from "./CtaSection";
import FaqSection from "./FaqSection";
import FeaturesSection from "./FeaturesSection";
import Hero from "./Hero";
import Navbar from "./Navbar";
import WorkflowSection from "./WorkflowSection";
import { getSiteData } from "@/lib/superpen-api-server";
import {
  audiences,
  capabilities,
  comparisonRows,
  faq,
  features,
  softwareStructuredData,
  steps,
} from "./landing-content";

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

export default async function Home() {
  const siteData = await getSiteData();
  const structuredData = {
    ...softwareStructuredData,
    softwareVersion: siteData.currentVersion,
    downloadUrl: siteData.currentRelease?.downloadUrl,
  };

  return (
    <>
      <Script
        id="superpen-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main id="top" className="overflow-x-clip">
        <AnalyticsTracker />
        <Navbar />
        <Hero currentRelease={siteData.currentRelease} />
        <FeaturesSection features={features} />
        <ComparisonSection comparisonRows={comparisonRows} />
        <WorkflowSection steps={steps} />
        <AudienceSection audiences={audiences} />
        <CapabilitiesSection capabilities={capabilities} />
        <FaqSection faq={faq} />
        <CtaSection currentRelease={siteData.currentRelease} releases={siteData.releases} />
      </main>
    </>
  );
}
