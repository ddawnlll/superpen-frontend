import "server-only";

import {
  getApiBaseUrl,
  loginWithCredentials,
  type LoginResponse,
  type Release,
  type SiteData,
} from "@/lib/superpen-api";

const DEFAULT_RELEASE: Release = {
  version: "0.1.0-alpha",
  channel: "alpha",
  platform: "Windows",
  downloadUrl: "#",
  publishedAt: "2026-04-01T00:00:00Z",
  summary: "Alpha early-access Windows build.",
  notes: [
    "Live screen annotation overlay",
    "Tablet and pressure input support",
    "Alpha release with active development",
  ],
  fileSize: "TBD",
  checksum: "",
};

const DEFAULT_SITE_DATA: SiteData = {
  productName: "SuperPen",
  currentVersion: DEFAULT_RELEASE.version,
  currentRelease: DEFAULT_RELEASE,
  releases: [DEFAULT_RELEASE],
  generatedAt: DEFAULT_RELEASE.publishedAt,
};

export async function getServiceLogin(
  apiBaseUrl = getApiBaseUrl(),
): Promise<LoginResponse | null> {
  const username = process.env.SUPERPEN_API_USERNAME;
  const password = process.env.SUPERPEN_API_PASSWORD;

  if (!username || !password) {
    return null;
  }

  try {
    return await loginWithCredentials(username, password, apiBaseUrl);
  } catch {
    return null;
  }
}

export async function getServiceToken(apiBaseUrl = getApiBaseUrl()): Promise<string | null> {
  const login = await getServiceLogin(apiBaseUrl);
  return login?.token || null;
}

export async function getSiteData(): Promise<SiteData> {
  try {
    const token = await getServiceToken();
    if (!token) {
      return DEFAULT_SITE_DATA;
    }

    const response = await fetch(`${getApiBaseUrl()}/api/public/site-data`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return DEFAULT_SITE_DATA;
    }

    const data = (await response.json()) as Partial<SiteData>;
    return {
      productName: data.productName || DEFAULT_SITE_DATA.productName,
      currentVersion: data.currentVersion || DEFAULT_SITE_DATA.currentVersion,
      currentRelease: data.currentRelease || DEFAULT_SITE_DATA.currentRelease,
      releases:
        data.releases && data.releases.length > 0
          ? data.releases
          : DEFAULT_SITE_DATA.releases,
      generatedAt: data.generatedAt || new Date().toISOString(),
    };
  } catch {
    return DEFAULT_SITE_DATA;
  }
}
