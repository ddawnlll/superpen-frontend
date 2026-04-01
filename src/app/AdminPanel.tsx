"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getApiBaseUrl,
  loginWithCredentials,
  type AnalyticsOverview,
  type AnalyticsTimelineEvent,
  type LoginResponse,
  type Release,
  type SiteData,
} from "@/lib/superpen-api";

type ReleaseFormState = {
  version: string;
  channel: string;
  platform: string;
  downloadUrl: string;
  publishedAt: string;
  summary: string;
  notes: string;
  fileSize: string;
  checksum: string;
  makeCurrent: boolean;
};

type LoginFormState = {
  username: string;
  password: string;
};

type TimelineFormState = {
  visitorId: string;
  sessionId: string;
};

const EMPTY_FORM: ReleaseFormState = {
  version: "",
  channel: "stable",
  platform: "Windows",
  downloadUrl: "",
  publishedAt: "",
  summary: "",
  notes: "",
  fileSize: "",
  checksum: "",
  makeCurrent: false,
};

const EMPTY_LOGIN: LoginFormState = {
  username: "",
  password: "",
};

const EMPTY_TIMELINE: TimelineFormState = {
  visitorId: "",
  sessionId: "",
};

function toFormState(release?: Release | null): ReleaseFormState {
  if (!release) {
    return EMPTY_FORM;
  }
  return {
    version: release.version,
    channel: release.channel,
    platform: release.platform,
    downloadUrl: release.downloadUrl,
    publishedAt: release.publishedAt,
    summary: release.summary,
    notes: release.notes.join("\n"),
    fileSize: release.fileSize,
    checksum: release.checksum,
    makeCurrent: false,
  };
}

function getStoredToken(): string {
  return window.localStorage.getItem("superpen-admin-jwt") || "";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number) {
  return `${value}%`;
}

