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


type ServiceLoginCache = {
  login: LoginResponse;
  expiresAt: number;
};

let cachedServiceLogin: ServiceLoginCache | null = null;

export async function getServiceLogin(
  apiBaseUrl = getApiBaseUrl(),
): Promise<LoginResponse | null> {
  const username = process.env.SUPERPEN_API_USERNAME;
  const password = process.env.SUPERPEN_API_PASSWORD;

  if (!username || !password) {
    return null;
  }

  if (cachedServiceLogin && cachedServiceLogin.expiresAt > Date.now()) {
    return cachedServiceLogin.login;
  }

  try {
    const login = await loginWithCredentials(username, password, apiBaseUrl);
    const ttlMs = Math.max((login.expiresInMinutes - 1) * 60_000, 60_000);

    cachedServiceLogin = {
      login,
      expiresAt: Date.now() + ttlMs,
    };

    return login;
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
    const apiBaseUrl = getApiBaseUrl();
    let response = await fetch(`${apiBaseUrl}/api/public/site-data`, {
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      const token = await getServiceToken(apiBaseUrl);

      response = await fetch(`${apiBaseUrl}/api/public/site-data`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        cache: "no-store",
      });
    }

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
