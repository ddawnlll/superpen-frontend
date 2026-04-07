import "server-only";

import {
  getApiBaseUrl,
  loginWithCredentials,
  type LoginResponse,
  type SiteData,
} from "@/lib/superpen-api";

const DEFAULT_SITE_DATA: SiteData = {
  productName: "SuperPen",
  currentVersion: "",
  currentRelease: null,
  releases: [],
  generatedAt: new Date().toISOString(),
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
    const releases = Array.isArray(data.releases) ? data.releases : DEFAULT_SITE_DATA.releases;
    const currentRelease = data.currentRelease || releases[0] || null;

    return {
      productName: data.productName || DEFAULT_SITE_DATA.productName,
      currentVersion: data.currentVersion || currentRelease?.version || DEFAULT_SITE_DATA.currentVersion,
      currentRelease,
      releases,
      generatedAt: data.generatedAt || new Date().toISOString(),
    };
  } catch {
    return DEFAULT_SITE_DATA;
  }
}
