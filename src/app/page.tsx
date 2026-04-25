import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Script from "next/script";
import Hero from "./Hero";
import Navbar from "./Navbar";
import { getSiteData } from "@/lib/superpen-api-server";
import { softwareStructuredData } from "./landing-content";

const AnalyticsTracker = nextDynamic(() => import("./AnalyticsTracker"), {
  loading: () => null,
});
const FeaturesSection = nextDynamic(() => import("./FeaturesSection"), { loading: () => null });
const ComparisonSection = nextDynamic(() => import("./ComparisonSection"), { loading: () => null });
const WorkflowSection = nextDynamic(() => import("./WorkflowSection"), { loading: () => null });
const AudienceSection = nextDynamic(() => import("./AudienceSection"), { loading: () => null });
const CapabilitiesSection = nextDynamic(() => import("./CapabilitiesSection"), { loading: () => null });
const FaqSection = nextDynamic(() => import("./FaqSection"), { loading: () => null });
const CtaSection = nextDynamic(() => import("./CtaSection"), { loading: () => null });

export const dynamic = "force-dynamic";

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
        <FeaturesSection />
        <ComparisonSection />
        <WorkflowSection />
        <AudienceSection />
        <CapabilitiesSection />
        <FaqSection />
        <CtaSection currentRelease={siteData.currentRelease} releases={siteData.releases} />
      </main>
    </>
  );
}
