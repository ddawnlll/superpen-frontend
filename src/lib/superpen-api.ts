export type Release = {
  version: string;
  channel: string;
  platform: string;
  downloadUrl: string;
  publishedAt: string;
  summary: string;
  notes: string[];
  fileSize: string;
  checksum: string;
};

export type SiteData = {
  productName: string;
  currentVersion: string;
  currentRelease: Release | null;
  releases: Release[];
  generatedAt: string;
};

export type LoginResponse = {
  token: string;
  user: {
    username: string;
  };
  expiresInMinutes: number;
};

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

export function getApiBaseUrl(): string {
  return (
    process.env.SUPERPEN_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SUPERPEN_API_BASE_URL ||
    "http://127.0.0.1:8787"
  );
}

export async function loginWithCredentials(
  username: string,
  password: string,
  apiBaseUrl = getApiBaseUrl(),
): Promise<LoginResponse> {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(payload?.error || `Login failed (${response.status})`);
  }

  return response.json() as Promise<LoginResponse>;
}

async function getServerSideToken(): Promise<string | null> {
  const username = process.env.SUPERPEN_API_USERNAME;
  const password = process.env.SUPERPEN_API_PASSWORD;
  if (!username || !password) {
    return null;
  }

  try {
    const login = await loginWithCredentials(username, password);
    return login.token;
  } catch {
    return null;
  }
}

export async function getSiteData(): Promise<SiteData> {
  try {
    const token = await getServerSideToken();
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
