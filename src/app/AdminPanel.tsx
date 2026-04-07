"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  type AnalyticsExport,
  type AnalyticsOverview,
  type AnalyticsTimelineEvent,
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

type SessionLoginResponse = {
  user: {
    username: string;
  };
  expiresInMinutes: number;
};

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
  const maxValue = items.reduce<number>((max, item) => Math.max(max, getValue(item)), 0) || 1;

  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const label = getLabel(item);
        const value = getValue(item);
        return (
          <div className="grid gap-2" key={`${label}-${index}`}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <strong className="truncate font-semibold text-[var(--foreground)]">{label}</strong>
              <span className="shrink-0 text-[0.84rem] font-extrabold text-[var(--muted)]">{formatNumber(value)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(37,65,58,0.08)] dark:bg-[rgba(203,221,214,0.1)]" aria-hidden="true">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#ff7f66,#72d5b7)]"
                style={{ width: `${Math.max(8, (value / maxValue) * 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [loginForm, setLoginForm] = useState<LoginFormState>(EMPTY_LOGIN);
  const [timelineForm, setTimelineForm] = useState<TimelineFormState>(EMPTY_TIMELINE);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [analyticsOverview, setAnalyticsOverview] = useState<AnalyticsOverview | null>(null);
  const [analyticsExport, setAnalyticsExport] = useState<AnalyticsExport | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<AnalyticsTimelineEvent[]>([]);
  const [form, setForm] = useState<ReleaseFormState>(EMPTY_FORM);
  const [message, setMessage] = useState("Log in to manage releases and analytics.");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const payload = (await response.json().catch(() => null)) as { authenticated?: boolean } | null;
        if (!isMounted) {
          return;
        }
        setIsAuthenticated(Boolean(payload?.authenticated));
      } catch {
        if (!isMounted) {
          return;
        }
        setIsAuthenticated(false);
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const authenticatedFetch = useCallback(async (path: string, init?: RequestInit) => {
    const response = await fetch(path, {
      ...init,
      cache: "no-store",
    });

    if (response.status === 401) {
      setIsAuthenticated(false);
      setSiteData(null);
      setAnalyticsOverview(null);
      setAnalyticsExport(null);
      setTimelineEvents([]);
      router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);
      throw new Error("Session expired. Please log in again.");
    }

    return response;
  }, [pathname, router]);

  const loadDashboard = useCallback(async () => {
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
      setAnalyticsExport(null);
      setMessage("Dashboard updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
    } finally {
      setIsBusy(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (isAuthenticated) {
      void loadDashboard();
    }
  }, [isAuthenticated, loadDashboard]);

  useEffect(() => {
    if (!isAuthenticated || pathname !== "/admin/login") {
      return;
    }

    const nextPath = searchParams.get("next") || "/admin";
    router.replace(nextPath);
  }, [isAuthenticated, pathname, router, searchParams]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Signing in...");
    try {
      const response = await fetch("/api/admin/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | SessionLoginResponse
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error((payload as { error?: string } | null)?.error || "Login failed.");
      }

      setIsAuthenticated(true);
      setMessage(`Signed in as ${(payload as SessionLoginResponse).user.username}.`);
      setLoginForm((current) => ({ ...current, password: "" }));

      const nextPath = searchParams.get("next") || "/admin";
      router.replace(nextPath);
    } catch (error) {
      setIsAuthenticated(false);
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

  async function exportTopReport() {
    setIsBusy(true);
    setMessage("Preparing analytics export...");

    try {
      const response = await authenticatedFetch("/api/admin/analytics/export/top");
      if (!response.ok) {
        throw new Error(`Export request failed: ${response.status}`);
      }

      const payload = (await response.json()) as AnalyticsExport;
      setAnalyticsExport(payload);

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `superpen-top-report-${payload.generatedAt.slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setMessage("Analytics export downloaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not export analytics.");
    } finally {
      setIsBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session/logout", {
      method: "POST",
      cache: "no-store",
    }).catch(() => undefined);

    setIsAuthenticated(false);
    setSiteData(null);
    setAnalyticsOverview(null);
    setAnalyticsExport(null);
    setTimelineEvents([]);
    setMessage("Logged out.");
    router.replace("/admin/login");
  }

  if (isCheckingSession) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] max-[520px]:px-3 max-[520px]:py-4">
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur-[18px] max-[520px]:rounded-[1.25rem] max-[520px]:p-4">
          <div className="rounded-[1.2rem] border border-[rgba(255,127,102,0.18)] bg-[rgba(255,127,102,0.08)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            Checking admin session...
          </div>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] max-[520px]:px-3 max-[520px]:py-4">
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur-[18px] max-[520px]:rounded-[1.25rem] max-[520px]:p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-[36rem]">
              <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d]">Release management</p>
              <h1 className="mt-2 font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] tracking-[-0.04em]">
                SuperPen admin
              </h1>
              <p className="mt-3 text-[1rem] leading-[1.75] text-[var(--muted)]">
                Log in with your admin account to manage versions, downloads, and analytics.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-5 py-3 font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5"
              href="/"
            >
              Back to site
            </Link>
          </div>

          <div className="rounded-[1.2rem] border border-[rgba(255,127,102,0.18)] bg-[rgba(255,127,102,0.08)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            {message}
          </div>

          <section className="mx-auto w-full max-w-xl rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[0_18px_36px_rgba(79,63,37,0.08)] max-[520px]:rounded-[1.2rem] max-[520px]:p-4">
            <h2 className="text-[1.4rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Sign in</h2>
            <form className="mt-5 grid gap-4" onSubmit={handleLogin}>
              <label className="grid gap-2">
                <span className="text-[0.84rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Username</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                  autoComplete="username"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.84rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Password</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  autoComplete="current-password"
                />
              </label>
              <div className="flex justify-start pt-2">
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff7f66] px-6 py-3 font-extrabold text-white shadow-[0_12px_24px_rgba(255,127,102,0.18)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isBusy}
                >
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
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] max-[520px]:px-3 max-[520px]:py-4">
      <section className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur-[18px] max-[520px]:rounded-[1.25rem] max-[520px]:p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[42rem]">
            <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-[#c7664d]">Release management and analytics</p>
            <h1 className="mt-2 font-[Georgia,Palatino_Linotype,Book_Antiqua,serif] text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.02] tracking-[-0.04em]">
              SuperPen admin
            </h1>
            <p className="mt-3 text-[1rem] leading-[1.75] text-[var(--muted)]">
              Manage releases, monitor adoption, inspect user flows, and watch API health from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-5 py-3 font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={loadDashboard}
              disabled={isBusy}
            >
              Refresh
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-5 py-3 font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={exportTopReport}
              disabled={isBusy}
            >
              Export report
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-5 py-3 font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5"
              onClick={logout}
            >
              Log out
            </button>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-5 py-3 font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5"
              href="/"
            >
              Back to site
            </Link>
          </div>
        </div>

        <div className="rounded-[1.2rem] border border-[rgba(255,127,102,0.18)] bg-[rgba(255,127,102,0.08)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
          {message}
        </div>

        {analyticsOverview && (
          <>
            <section className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-[0_14px_30px_rgba(79,63,37,0.06)]">
                  <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Page views (30d)</span>
                  <strong className="mt-2 block text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">{formatNumber(analyticsOverview.summary.pageViews30d)}</strong>
                </article>
                <article className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-[0_14px_30px_rgba(79,63,37,0.06)]">
                  <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Unique visitors (30d)</span>
                  <strong className="mt-2 block text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">{formatNumber(analyticsOverview.summary.uniqueVisitors30d)}</strong>
                </article>
                <article className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-[0_14px_30px_rgba(79,63,37,0.06)]">
                  <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Downloads (30d)</span>
                  <strong className="mt-2 block text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">{formatNumber(analyticsOverview.summary.totalDownloads30d)}</strong>
                </article>
                <article className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-[0_14px_30px_rgba(79,63,37,0.06)]">
                  <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Completed downloads (30d)</span>
                  <strong className="mt-2 block text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">{formatNumber(analyticsOverview.summary.completedDownloads30d)}</strong>
                </article>
                <article className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-[0_14px_30px_rgba(79,63,37,0.06)]">
                  <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Avg session</span>
                  <strong className="mt-2 block text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">{formatDuration(analyticsOverview.summary.averageSessionSeconds30d)}</strong>
                </article>
                <article className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-[0_14px_30px_rgba(79,63,37,0.06)]">
                  <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Retention D1 / D7 / D30</span>
                  <strong className="mt-2 block text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {formatPercent(analyticsOverview.retention.day1)} / {formatPercent(analyticsOverview.retention.day7)} / {formatPercent(analyticsOverview.retention.day30)}
                  </strong>
                </article>
                <article className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-[0_14px_30px_rgba(79,63,37,0.06)]">
                  <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Engaged sessions</span>
                  <strong className="mt-2 block text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">{formatNumber(analyticsOverview.summary.engagedSessions30d)}</strong>
                </article>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Alerts</h2>
                <div className="mt-4 grid gap-3">
                  {analyticsOverview.alerts.length > 0 ? (
                    analyticsOverview.alerts.map((alert, index) => (
                      <div
                        key={`${alert.method}-${alert.path}-${alert.type}-${index}`}
                        className={alert.level === "critical"
                          ? "rounded-[1rem] border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.08)] px-4 py-3"
                          : "rounded-[1rem] border border-[rgba(245,158,11,0.24)] bg-[rgba(245,158,11,0.1)] px-4 py-3"
                        }
                      >
                        <strong className="text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--foreground)]">{alert.level.toUpperCase()}</strong>
                        <p className="mt-1 text-[0.96rem] leading-[1.7] text-[var(--foreground)]">{alert.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">No alert thresholds are currently breached.</p>
                  )}
                </div>
              </article>

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Conversion funnel</h2>
                <BarList
                  items={analyticsOverview.funnel}
                  getLabel={(item) => (item as { step: string }).step}
                  getValue={(item) => (item as { count: number }).count}
                />
              </article>

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Downloads by release</h2>
                <div className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--line)]">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-[var(--surface)] text-[0.78rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3 font-extrabold">Release</th>
                        <th className="px-4 py-3 font-extrabold">Started</th>
                        <th className="px-4 py-3 font-extrabold">Completed</th>
                        <th className="px-4 py-3 font-extrabold">Unique visitors</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--surface-strong)]">
                      {analyticsOverview.downloadsByRelease.map((row) => (
                        <tr key={row.version} className="border-t border-[var(--line)]">
                          <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{row.version}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.startedDownloads)}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.completedDownloads)}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.uniqueVisitors)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Clicks by target</h2>
                <BarList
                  items={analyticsOverview.clicksByTarget}
                  getLabel={(item) => (item as { target: string }).target}
                  getValue={(item) => (item as { count: number }).count}
                />
              </article>

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Geographic results</h2>
                <div className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--line)]">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-[var(--surface)] text-[0.78rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3 font-extrabold">Country</th>
                        <th className="px-4 py-3 font-extrabold">Visitors</th>
                        <th className="px-4 py-3 font-extrabold">Views</th>
                        <th className="px-4 py-3 font-extrabold">Downloads</th>
                        <th className="px-4 py-3 font-extrabold">Avg session</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--surface-strong)]">
                      {analyticsOverview.geoByCountry.map((row) => (
                        <tr key={row.country} className="border-t border-[var(--line)]">
                          <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{row.country}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.visitors)}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.pageViews)}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.downloads)}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatDuration(row.averageSessionSeconds)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              {analyticsExport && (
                <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                  <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Latest export snapshot</h2>
                  <div className="mt-4 grid gap-5 lg:grid-cols-3">
                    <div className="grid gap-3">
                      <h3 className="text-[0.88rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Top pages</h3>
                      <BarList
                        items={analyticsExport.topPages}
                        getLabel={(item) => (item as { path: string }).path}
                        getValue={(item) => (item as { pageViews: number }).pageViews}
                      />
                    </div>
                    <div className="grid gap-3">
                      <h3 className="text-[0.88rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Top countries</h3>
                      <BarList
                        items={analyticsExport.topCountries}
                        getLabel={(item) => (item as { country: string }).country}
                        getValue={(item) => (item as { visitors: number }).visitors}
                      />
                    </div>
                    <div className="grid gap-3">
                      <h3 className="text-[0.88rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Top releases</h3>
                      <BarList
                        items={analyticsExport.topReleases}
                        getLabel={(item) => (item as { version: string }).version}
                        getValue={(item) => (item as { completedDownloads: number }).completedDownloads}
                      />
                    </div>
                  </div>
                </article>
              )}

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Device mix</h2>
                <div className="mt-4 grid gap-5 lg:grid-cols-3">
                  <div className="grid gap-3">
                    <h3 className="text-[0.88rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Browsers</h3>
                    <BarList
                      items={analyticsOverview.devices.browsers}
                      getLabel={(item) => (item as { name: string }).name}
                      getValue={(item) => (item as { count: number }).count}
                    />
                  </div>
                  <div className="grid gap-3">
                    <h3 className="text-[0.88rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Operating systems</h3>
                    <BarList
                      items={analyticsOverview.devices.operatingSystems}
                      getLabel={(item) => (item as { name: string }).name}
                      getValue={(item) => (item as { count: number }).count}
                    />
                  </div>
                  <div className="grid gap-3">
                    <h3 className="text-[0.88rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Device types</h3>
                    <BarList
                      items={analyticsOverview.devices.deviceTypes}
                      getLabel={(item) => (item as { name: string }).name}
                      getValue={(item) => (item as { count: number }).count}
                    />
                  </div>
                </div>
              </article>

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)] xl:col-span-2">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Traffic by day</h2>
                <div className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--line)]">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-[var(--surface)] text-[0.78rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3 font-extrabold">Date</th>
                        <th className="px-4 py-3 font-extrabold">Page views</th>
                        <th className="px-4 py-3 font-extrabold">Unique visitors</th>
                        <th className="px-4 py-3 font-extrabold">Downloads</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--surface-strong)]">
                      {analyticsOverview.trafficByDay.slice(-14).map((row) => (
                        <tr key={row.date} className="border-t border-[var(--line)]">
                          <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{row.date}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.pageViews)}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.uniqueVisitors)}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.downloads)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)] xl:col-span-2">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">API performance</h2>
                <div className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--line)]">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-[var(--surface)] text-[0.78rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3 font-extrabold">Endpoint</th>
                        <th className="px-4 py-3 font-extrabold">Requests</th>
                        <th className="px-4 py-3 font-extrabold">Avg</th>
                        <th className="px-4 py-3 font-extrabold">P95</th>
                        <th className="px-4 py-3 font-extrabold">P99</th>
                        <th className="px-4 py-3 font-extrabold">Error rate</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--surface-strong)]">
                      {analyticsOverview.apiPerformance.map((row) => (
                        <tr key={`${row.method}-${row.path}`} className="border-t border-[var(--line)]">
                          <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{row.method} {row.path}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatNumber(row.requests)}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{row.averageMs}ms</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{row.p95Ms}ms</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{row.p99Ms}ms</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{formatPercent(row.errorRate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Referrers</h2>
                <BarList
                  items={analyticsOverview.referrers}
                  getLabel={(item) => (item as { source: string }).source}
                  getValue={(item) => (item as { count: number }).count}
                />
              </article>

              <article className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Recent events</h2>
                <div className="mt-4 grid gap-3">
                  {analyticsOverview.recentEvents.map((event) => (
                    <div className="rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3" key={`${event.occurredAt}-${event.eventType}-${event.sessionId || ""}`}>
                      <strong className="text-[0.84rem] font-extrabold uppercase tracking-[0.08em] text-[#c7664d]">{event.eventType}</strong>
                      <span className="mt-1 block text-[0.82rem] text-[var(--muted)]">{formatDateTime(event.occurredAt)}</span>
                      <p className="mt-2 text-[0.96rem] leading-[1.7] text-[var(--foreground)]">
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

        <section className="grid gap-4 xl:grid-cols-2">
          <section className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
            <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Create or update release</h2>
            <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={submitRelease}>
              <label className="grid gap-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Version</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.version}
                  onChange={(event) => setForm((current) => ({ ...current, version: event.target.value }))}
                  placeholder="1.0.0"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Channel</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.channel}
                  onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))}
                  placeholder="stable"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Platform</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.platform}
                  onChange={(event) => setForm((current) => ({ ...current, platform: event.target.value }))}
                  placeholder="Windows"
                />
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Download URL</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.downloadUrl}
                  onChange={(event) => setForm((current) => ({ ...current, downloadUrl: event.target.value }))}
                  placeholder="https://..."
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Published at</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.publishedAt}
                  onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}
                  placeholder="2026-04-01T00:00:00Z"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">File size</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.fileSize}
                  onChange={(event) => setForm((current) => ({ ...current, fileSize: event.target.value }))}
                  placeholder="42 MB"
                />
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Checksum</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.checksum}
                  onChange={(event) => setForm((current) => ({ ...current, checksum: event.target.value }))}
                  placeholder="sha256..."
                />
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Summary</span>
                <textarea
                  className="min-h-28 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.summary}
                  onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
                  rows={3}
                />
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Release notes</span>
                <textarea
                  className="min-h-40 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  rows={6}
                  placeholder="One note per line"
                />
              </label>
              <label className="flex items-center gap-3 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 sm:col-span-2">
                <input
                  className="h-4 w-4 accent-[#ff7f66]"
                  type="checkbox"
                  checked={form.makeCurrent}
                  onChange={(event) => setForm((current) => ({ ...current, makeCurrent: event.target.checked }))}
                />
                <span>Make this the current release</span>
              </label>
              <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
                <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff7f66] px-6 py-3 font-extrabold text-white shadow-[0_12px_24px_rgba(255,127,102,0.18)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" disabled={isBusy}>
                  Save release
                </button>
                <button type="button" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-6 py-3 font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" onClick={() => setForm(EMPTY_FORM)} disabled={isBusy}>
                  Clear
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)]">
            <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">Published releases</h2>
            <div className="mt-4 grid gap-3">
              {siteData?.releases?.length ? (
                siteData.releases.map((release) => {
                  const isCurrent = release.version === siteData.currentVersion;
                  return (
                    <article key={release.version} className="rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <strong className="block text-[1rem] font-semibold text-[var(--foreground)]">{release.version}</strong>
                          <span className="mt-1 block text-[0.84rem] uppercase tracking-[0.08em] text-[var(--muted)]">{release.channel} - {release.platform}</span>
                        </div>
                        {isCurrent && <span className="inline-flex rounded-full bg-[rgba(114,213,183,0.18)] px-3 py-1 text-[0.76rem] font-extrabold uppercase tracking-[0.08em] text-[#1d7f62]">Current</span>}
                      </div>
                      <p className="mt-3 text-[0.96rem] leading-[1.7] text-[var(--muted)]">{release.summary || "No summary provided."}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-4 py-2 text-[0.88rem] font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5" href={release.downloadUrl} target="_blank" rel="noreferrer">
                          Download
                        </a>
                        <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-4 py-2 text-[0.88rem] font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5" type="button" onClick={() => setForm(toFormState(release))}>
                          Edit
                        </button>
                        <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--secondary-border)] bg-[var(--secondary-bg)] px-4 py-2 text-[0.88rem] font-extrabold text-[var(--foreground)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => makeCurrent(release.version)} disabled={isBusy || isCurrent}>
                          Make current
                        </button>
                        <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.08)] px-4 py-2 text-[0.88rem] font-extrabold text-[#b42318] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => removeRelease(release.version)} disabled={isBusy}>
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">No releases loaded yet. Click refresh after signing in.</p>
              )}
            </div>
          </section>

          <section className="rounded-[1.45rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_36px_rgba(79,63,37,0.08)] xl:col-span-2">
            <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">User timeline lookup</h2>
            <form className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto]" onSubmit={loadTimeline}>
              <label className="grid gap-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Visitor ID</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={timelineForm.visitorId}
                  onChange={(event) => setTimelineForm((current) => ({ ...current, visitorId: event.target.value }))}
                  placeholder="visitor-..."
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">Session ID</span>
                <input
                  className="min-h-12 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[rgba(255,127,102,0.4)] focus:ring-2 focus:ring-[rgba(255,127,102,0.16)]"
                  value={timelineForm.sessionId}
                  onChange={(event) => setTimelineForm((current) => ({ ...current, sessionId: event.target.value }))}
                  placeholder="session-..."
                />
              </label>
              <div className="flex items-end">
                <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff7f66] px-6 py-3 font-extrabold text-white shadow-[0_12px_24px_rgba(255,127,102,0.18)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" disabled={isBusy}>
                  Load timeline
                </button>
              </div>
            </form>

            <div className="mt-4 grid gap-3">
              {timelineEvents.length > 0 ? (
                timelineEvents.map((event) => (
                  <div className="rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3" key={`${event.occurredAt}-${event.eventType}-${event.sessionId || ""}`}>
                    <strong className="text-[0.84rem] font-extrabold uppercase tracking-[0.08em] text-[#c7664d]">{event.eventType}</strong>
                    <span className="mt-1 block text-[0.82rem] text-[var(--muted)]">{formatDateTime(event.occurredAt)}</span>
                    <p className="mt-2 text-[0.96rem] leading-[1.7] text-[var(--foreground)]">
                      {event.path || event.targetId || event.label || "No label"}
                      {event.releaseVersion ? ` - ${event.releaseVersion}` : ""}
                    </p>
                    <small className="mt-2 block text-[0.82rem] text-[var(--muted)]">
                      {event.country || "Unknown"} - {event.browser || "Unknown"} - {event.os || "Unknown"}
                      {typeof event.elapsedSeconds === "number" ? ` - ${formatDuration(event.elapsedSeconds)}` : ""}
                    </small>
                  </div>
                ))
              ) : (
                <p className="rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">Enter a visitor ID or session ID to inspect a single user timeline.</p>
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