function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BarList({
  items,
  getLabel,
  getValue,
}: {
  items: unknown[];
  getLabel: (item: unknown) => string;
  getValue: (item: unknown) => number;
}) {
  const maxValue = items.reduce((max, item) => Math.max(max, getValue(item)), 0) || 1;

  return (
    <div className="analytics-bar-list">
      {items.map((item, index) => {
        const label = getLabel(item);
        const value = getValue(item);
        return (
          <div className="analytics-bar-row" key={`${label}-${index}`}>
            <div className="analytics-bar-copy">
              <strong>{label}</strong>
              <span>{formatNumber(value)}</span>
            </div>
            <div className="analytics-bar-track" aria-hidden="true">
              <div className="analytics-bar-fill" style={{ width: `${Math.max(8, (value / maxValue) * 100)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminPanel() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [authToken, setAuthToken] = useState("");
  const [loginForm, setLoginForm] = useState<LoginFormState>(EMPTY_LOGIN);
  const [timelineForm, setTimelineForm] = useState<TimelineFormState>(EMPTY_TIMELINE);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [analyticsOverview, setAnalyticsOverview] = useState<AnalyticsOverview | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<AnalyticsTimelineEvent[]>([]);
  const [form, setForm] = useState<ReleaseFormState>(EMPTY_FORM);
  const [message, setMessage] = useState("Log in to manage releases and analytics.");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      void loadDashboard();
    }
  }, [authToken]);

  async function authenticatedFetch(path: string, init?: RequestInit) {
    const token = authToken || getStoredToken();
    if (!token) {
      throw new Error("You are not logged in.");
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      window.localStorage.removeItem("superpen-admin-jwt");
      setAuthToken("");
      throw new Error("Session expired. Please log in again.");
    }

    return response;
  }

  async function loadDashboard() {
    setIsBusy(true);
    setMessage("Loading releases and analytics...");
    try {
      const [releasesResponse, analyticsResponse] = await Promise.all([
        authenticatedFetch("/api/admin/releases"),
        authenticatedFetch("/api/admin/analytics/overview"),
      ]);

      if (!releasesResponse.ok) {
        throw new Error(`Release request failed: ${releasesResponse.status}`);
      }

      if (!analyticsResponse.ok) {
        throw new Error(`Analytics request failed: ${analyticsResponse.status}`);
      }

      const releasesData = (await releasesResponse.json()) as SiteData;
      const analyticsData = (await analyticsResponse.json()) as AnalyticsOverview;
      setSiteData(releasesData);
      setAnalyticsOverview(analyticsData);
      setMessage("Dashboard updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Signing in...");
    try {
      const result: LoginResponse = await loginWithCredentials(
        loginForm.username,
        loginForm.password,
        apiBaseUrl,
      );
      setAuthToken(result.token);
      window.localStorage.setItem("superpen-admin-jwt", result.token);
      setMessage(`Signed in as ${result.user.username}.`);
      setLoginForm((current) => ({ ...current, password: "" }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function submitRelease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Saving release...");
    try {
      const response = await authenticatedFetch("/api/admin/releases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          publishedAt: form.publishedAt || undefined,
          notes: form.notes,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Request failed: ${response.status}`);
      }

      const data = (await response.json()) as SiteData;
      setSiteData(data);
      setMessage(`Saved release ${form.version}.`);
      setForm(EMPTY_FORM);
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save release.");
    } finally {
      setIsBusy(false);
    }
  }

  async function makeCurrent(version: string) {
    setIsBusy(true);
    setMessage(`Setting ${version} as current...`);
    try {
      const response = await authenticatedFetch("/api/admin/releases/current", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ version }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = (await response.json()) as SiteData;
      setSiteData(data);
      setMessage(`Current version set to ${version}.`);
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not set current version.");
    } finally {
      setIsBusy(false);
    }
  }

  async function removeRelease(version: string) {
    setIsBusy(true);
    setMessage(`Deleting ${version}...`);
    try {
      const response = await authenticatedFetch(`/api/admin/releases/${encodeURIComponent(version)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = (await response.json()) as SiteData;
      setSiteData(data);
      setMessage(`Deleted ${version}.`);
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete release.");
    } finally {
      setIsBusy(false);
    }
  }

  async function loadTimeline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Loading user timeline...");

    try {
      const params = new URLSearchParams();
      if (timelineForm.visitorId.trim()) {
        params.set("visitorId", timelineForm.visitorId.trim());
      }
      if (timelineForm.sessionId.trim()) {
        params.set("sessionId", timelineForm.sessionId.trim());
      }

      const response = await authenticatedFetch(`/api/admin/analytics/timeline?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Timeline request failed: ${response.status}`);
      }

      const payload = (await response.json()) as { timeline?: AnalyticsTimelineEvent[] };
      setTimelineEvents(payload.timeline || []);
      setMessage(`Loaded ${payload.timeline?.length || 0} timeline events.`);
    } catch (error) {
      setTimelineEvents([]);
      setMessage(error instanceof Error ? error.message : "Could not load timeline.");
    } finally {
      setIsBusy(false);
    }
  }

  function logout() {
    window.localStorage.removeItem("superpen-admin-jwt");
    setAuthToken("");
    setSiteData(null);
    setAnalyticsOverview(null);
    setTimelineEvents([]);
    setMessage("Logged out.");
  }

  if (!authToken) {
    return (
      <main className="admin-shell">
        <section className="admin-panel">
          <div className="admin-header">
            <div>
              <p className="admin-eyebrow">Release management</p>
              <h1>SuperPen admin</h1>
              <p className="admin-copy">Log in with your admin account to manage versions, downloads, and analytics.</p>
            </div>
            <a className="secondary-button" href="/">
              Back to site
            </a>
          </div>

          <div className="admin-note">{message}</div>

          <section className="admin-card admin-login-card">
            <h2>Sign in</h2>
            <form className="admin-form admin-login-form" onSubmit={handleLogin}>
              <label className="admin-field">
                <span>Username</span>
                <input
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                  autoComplete="username"
                />
              </label>
              <label className="admin-field">
                <span>Password</span>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  autoComplete="current-password"
                />
              </label>
              <div className="admin-form-actions">
                <button type="submit" className="primary-button" disabled={isBusy}>
                  Sign in
                </button>
              </div>
            </form>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">Release management and analytics</p>
            <h1>SuperPen admin</h1>
            <p className="admin-copy">
              Manage releases, monitor adoption, inspect user flows, and watch API health from one place.
            </p>
          </div>
          <div className="admin-top-actions">
            <button type="button" className="secondary-button" onClick={loadDashboard} disabled={isBusy}>
              Refresh
            </button>
            <button type="button" className="secondary-button" onClick={logout}>
              Log out
            </button>
            <a className="secondary-button" href="/">
              Back to site
            </a>
          </div>
        </div>

        <div className="admin-note">{message}</div>

        {analyticsOverview && (
          <>
            <section className="analytics-section">
              <div className="analytics-summary-grid">
                <article className="analytics-metric-card">
                  <span>Page views (30d)</span>
                  <strong>{formatNumber(analyticsOverview.summary.pageViews30d)}</strong>
                </article>
                <article className="analytics-metric-card">
                  <span>Unique visitors (30d)</span>
                  <strong>{formatNumber(analyticsOverview.summary.uniqueVisitors30d)}</strong>
                </article>
                <article className="analytics-metric-card">
                  <span>Downloads (30d)</span>
                  <strong>{formatNumber(analyticsOverview.summary.totalDownloads30d)}</strong>
                </article>
                <article className="analytics-metric-card">
                  <span>Avg session</span>
                  <strong>{formatDuration(analyticsOverview.summary.averageSessionSeconds30d)}</strong>
                </article>
                <article className="analytics-metric-card">
                  <span>Engaged sessions</span>
                  <strong>{formatNumber(analyticsOverview.summary.engagedSessions30d)}</strong>
                </article>
                <article className="analytics-metric-card">
                  <span>Retention D1 / D7 / D30</span>
                  <strong>
                    {formatPercent(analyticsOverview.retention.day1)} / {formatPercent(analyticsOverview.retention.day7)} / {formatPercent(analyticsOverview.retention.day30)}
                  </strong>
                </article>
              </div>
            </section>

            <section className="analytics-grid">
              <article className="admin-card analytics-card">
                <h2>Conversion funnel</h2>
                <BarList
                  items={analyticsOverview.funnel}
                  getLabel={(item) => (item as { step: string }).step}
                  getValue={(item) => (item as { count: number }).count}
                />
              </article>

              <article className="admin-card analytics-card">
                <h2>Downloads by release</h2>
                <BarList
                  items={analyticsOverview.downloadsByRelease}
                  getLabel={(item) => (item as { version: string }).version}
                  getValue={(item) => (item as { downloads: number }).downloads}
                />
              </article>

              <article className="admin-card analytics-card">
                <h2>Clicks by target</h2>
                <BarList
                  items={analyticsOverview.clicksByTarget}
                  getLabel={(item) => (item as { target: string }).target}
                  getValue={(item) => (item as { count: number }).count}
                />
              </article>

              <article className="admin-card analytics-card">
                <h2>Geographic results</h2>
                <div className="analytics-table-wrap">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Visitors</th>
                        <th>Views</th>
                        <th>Downloads</th>
                        <th>Avg session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsOverview.geoByCountry.map((row) => (
                        <tr key={row.country}>
                          <td>{row.country}</td>
                          <td>{formatNumber(row.visitors)}</td>
                          <td>{formatNumber(row.pageViews)}</td>
                          <td>{formatNumber(row.downloads)}</td>
                          <td>{formatDuration(row.averageSessionSeconds)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="admin-card analytics-card">
                <h2>Device mix</h2>
                <div className="analytics-split-list">
                  <div>
                    <h3>Browsers</h3>
                    <BarList
                      items={analyticsOverview.devices.browsers}
                      getLabel={(item) => (item as { name: string }).name}
                      getValue={(item) => (item as { count: number }).count}
                    />
                  </div>
                  <div>
                    <h3>Operating systems</h3>
                    <BarList
                      items={analyticsOverview.devices.operatingSystems}
                      getLabel={(item) => (item as { name: string }).name}
                      getValue={(item) => (item as { count: number }).count}
                    />
                  </div>
                  <div>
                    <h3>Device types</h3>
                    <BarList
                      items={analyticsOverview.devices.deviceTypes}
                      getLabel={(item) => (item as { name: string }).name}
                      getValue={(item) => (item as { count: number }).count}
                    />
                  </div>
                </div>
              </article>

              <article className="admin-card analytics-card analytics-card-wide">
                <h2>Traffic by day</h2>
                <div className="analytics-table-wrap">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Page views</th>
                        <th>Unique visitors</th>
                        <th>Downloads</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsOverview.trafficByDay.slice(-14).map((row) => (
                        <tr key={row.date}>
                          <td>{row.date}</td>
                          <td>{formatNumber(row.pageViews)}</td>
                          <td>{formatNumber(row.uniqueVisitors)}</td>
                          <td>{formatNumber(row.downloads)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="admin-card analytics-card analytics-card-wide">
                <h2>API performance</h2>
                <div className="analytics-table-wrap">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Endpoint</th>
                        <th>Requests</th>
                        <th>Avg</th>
                        <th>P95</th>
                        <th>P99</th>
                        <th>Error rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsOverview.apiPerformance.map((row) => (
                        <tr key={`${row.method}-${row.path}`}>
                          <td>{row.method} {row.path}</td>
                          <td>{formatNumber(row.requests)}</td>
                          <td>{row.averageMs}ms</td>
                          <td>{row.p95Ms}ms</td>
                          <td>{row.p99Ms}ms</td>
                          <td>{formatPercent(row.errorRate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="admin-card analytics-card">
                <h2>Referrers</h2>
                <BarList
                  items={analyticsOverview.referrers}
                  getLabel={(item) => (item as { source: string }).source}
                  getValue={(item) => (item as { count: number }).count}
                />
              </article>

              <article className="admin-card analytics-card">
                <h2>Recent events</h2>
                <div className="analytics-event-list">
                  {analyticsOverview.recentEvents.map((event) => (
                    <div className="analytics-event-item" key={`${event.occurredAt}-${event.eventType}-${event.sessionId || ""}`}>
                      <strong>{event.eventType}</strong>
                      <span>{formatDateTime(event.occurredAt)}</span>
                      <p>
                        {event.path || event.label || "No label"}
                        {event.releaseVersion ? ` - ${event.releaseVersion}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        <section className="analytics-grid">
          <section className="admin-card analytics-card">
            <h2>Create or update release</h2>
            <form className="admin-form" onSubmit={submitRelease}>
              <label className="admin-field">
                <span>Version</span>
                <input
                  value={form.version}
                  onChange={(event) => setForm((current) => ({ ...current, version: event.target.value }))}
                  placeholder="1.0.0"
                />
              </label>
              <label className="admin-field">
                <span>Channel</span>
                <input
                  value={form.channel}
                  onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))}
                  placeholder="stable"
                />
              </label>
              <label className="admin-field">
                <span>Platform</span>
                <input
                  value={form.platform}
                  onChange={(event) => setForm((current) => ({ ...current, platform: event.target.value }))}
                  placeholder="Windows"
                />
              </label>
              <label className="admin-field admin-field-wide">
                <span>Download URL</span>
                <input
                  value={form.downloadUrl}
                  onChange={(event) => setForm((current) => ({ ...current, downloadUrl: event.target.value }))}
                  placeholder="https://..."
                />
              </label>
              <label className="admin-field">
                <span>Published at</span>
                <input
                  value={form.publishedAt}
                  onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}
                  placeholder="2026-04-01T00:00:00Z"
                />
              </label>
              <label className="admin-field">
                <span>File size</span>
                <input
                  value={form.fileSize}
                  onChange={(event) => setForm((current) => ({ ...current, fileSize: event.target.value }))}
                  placeholder="42 MB"
                />
              </label>
              <label className="admin-field admin-field-wide">
                <span>Checksum</span>
                <input
                  value={form.checksum}
                  onChange={(event) => setForm((current) => ({ ...current, checksum: event.target.value }))}
                  placeholder="sha256..."
                />
              </label>
              <label className="admin-field admin-field-wide">
                <span>Summary</span>
                <textarea
                  value={form.summary}
                  onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
                  rows={3}
                />
              </label>
              <label className="admin-field admin-field-wide">
                <span>Release notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  rows={6}
                  placeholder="One note per line"
                />
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.makeCurrent}
                  onChange={(event) => setForm((current) => ({ ...current, makeCurrent: event.target.checked }))}
                />
                <span>Make this the current release</span>
              </label>
              <div className="admin-form-actions">
                <button type="submit" className="primary-button" disabled={isBusy}>
                  Save release
                </button>
                <button type="button" className="secondary-button" onClick={() => setForm(EMPTY_FORM)} disabled={isBusy}>
                  Clear
                </button>
              </div>
            </form>
          </section>

          <section className="admin-card analytics-card">
            <h2>Published releases</h2>
            <div className="admin-release-list">
              {siteData?.releases?.length ? (
                siteData.releases.map((release) => {
                  const isCurrent = release.version === siteData.currentVersion;
                  return (
                    <article key={release.version} className="admin-release-item">
                      <div className="admin-release-head">
                        <div>
                          <strong>{release.version}</strong>
                          <span>{release.channel} - {release.platform}</span>
                        </div>
                        {isCurrent && <span className="admin-current-pill">Current</span>}
                      </div>
                      <p>{release.summary || "No summary provided."}</p>
                      <div className="admin-release-links">
                        <a href={release.downloadUrl} target="_blank" rel="noreferrer">
                          Download
                        </a>
                        <button type="button" onClick={() => setForm(toFormState(release))}>
                          Edit
                        </button>
                        <button type="button" onClick={() => makeCurrent(release.version)} disabled={isBusy || isCurrent}>
                          Make current
                        </button>
                        <button type="button" onClick={() => removeRelease(release.version)} disabled={isBusy}>
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="admin-empty">No releases loaded yet. Click refresh after signing in.</p>
              )}
            </div>
          </section>

          <section className="admin-card analytics-card analytics-card-wide">
            <h2>User timeline lookup</h2>
            <form className="admin-form" onSubmit={loadTimeline}>
              <label className="admin-field">
                <span>Visitor ID</span>
                <input
                  value={timelineForm.visitorId}
                  onChange={(event) => setTimelineForm((current) => ({ ...current, visitorId: event.target.value }))}
                  placeholder="visitor-..."
                />
              </label>
              <label className="admin-field">
                <span>Session ID</span>
                <input
                  value={timelineForm.sessionId}
                  onChange={(event) => setTimelineForm((current) => ({ ...current, sessionId: event.target.value }))}
                  placeholder="session-..."
                />
              </label>
              <div className="admin-form-actions">
                <button type="submit" className="primary-button" disabled={isBusy}>
                  Load timeline
                </button>
              </div>
            </form>

            <div className="analytics-event-list timeline-list">
              {timelineEvents.length > 0 ? (
                timelineEvents.map((event) => (
                  <div className="analytics-event-item" key={`${event.occurredAt}-${event.eventType}-${event.sessionId || ""}`}>
                    <strong>{event.eventType}</strong>
                    <span>{formatDateTime(event.occurredAt)}</span>
                    <p>
                      {event.path || event.targetId || event.label || "No label"}
                      {event.releaseVersion ? ` - ${event.releaseVersion}` : ""}
                    </p>
                    <small>
                      {event.country || "Unknown"} - {event.browser || "Unknown"} - {event.os || "Unknown"}
                      {typeof event.elapsedSeconds === "number" ? ` - ${formatDuration(event.elapsedSeconds)}` : ""}
                    </small>
                  </div>
                ))
              ) : (
                <p className="admin-empty">Enter a visitor ID or session ID to inspect a single user timeline.</p>
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
