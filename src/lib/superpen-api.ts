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

export type AnalyticsFunnelStep = {
  step: string;
  count: number;
};

export type AnalyticsTimelineEvent = {
  eventType: string;
  occurredAt: string;
  visitorId?: string;
  sessionId?: string;
  path?: string;
  label?: string;
  targetId?: string;
  releaseVersion?: string;
  elapsedSeconds?: number;
  country?: string;
  browser?: string;
  os?: string;
};

export type AnalyticsOverview = {
  generatedAt: string;
  summary: {
    pageViews30d: number;
    uniqueVisitors7d: number;
    uniqueVisitors30d: number;
    sessions30d: number;
    averageSessionSeconds30d: number;
    totalDownloads30d: number;
    completedDownloads30d: number;
    engagedSessions30d: number;
  };
  funnel: AnalyticsFunnelStep[];
  trafficByDay: Array<{
    date: string;
    pageViews: number;
    uniqueVisitors: number;
    downloads: number;
  }>;
  geoByCountry: Array<{
    country: string;
    visitors: number;
    pageViews: number;
    downloads: number;
    averageSessionSeconds: number;
  }>;
  clicksByTarget: Array<{
    target: string;
    count: number;
  }>;
  downloadsByRelease: Array<{
    version: string;
    startedDownloads: number;
    completedDownloads: number;
    uniqueVisitors: number;
  }>;
  devices: {
    browsers: Array<{ name: string; count: number }>;
    operatingSystems: Array<{ name: string; count: number }>;
    deviceTypes: Array<{ name: string; count: number }>;
  };
  referrers: Array<{ source: string; count: number }>;
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  apiPerformance: Array<{
    path: string;
    method: string;
    requests: number;
    averageMs: number;
    p95Ms: number;
    p99Ms: number;
    errorRate: number;
  }>;
  recentEvents: Array<{
    eventType: string;
    occurredAt: string;
    visitorId?: string;
    sessionId?: string;
    path?: string;
    label?: string;
    releaseVersion?: string;
  }>;
  alerts: Array<{
    level: "warning" | "critical";
    type: "error_rate" | "latency";
    message: string;
    path: string;
    method: string;
    value: number;
    threshold: number;
  }>;
};

export type AnalyticsExport = {
  generatedAt: string;
  topPages: Array<{
    path: string;
    pageViews: number;
    uniqueVisitors: number;
  }>;
  topCountries: Array<{
    country: string;
    visitors: number;
    downloads: number;
  }>;
  topReleases: Array<{
    version: string;
    startedDownloads: number;
    completedDownloads: number;
    uniqueVisitors: number;
  }>;
};

function normalizeApiBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const configuredUrl =
    process.env.SUPERPEN_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SUPERPEN_API_BASE_URL ||
    "http://127.0.0.1:8787";

  return normalizeApiBaseUrl(configuredUrl);
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
