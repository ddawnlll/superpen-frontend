"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  type AnalyticsExport,
  type AnalyticsOverview,
  type AnalyticsTimelineEvent,
  type Release,
  type SiteData,
} from "@/lib/superpen-api";

// ─── Types ────────────────────────────────────────────────────────────────────

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

type SessionLoginResponse = {
  user: { username: string };
  expiresInMinutes: number;
};

type LoginFailureDetails = {
  reason?: string;
  apiBaseUrl?: string;
  backendUrl?: string;
  status?: number;
  backendError?: string;
  rawError?: string;
  suggestion?: string;
};

type NavSection = "dashboard" | "analytics" | "releases" | "new-release" | "timeline" | "export";

// ─── Constants ────────────────────────────────────────────────────────────────

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

const EMPTY_LOGIN: LoginFormState = { username: "", password: "" };
const EMPTY_TIMELINE: TimelineFormState = { visitorId: "", sessionId: "" };

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number) {
  return `${value}%`;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toFormState(release?: Release | null): ReleaseFormState {
  if (!release) return EMPTY_FORM;
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="sp-stat-card">
      <span className="sp-stat-label">{label}</span>
      <strong className={`sp-stat-value${accent ? " sp-stat-value--accent" : ""}`}>{value}</strong>
      {sub && <span className="sp-stat-sub">{sub}</span>}
    </div>
  );
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
  const max = items.reduce<number>((m, i) => Math.max(m, getValue(i)), 0) || 1;
  return (
    <div className="sp-barlist">
      {items.map((item, idx) => {
        const label = getLabel(item);
        const value = getValue(item);
        return (
          <div className="sp-barlist-row" key={`${label}-${idx}`}>
            <div className="sp-barlist-meta">
              <span className="sp-barlist-label">{label}</span>
              <span className="sp-barlist-count">{formatNumber(value)}</span>
            </div>
            <div className="sp-barlist-track">
              <div
                className="sp-barlist-fill"
                style={{ width: `${Math.max(4, (value / max) * 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="sp-section-heading">{children}</h2>;
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`sp-panel ${className}`}>{children}</div>;
}

function PanelHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="sp-panel-header">
      <h3 className="sp-panel-title">{title}</h3>
      {action && (
        <button type="button" className="sp-panel-action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "current" | "beta" | "old" | "warning" | "danger" | "success" }) {
  return <span className={`sp-badge sp-badge--${variant}`}>{children}</span>;
}

function FormField({
  label,
  children,
  span2 = false,
}: {
  label: string;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <label className={`sp-field${span2 ? " sp-field--span2" : ""}`}>
      <span className="sp-field-label">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      className="sp-input"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={type === "password" ? "current-password" : undefined}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      className="sp-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
}

function Btn({
  children,
  variant = "secondary",
  onClick,
  type = "button",
  disabled = false,
  danger = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type={type}
      className={`sp-btn sp-btn--${variant}${danger ? " sp-btn--danger" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: NavSection; label: string; group: string }[] = [
  { id: "dashboard", label: "Dashboard", group: "Overview" },
  { id: "analytics", label: "Analytics", group: "Overview" },
  { id: "releases", label: "All releases", group: "Releases" },
  { id: "new-release", label: "New release", group: "Releases" },
  { id: "timeline", label: "Timeline lookup", group: "Users" },
  { id: "export", label: "Export data", group: "Reports" },
];

// ─── Page views ───────────────────────────────────────────────────────────────

function DashboardPage({
  analyticsOverview,
  siteData,
  onNavigate,
}: {
  analyticsOverview: AnalyticsOverview | null;
  siteData: SiteData | null;
  onNavigate: (section: NavSection) => void;
}) {
  if (!analyticsOverview) {
    return (
      <div className="sp-empty">
        <p>Loading dashboard data…</p>
      </div>
    );
  }

  const s = analyticsOverview.summary;

  return (
    <div className="sp-page-content">
      <div className="sp-stats-grid">
        <StatCard label="Page views (30d)" value={formatNumber(s.pageViews30d)} />
        <StatCard label="Unique visitors" value={formatNumber(s.uniqueVisitors30d)} />
        <StatCard label="Downloads (30d)" value={formatNumber(s.totalDownloads30d)} />
        <StatCard label="Completed downloads" value={formatNumber(s.completedDownloads30d)} />
        <StatCard label="Avg session" value={formatDuration(s.averageSessionSeconds30d)} />
        <StatCard
          label="Retention D1 / D7 / D30"
          value={`${formatPercent(analyticsOverview.retention.day1)} / ${formatPercent(analyticsOverview.retention.day7)} / ${formatPercent(analyticsOverview.retention.day30)}`}
        />
        <StatCard label="Engaged sessions" value={formatNumber(s.engagedSessions30d)} />
      </div>

      <div className="sp-grid-2">
        <Panel>
          <PanelHeader title="Releases" action="View all" onAction={() => onNavigate("releases")} />
          <div className="sp-release-list">
            {siteData?.releases?.slice(0, 4).map((r) => {
              const isCurrent = r.version === siteData.currentVersion;
              return (
                <div className="sp-release-row" key={r.version}>
                  <Badge variant={isCurrent ? "current" : r.channel === "beta" ? "beta" : "old"}>
                    {isCurrent ? "current" : r.channel}
                  </Badge>
                  <div className="sp-release-info">
                    <span className="sp-release-version">{r.version}</span>
                    <span className="sp-release-meta">{r.platform} · {formatDateTime(r.publishedAt)}</span>
                  </div>
                </div>
              );
            }) ?? <p className="sp-empty-inline">No releases.</p>}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Alerts" />
          <div className="sp-alerts">
            {analyticsOverview.alerts.length > 0 ? (
              analyticsOverview.alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`sp-alert sp-alert--${alert.level === "critical" ? "danger" : "warning"}`}
                >
                  <span className="sp-alert-dot" />
                  <div>
                    <strong className="sp-alert-level">{alert.level}</strong>
                    <p className="sp-alert-msg">{alert.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="sp-alert sp-alert--success">
                <span className="sp-alert-dot" />
                <p className="sp-alert-msg">All systems nominal. No alert thresholds breached.</p>
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Conversion funnel" />
          <BarList
            items={analyticsOverview.funnel}
            getLabel={(item) => (item as { step: string }).step}
            getValue={(item) => (item as { count: number }).count}
          />
        </Panel>

        <Panel>
          <PanelHeader title="Recent events" />
          <div className="sp-events">
            {analyticsOverview.recentEvents.slice(0, 5).map((event, i) => (
              <div className="sp-event-row" key={i}>
                <Badge variant="default">{event.eventType}</Badge>
                <div className="sp-event-info">
                  <span className="sp-event-path">{event.path || event.label || "—"}{event.releaseVersion ? ` · ${event.releaseVersion}` : ""}</span>
                  <span className="sp-event-time">{formatDateTime(event.occurredAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AnalyticsPage({ analyticsOverview, analyticsExport }: { analyticsOverview: AnalyticsOverview | null; analyticsExport: AnalyticsExport | null }) {
  if (!analyticsOverview) return <div className="sp-empty"><p>Loading analytics…</p></div>;

  return (
    <div className="sp-page-content">
      <div className="sp-grid-2">
        <Panel className="sp-span2">
          <PanelHeader title="Traffic by day (last 14 days)" />
          <div className="sp-table-wrap">
            <table className="sp-table">
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
                    <td className="sp-td-strong">{row.date}</td>
                    <td>{formatNumber(row.pageViews)}</td>
                    <td>{formatNumber(row.uniqueVisitors)}</td>
                    <td>{formatNumber(row.downloads)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Downloads by release" />
          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Release</th>
                  <th>Started</th>
                  <th>Completed</th>
                  <th>Visitors</th>
                </tr>
              </thead>
              <tbody>
                {analyticsOverview.downloadsByRelease.map((row) => (
                  <tr key={row.version}>
                    <td className="sp-td-strong">{row.version}</td>
                    <td>{formatNumber(row.startedDownloads)}</td>
                    <td>{formatNumber(row.completedDownloads)}</td>
                    <td>{formatNumber(row.uniqueVisitors)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Geographic results" />
          <div className="sp-table-wrap">
            <table className="sp-table">
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
                    <td className="sp-td-strong">{row.country}</td>
                    <td>{formatNumber(row.visitors)}</td>
                    <td>{formatNumber(row.pageViews)}</td>
                    <td>{formatNumber(row.downloads)}</td>
                    <td>{formatDuration(row.averageSessionSeconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="sp-span2">
          <PanelHeader title="API performance" />
          <div className="sp-table-wrap">
            <table className="sp-table">
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
                    <td className="sp-td-strong sp-td-mono">{row.method} {row.path}</td>
                    <td>{formatNumber(row.requests)}</td>
                    <td>{row.averageMs}ms</td>
                    <td>{row.p95Ms}ms</td>
                    <td>{row.p99Ms}ms</td>
                    <td>
                      <span className={`sp-perf-rate ${row.errorRate > 5 ? "sp-perf-rate--bad" : row.errorRate > 1 ? "sp-perf-rate--warn" : ""}`}>
                        {formatPercent(row.errorRate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Device mix" />
          <div className="sp-device-grid">
            <div>
              <p className="sp-sub-heading">Browsers</p>
              <BarList
                items={analyticsOverview.devices.browsers}
                getLabel={(item) => (item as { name: string }).name}
                getValue={(item) => (item as { count: number }).count}
              />
            </div>
            <div>
              <p className="sp-sub-heading">Operating systems</p>
              <BarList
                items={analyticsOverview.devices.operatingSystems}
                getLabel={(item) => (item as { name: string }).name}
                getValue={(item) => (item as { count: number }).count}
              />
            </div>
            <div>
              <p className="sp-sub-heading">Device types</p>
              <BarList
                items={analyticsOverview.devices.deviceTypes}
                getLabel={(item) => (item as { name: string }).name}
                getValue={(item) => (item as { count: number }).count}
              />
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Referrers" />
          <BarList
            items={analyticsOverview.referrers}
            getLabel={(item) => (item as { source: string }).source}
            getValue={(item) => (item as { count: number }).count}
          />
        </Panel>

        <Panel>
          <PanelHeader title="Clicks by target" />
          <BarList
            items={analyticsOverview.clicksByTarget}
            getLabel={(item) => (item as { target: string }).target}
            getValue={(item) => (item as { count: number }).count}
          />
        </Panel>

        {analyticsExport && (
          <Panel className="sp-span2">
            <PanelHeader title="Latest export snapshot" />
            <div className="sp-device-grid">
              <div>
                <p className="sp-sub-heading">Top pages</p>
                <BarList
                  items={analyticsExport.topPages}
                  getLabel={(item) => (item as { path: string }).path}
                  getValue={(item) => (item as { pageViews: number }).pageViews}
                />
              </div>
              <div>
                <p className="sp-sub-heading">Top countries</p>
                <BarList
                  items={analyticsExport.topCountries}
                  getLabel={(item) => (item as { country: string }).country}
                  getValue={(item) => (item as { visitors: number }).visitors}
                />
              </div>
              <div>
                <p className="sp-sub-heading">Top releases</p>
                <BarList
                  items={analyticsExport.topReleases}
                  getLabel={(item) => (item as { version: string }).version}
                  getValue={(item) => (item as { completedDownloads: number }).completedDownloads}
                />
              </div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function ReleasesPage({
  siteData,
  isBusy,
  onEdit,
  onMakeCurrent,
  onRemove,
  onNew,
}: {
  siteData: SiteData | null;
  isBusy: boolean;
  onEdit: (release: Release) => void;
  onMakeCurrent: (version: string) => void;
  onRemove: (version: string) => void;
  onNew: () => void;
}) {
  return (
    <div className="sp-page-content">
      <div className="sp-releases-list">
        {siteData?.releases?.length ? (
          siteData.releases.map((release) => {
            const isCurrent = release.version === siteData.currentVersion;
            return (
              <Panel key={release.version}>
                <div className="sp-release-card-header">
                  <div className="sp-release-card-title">
                    <h3 className="sp-release-card-version">{release.version}</h3>
                    <div className="sp-release-card-badges">
                      {isCurrent && <Badge variant="current">Current</Badge>}
                      <Badge variant={release.channel === "stable" ? "default" : "beta"}>{release.channel}</Badge>
                      <Badge variant="old">{release.platform}</Badge>
                    </div>
                  </div>
                  <div className="sp-release-card-actions">
                    <a className="sp-btn sp-btn--secondary" href={release.downloadUrl} target="_blank" rel="noreferrer">
                      Download
                    </a>
                    <Btn onClick={() => onEdit(release)}>Edit</Btn>
                    <Btn onClick={() => onMakeCurrent(release.version)} disabled={isBusy || isCurrent}>
                      Make current
                    </Btn>
                    <Btn danger onClick={() => onRemove(release.version)} disabled={isBusy}>
                      Delete
                    </Btn>
                  </div>
                </div>
                <p className="sp-release-card-summary">{release.summary || "No summary provided."}</p>
                {release.notes.length > 0 && (
                  <ul className="sp-release-notes">
                    {release.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                )}
                <div className="sp-release-card-meta">
                  <span>Published {formatDateTime(release.publishedAt)}</span>
                  {release.fileSize && <span>{release.fileSize}</span>}
                  {release.checksum && (
                    <span className="sp-release-checksum" title={release.checksum}>
                      sha256: {release.checksum.slice(0, 16)}…
                    </span>
                  )}
                </div>
              </Panel>
            );
          })
        ) : (
          <div className="sp-empty">
            <p>No releases yet.</p>
            <Btn variant="primary" onClick={onNew}>Create your first release</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function NewReleasePage({
  form,
  setForm,
  onSubmit,
  isBusy,
}: {
  form: ReleaseFormState;
  setForm: React.Dispatch<React.SetStateAction<ReleaseFormState>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isBusy: boolean;
}) {
  const set = (key: keyof ReleaseFormState) => (value: string | boolean) =>
    setForm((c) => ({ ...c, [key]: value }));

  return (
    <div className="sp-page-content">
      <Panel>
        <PanelHeader title="Release details" />
        <form className="sp-form" onSubmit={onSubmit}>
          <div className="sp-form-grid">
            <FormField label="Version">
              <Input value={form.version} onChange={set("version") as (v: string) => void} placeholder="1.0.0" />
            </FormField>
            <FormField label="Channel">
              <Input value={form.channel} onChange={set("channel") as (v: string) => void} placeholder="stable" />
            </FormField>
            <FormField label="Platform">
              <Input value={form.platform} onChange={set("platform") as (v: string) => void} placeholder="Windows" />
            </FormField>
            <FormField label="Published at">
              <Input value={form.publishedAt} onChange={set("publishedAt") as (v: string) => void} placeholder="2026-04-01T00:00:00Z" />
            </FormField>
            <FormField label="Download URL" span2>
              <Input value={form.downloadUrl} onChange={set("downloadUrl") as (v: string) => void} placeholder="https://…" />
            </FormField>
            <FormField label="File size">
              <Input value={form.fileSize} onChange={set("fileSize") as (v: string) => void} placeholder="42 MB" />
            </FormField>
            <FormField label="Checksum" span2>
              <Input value={form.checksum} onChange={set("checksum") as (v: string) => void} placeholder="sha256:…" />
            </FormField>
            <FormField label="Summary" span2>
              <Textarea value={form.summary} onChange={set("summary") as (v: string) => void} rows={2} />
            </FormField>
            <FormField label="Release notes (one per line)" span2>
              <Textarea value={form.notes} onChange={set("notes") as (v: string) => void} placeholder="One note per line" rows={6} />
            </FormField>
          </div>

          <label className="sp-checkbox-row">
            <input
              type="checkbox"
              className="sp-checkbox"
              checked={form.makeCurrent}
              onChange={(e) => set("makeCurrent")(e.target.checked)}
            />
            <span>Make this the current release</span>
          </label>

          <div className="sp-form-actions">
            <Btn type="submit" variant="primary" disabled={isBusy}>
              Save release
            </Btn>
            <Btn onClick={() => setForm(EMPTY_FORM)} disabled={isBusy}>
              Clear form
            </Btn>
          </div>
        </form>
      </Panel>
    </div>
  );
}

function TimelinePage({
  timelineForm,
  setTimelineForm,
  timelineEvents,
  onSubmit,
  isBusy,
}: {
  timelineForm: TimelineFormState;
  setTimelineForm: React.Dispatch<React.SetStateAction<TimelineFormState>>;
  timelineEvents: AnalyticsTimelineEvent[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isBusy: boolean;
}) {
  return (
    <div className="sp-page-content">
      <Panel>
        <PanelHeader title="User timeline lookup" />
        <form className="sp-timeline-form" onSubmit={onSubmit}>
          <FormField label="Visitor ID">
            <Input
              value={timelineForm.visitorId}
              onChange={(v) => setTimelineForm((c) => ({ ...c, visitorId: v }))}
              placeholder="visitor-…"
            />
          </FormField>
          <FormField label="Session ID">
            <Input
              value={timelineForm.sessionId}
              onChange={(v) => setTimelineForm((c) => ({ ...c, sessionId: v }))}
              placeholder="session-…"
            />
          </FormField>
          <div className="sp-timeline-submit">
            <Btn type="submit" variant="primary" disabled={isBusy}>
              Load timeline
            </Btn>
          </div>
        </form>
      </Panel>

      {timelineEvents.length > 0 ? (
        <Panel>
          <PanelHeader title={`${timelineEvents.length} events`} />
          <div className="sp-events sp-events--full">
            {timelineEvents.map((event, i) => (
              <div className="sp-event-row" key={i}>
                <Badge variant="default">{event.eventType}</Badge>
                <div className="sp-event-info">
                  <span className="sp-event-path">
                    {event.path || event.targetId || event.label || "—"}
                    {event.releaseVersion ? ` · ${event.releaseVersion}` : ""}
                  </span>
                  <span className="sp-event-time">{formatDateTime(event.occurredAt)}</span>
                  <span className="sp-event-meta">
                    {event.country || "Unknown"} · {event.browser || "Unknown"} · {event.os || "Unknown"}
                    {typeof event.elapsedSeconds === "number" ? ` · ${formatDuration(event.elapsedSeconds)}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <div className="sp-empty">
          <p>Enter a visitor ID or session ID above to inspect a user timeline.</p>
        </div>
      )}
    </div>
  );
}

function ExportPage({
  analyticsExport,
  onExport,
  isBusy,
}: {
  analyticsExport: AnalyticsExport | null;
  onExport: () => void;
  isBusy: boolean;
}) {
  return (
    <div className="sp-page-content">
      <Panel>
        <PanelHeader title="Export analytics data" />
        <p className="sp-export-desc">
          Download a full JSON snapshot of top pages, countries, and releases. The file will be saved to your downloads folder.
        </p>
        <Btn variant="primary" onClick={onExport} disabled={isBusy}>
          Download top report
        </Btn>
      </Panel>

      {analyticsExport && (
        <Panel>
          <PanelHeader title="Preview — last export" />
          <div className="sp-device-grid">
            <div>
              <p className="sp-sub-heading">Top pages</p>
              <BarList
                items={analyticsExport.topPages}
                getLabel={(item) => (item as { path: string }).path}
                getValue={(item) => (item as { pageViews: number }).pageViews}
              />
            </div>
            <div>
              <p className="sp-sub-heading">Top countries</p>
              <BarList
                items={analyticsExport.topCountries}
                getLabel={(item) => (item as { country: string }).country}
                getValue={(item) => (item as { visitors: number }).visitors}
              />
            </div>
            <div>
              <p className="sp-sub-heading">Top releases</p>
              <BarList
                items={analyticsExport.topReleases}
                getLabel={(item) => (item as { version: string }).version}
                getValue={(item) => (item as { completedDownloads: number }).completedDownloads}
              />
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

// ─── Login view ───────────────────────────────────────────────────────────────

function LoginView({
  loginForm,
  setLoginForm,
  message,
  loginFailureDetails,
  isBusy,
  onSubmit,
}: {
  loginForm: LoginFormState;
  setLoginForm: React.Dispatch<React.SetStateAction<LoginFormState>>;
  message: string;
  loginFailureDetails: LoginFailureDetails | null;
  isBusy: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="sp-login-root">
      <div className="sp-login-card">
        <div className="sp-login-brand">
          <h1 className="sp-login-title">SuperPen</h1>
          <p className="sp-login-subtitle">Admin console</p>
        </div>

        {message && (
          <div className="sp-login-message">{message}</div>
        )}

        <form className="sp-login-form" onSubmit={onSubmit}>
          <FormField label="Username">
            <input
              className="sp-input"
              value={loginForm.username}
              onChange={(e) => setLoginForm((c) => ({ ...c, username: e.target.value }))}
              autoComplete="username"
            />
          </FormField>
          <FormField label="Password">
            <input
              className="sp-input"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((c) => ({ ...c, password: e.target.value }))}
              autoComplete="current-password"
            />
          </FormField>
          <Btn type="submit" variant="primary" disabled={isBusy}>
            {isBusy ? "Signing in…" : "Sign in"}
          </Btn>
        </form>

        {loginFailureDetails && (
          <div className="sp-diagnostics">
            <p className="sp-diagnostics-title">Diagnostics</p>
            {loginFailureDetails.reason && (
              <div className="sp-diagnostics-row">
                <span>Reason</span>
                <span>{loginFailureDetails.reason}</span>
              </div>
            )}
            {typeof loginFailureDetails.status === "number" && (
              <div className="sp-diagnostics-row">
                <span>HTTP status</span>
                <span>{loginFailureDetails.status}</span>
              </div>
            )}
            {loginFailureDetails.apiBaseUrl && (
              <div className="sp-diagnostics-row">
                <span>API base URL</span>
                <code>{loginFailureDetails.apiBaseUrl}</code>
              </div>
            )}
            {loginFailureDetails.backendUrl && (
              <div className="sp-diagnostics-row">
                <span>Backend login URL</span>
                <code>{loginFailureDetails.backendUrl}</code>
              </div>
            )}
            {loginFailureDetails.backendError && (
              <div className="sp-diagnostics-row">
                <span>Backend error</span>
                <span>{loginFailureDetails.backendError}</span>
              </div>
            )}
            {loginFailureDetails.rawError && (
              <div className="sp-diagnostics-row">
                <span>Raw error</span>
                <code>{loginFailureDetails.rawError}</code>
              </div>
            )}
            {loginFailureDetails.suggestion && (
              <div className="sp-diagnostics-row">
                <span>Suggested fix</span>
                <span>{loginFailureDetails.suggestion}</span>
              </div>
            )}
          </div>
        )}

        <div className="sp-login-footer">
          <Link href="/">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminPanel({ loginNextPath = "/admin" }: { loginNextPath?: string }) {
  const router = useRouter();
  const pathname = usePathname();
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
  const [loginFailureDetails, setLoginFailureDetails] = useState<LoginFailureDetails | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");

  // ── Session check ────────────────────────────────────────────────────────

  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        const payload = (await res.json().catch(() => null)) as { authenticated?: boolean } | null;
        if (isMounted) setIsAuthenticated(Boolean(payload?.authenticated));
      } catch {
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    }
    void checkSession();
    return () => { isMounted = false; };
  }, []);

  // ── Authenticated fetch ──────────────────────────────────────────────────

  const authenticatedFetch = useCallback(async (path: string, init?: RequestInit) => {
    const res = await fetch(path, { ...init, cache: "no-store" });
    if (res.status === 401) {
      setIsAuthenticated(false);
      setSiteData(null);
      setAnalyticsOverview(null);
      setAnalyticsExport(null);
      setTimelineEvents([]);
      router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);
      throw new Error("Session expired. Please log in again.");
    }
    return res;
  }, [pathname, router]);

  // ── Load dashboard ───────────────────────────────────────────────────────

  const loadDashboard = useCallback(async () => {
    setIsBusy(true);
    setMessage("Refreshing…");
    try {
      const [relRes, anaRes] = await Promise.all([
        authenticatedFetch("/api/admin/releases"),
        authenticatedFetch("/api/admin/analytics/overview"),
      ]);
      if (!relRes.ok) throw new Error(`Releases: ${relRes.status}`);
      if (!anaRes.ok) throw new Error(`Analytics: ${anaRes.status}`);
      setSiteData(await relRes.json() as SiteData);
      setAnalyticsOverview(await anaRes.json() as AnalyticsOverview);
      setMessage("Dashboard updated.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not load dashboard.");
    } finally {
      setIsBusy(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (isAuthenticated) void loadDashboard();
  }, [isAuthenticated, loadDashboard]);

  useEffect(() => {
    if (!isAuthenticated || pathname !== "/admin/login") return;
    router.replace(loginNextPath);
  }, [isAuthenticated, loginNextPath, pathname, router]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Signing in…");
    setLoginFailureDetails(null);
    try {
      const res = await fetch("/api/admin/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginForm.username, password: loginForm.password }),
      });
      const payload = (await res.json().catch(() => null)) as
        | SessionLoginResponse
        | { error?: string; details?: LoginFailureDetails }
        | null;
      if (!res.ok) {
        setLoginFailureDetails((payload as { details?: LoginFailureDetails } | null)?.details || null);
        throw new Error((payload as { error?: string } | null)?.error || "Login failed.");
      }
      setIsAuthenticated(true);
      setLoginFailureDetails(null);
      setMessage(`Signed in as ${(payload as SessionLoginResponse).user.username}.`);
      setLoginForm((c) => ({ ...c, password: "" }));
      router.replace(loginNextPath);
    } catch (err) {
      setIsAuthenticated(false);
      setMessage(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function submitRelease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Saving release…");
    try {
      const res = await authenticatedFetch("/api/admin/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, publishedAt: form.publishedAt || undefined, notes: form.notes }),
      });
      if (!res.ok) {
        const p = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(p?.error || `Request failed: ${res.status}`);
      }
      setSiteData(await res.json() as SiteData);
      setMessage(`Saved release ${form.version}.`);
      setForm(EMPTY_FORM);
      setActiveSection("releases");
      await loadDashboard();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save release.");
    } finally {
      setIsBusy(false);
    }
  }

  async function makeCurrent(version: string) {
    setIsBusy(true);
    setMessage(`Setting ${version} as current…`);
    try {
      const res = await authenticatedFetch("/api/admin/releases/current", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setSiteData(await res.json() as SiteData);
      setMessage(`Current version set to ${version}.`);
      await loadDashboard();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not set current version.");
    } finally {
      setIsBusy(false);
    }
  }

  async function removeRelease(version: string) {
    setIsBusy(true);
    setMessage(`Deleting ${version}…`);
    try {
      const res = await authenticatedFetch(`/api/admin/releases/${encodeURIComponent(version)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setSiteData(await res.json() as SiteData);
      setMessage(`Deleted ${version}.`);
      await loadDashboard();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not delete release.");
    } finally {
      setIsBusy(false);
    }
  }

  async function loadTimeline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Loading timeline…");
    try {
      const params = new URLSearchParams();
      if (timelineForm.visitorId.trim()) params.set("visitorId", timelineForm.visitorId.trim());
      if (timelineForm.sessionId.trim()) params.set("sessionId", timelineForm.sessionId.trim());
      const res = await authenticatedFetch(`/api/admin/analytics/timeline?${params.toString()}`);
      if (!res.ok) throw new Error(`Timeline request failed: ${res.status}`);
      const p = (await res.json()) as { timeline?: AnalyticsTimelineEvent[] };
      setTimelineEvents(p.timeline || []);
      setMessage(`Loaded ${p.timeline?.length || 0} events.`);
    } catch (err) {
      setTimelineEvents([]);
      setMessage(err instanceof Error ? err.message : "Could not load timeline.");
    } finally {
      setIsBusy(false);
    }
  }

  async function exportTopReport() {
    setIsBusy(true);
    setMessage("Preparing export…");
    try {
      const res = await authenticatedFetch("/api/admin/analytics/export/top");
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const payload = (await res.json()) as AnalyticsExport;
      setAnalyticsExport(payload);
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `superpen-top-report-${payload.generatedAt.slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Export downloaded.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not export analytics.");
    } finally {
      setIsBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session/logout", { method: "POST", cache: "no-store" }).catch(() => undefined);
    setIsAuthenticated(false);
    setSiteData(null);
    setAnalyticsOverview(null);
    setAnalyticsExport(null);
    setTimelineEvents([]);
    setMessage("Logged out.");
    router.replace("/admin/login");
  }

  // ── Loading state ────────────────────────────────────────────────────────

  if (isCheckingSession) {
    return (
      <div className="sp-loading-root">
        <div className="sp-loading-dot" />
        <p>Checking session…</p>
        <style>{STYLES}</style>
      </div>
    );
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <>
        <style>{STYLES}</style>
        <LoginView
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          message={message}
          loginFailureDetails={loginFailureDetails}
          isBusy={isBusy}
          onSubmit={handleLogin}
        />
      </>
    );
  }

  // ── Page title + topbar actions ───────────────────────────────────────────

  const PAGE_TITLES: Record<NavSection, string> = {
    dashboard: "Dashboard",
    analytics: "Analytics",
    releases: "All releases",
    "new-release": "New release",
    timeline: "Timeline lookup",
    export: "Export data",
  };

  const topbarActions: React.ReactNode = (() => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <Btn onClick={loadDashboard} disabled={isBusy}>Refresh</Btn>
            <Btn variant="primary" onClick={() => setActiveSection("new-release")}>+ New release</Btn>
          </>
        );
      case "analytics":
        return <Btn onClick={exportTopReport} disabled={isBusy}>Export report</Btn>;
      case "releases":
        return <Btn variant="primary" onClick={() => setActiveSection("new-release")}>+ New release</Btn>;
      default:
        return null;
    }
  })();

  // ── Grouped nav ───────────────────────────────────────────────────────────

  const groups = [...new Set(NAV_ITEMS.map((n) => n.group))];

  // ── Page content ──────────────────────────────────────────────────────────

  const pageContent = (() => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardPage
            analyticsOverview={analyticsOverview}
            siteData={siteData}
            onNavigate={setActiveSection}
          />
        );
      case "analytics":
        return <AnalyticsPage analyticsOverview={analyticsOverview} analyticsExport={analyticsExport} />;
      case "releases":
        return (
          <ReleasesPage
            siteData={siteData}
            isBusy={isBusy}
            onEdit={(r) => { setForm(toFormState(r)); setActiveSection("new-release"); }}
            onMakeCurrent={makeCurrent}
            onRemove={removeRelease}
            onNew={() => setActiveSection("new-release")}
          />
        );
      case "new-release":
        return (
          <NewReleasePage
            form={form}
            setForm={setForm}
            onSubmit={submitRelease}
            isBusy={isBusy}
          />
        );
      case "timeline":
        return (
          <TimelinePage
            timelineForm={timelineForm}
            setTimelineForm={setTimelineForm}
            timelineEvents={timelineEvents}
            onSubmit={loadTimeline}
            isBusy={isBusy}
          />
        );
      case "export":
        return (
          <ExportPage
            analyticsExport={analyticsExport}
            onExport={exportTopReport}
            isBusy={isBusy}
          />
        );
    }
  })();

  return (
    <>
      <style>{STYLES}</style>
      <div className="sp-root">
        {/* Sidebar */}
        <aside className="sp-sidebar">
          <div className="sp-sidebar-brand">
            <span className="sp-sidebar-logo">SuperPen</span>
            <span className="sp-sidebar-logo-sub">Admin</span>
          </div>

          <nav className="sp-nav">
            {groups.map((group) => (
              <div key={group} className="sp-nav-group">
                <p className="sp-nav-group-label">{group}</p>
                {NAV_ITEMS.filter((n) => n.group === group).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`sp-nav-item${activeSection === item.id ? " sp-nav-item--active" : ""}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="sp-nav-dot" />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="sp-sidebar-footer">
            <div className="sp-sidebar-user">
              <div className="sp-avatar">A</div>
              <div className="sp-sidebar-user-info">
                <span className="sp-sidebar-username">admin</span>
                <span className="sp-sidebar-userrole">Administrator</span>
              </div>
            </div>
            <div className="sp-sidebar-footer-actions">
              <button type="button" className="sp-sidebar-link" onClick={logout}>Sign out</button>
              <Link href="/" className="sp-sidebar-link">Site →</Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="sp-main">
          <header className="sp-topbar">
            <div>
              <h1 className="sp-topbar-title">{PAGE_TITLES[activeSection]}</h1>
              {message && <p className="sp-topbar-status">{message}</p>}
            </div>
            <div className="sp-topbar-actions">{topbarActions}</div>
          </header>

          <div className="sp-main-body">{pageContent}</div>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
/* ---------- Reset & root ---------- */
.sp-root {
  display: flex;
  min-height: 100vh;
  background: var(--sp-page, #f5f4f1);
  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
  color: var(--sp-text, #1a1915);
}
@media (prefers-color-scheme: dark) {
  .sp-root { --sp-page: #0d0d0c; --sp-text: #edebe7; }
}

/* ---------- Sidebar ---------- */
.sp-sidebar {
  width: 212px;
  flex-shrink: 0;
  background: #161613;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}
.sp-sidebar-brand {
  padding: 24px 20px 20px;
  border-bottom: 0.5px solid rgba(255,255,255,0.07);
}
.sp-sidebar-logo {
  display: block;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #fff;
}
.sp-sidebar-logo-sub {
  display: block;
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  margin-top: 2px;
  letter-spacing: 0.04em;
}

/* ---------- Nav ---------- */
.sp-nav { padding: 12px 0; flex: 1; }
.sp-nav-group { margin-bottom: 4px; }
.sp-nav-group-label {
  padding: 8px 20px 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
}
.sp-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 12px 7px 20px;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  border-radius: 6px;
  margin: 1px 8px;
  width: calc(100% - 16px);
  transition: background 0.12s, color 0.12s;
}
.sp-nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
.sp-nav-item--active { background: rgba(255,255,255,0.1); color: #fff; }
.sp-nav-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  flex-shrink: 0;
  transition: background 0.12s;
}
.sp-nav-item--active .sp-nav-dot { background: #e8602a; }

/* ---------- Sidebar footer ---------- */
.sp-sidebar-footer {
  border-top: 0.5px solid rgba(255,255,255,0.07);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sp-sidebar-user { display: flex; align-items: center; gap: 10px; }
.sp-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: #e8602a;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: #fff; flex-shrink: 0;
}
.sp-sidebar-user-info { overflow: hidden; }
.sp-sidebar-username { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.8); }
.sp-sidebar-userrole { display: block; font-size: 10px; color: rgba(255,255,255,0.3); }
.sp-sidebar-footer-actions { display: flex; gap: 12px; }
.sp-sidebar-link {
  font-size: 12px; color: rgba(255,255,255,0.35);
  background: none; border: none; cursor: pointer; padding: 0;
  text-decoration: none; transition: color 0.12s;
}
.sp-sidebar-link:hover { color: rgba(255,255,255,0.7); }

/* ---------- Main area ---------- */
.sp-main {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
}
.sp-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 28px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}
@media (prefers-color-scheme: dark) {
  .sp-topbar { background: #1a1917; border-color: rgba(255,255,255,0.06); }
}
.sp-topbar-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--sp-text, #1a1915);
}
.sp-topbar-status {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}
.sp-topbar-actions { display: flex; gap: 8px; align-items: center; }
.sp-main-body { padding: 24px 28px; flex: 1; overflow-y: auto; }

/* ---------- Page content layout ---------- */
.sp-page-content { display: flex; flex-direction: column; gap: 16px; }
.sp-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}
.sp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 900px) { .sp-grid-2 { grid-template-columns: 1fr; } }
.sp-span2 { grid-column: 1 / -1; }
.sp-releases-list { display: flex; flex-direction: column; gap: 14px; }
.sp-device-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 4px; }
@media (max-width: 900px) { .sp-device-grid { grid-template-columns: 1fr; } }

/* ---------- Stat cards ---------- */
.sp-stat-card {
  background: #fff;
  border: 0.5px solid rgba(0,0,0,0.08);
  border-radius: 10px;
  padding: 14px 16px;
}
@media (prefers-color-scheme: dark) {
  .sp-stat-card { background: #1e1d1a; border-color: rgba(255,255,255,0.06); }
}
.sp-stat-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #999;
}
.sp-stat-value {
  display: block;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--sp-text, #1a1915);
  margin-top: 4px;
}
.sp-stat-value--accent { color: #e8602a; }
.sp-stat-sub { display: block; font-size: 11px; color: #999; margin-top: 4px; }

/* ---------- Panel ---------- */
.sp-panel {
  background: #fff;
  border: 0.5px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 18px 20px;
}
@media (prefers-color-scheme: dark) {
  .sp-panel { background: #1e1d1a; border-color: rgba(255,255,255,0.06); }
}
.sp-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.sp-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--sp-text, #1a1915);
  letter-spacing: -0.01em;
}
.sp-panel-action {
  font-size: 12px;
  color: #e8602a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.sp-sub-heading {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #999;
  margin-bottom: 10px;
}

/* ---------- Bar list ---------- */
.sp-barlist { display: flex; flex-direction: column; gap: 10px; }
.sp-barlist-row { display: flex; flex-direction: column; gap: 5px; }
.sp-barlist-meta { display: flex; justify-content: space-between; align-items: center; }
.sp-barlist-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--sp-text, #1a1915);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 75%;
}
.sp-barlist-count { font-size: 11px; color: #999; flex-shrink: 0; }
.sp-barlist-track {
  height: 5px;
  border-radius: 3px;
  background: rgba(0,0,0,0.06);
  overflow: hidden;
}
@media (prefers-color-scheme: dark) {
  .sp-barlist-track { background: rgba(255,255,255,0.07); }
}
.sp-barlist-fill {
  height: 100%;
  border-radius: 3px;
  background: #e8602a;
  opacity: 0.8;
}

/* ---------- Badges ---------- */
.sp-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: 4px;
  text-transform: lowercase;
  flex-shrink: 0;
}
.sp-badge--default { background: rgba(0,0,0,0.06); color: #666; }
.sp-badge--current { background: rgba(29,158,117,0.12); color: #0f6e56; }
.sp-badge--beta { background: rgba(232,96,42,0.1); color: #993c1d; }
.sp-badge--old { background: rgba(0,0,0,0.05); color: #888; }
.sp-badge--warning { background: rgba(245,158,11,0.12); color: #854f0b; }
.sp-badge--danger { background: rgba(220,38,38,0.1); color: #a32d2d; }
.sp-badge--success { background: rgba(29,158,117,0.12); color: #0f6e56; }
@media (prefers-color-scheme: dark) {
  .sp-badge--default { background: rgba(255,255,255,0.08); color: #aaa; }
  .sp-badge--old { background: rgba(255,255,255,0.06); color: #888; }
}

/* ---------- Alerts ---------- */
.sp-alerts { display: flex; flex-direction: column; gap: 8px; }
.sp-alert {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 0.5px solid transparent;
}
.sp-alert--danger { background: rgba(220,38,38,0.06); border-color: rgba(220,38,38,0.15); }
.sp-alert--warning { background: rgba(245,158,11,0.07); border-color: rgba(245,158,11,0.18); }
.sp-alert--success { background: rgba(29,158,117,0.07); border-color: rgba(29,158,117,0.18); }
.sp-alert-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}
.sp-alert--danger .sp-alert-dot { background: #b42318; }
.sp-alert--warning .sp-alert-dot { background: #854f0b; }
.sp-alert--success .sp-alert-dot { background: #1d9e75; }
.sp-alert-level {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sp-text, #1a1915);
  margin-bottom: 2px;
}
.sp-alert-msg { font-size: 12px; color: var(--sp-text, #1a1915); line-height: 1.5; margin: 0; }

/* ---------- Release rows (dashboard) ---------- */
.sp-release-list { display: flex; flex-direction: column; gap: 2px; }
.sp-release-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
}
.sp-release-row:last-child { border-bottom: none; }
.sp-release-info { flex: 1; overflow: hidden; }
.sp-release-version { display: block; font-size: 13px; font-weight: 500; color: var(--sp-text, #1a1915); }
.sp-release-meta { display: block; font-size: 11px; color: #999; margin-top: 1px; }

/* ---------- Release cards (releases page) ---------- */
.sp-release-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.sp-release-card-title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.sp-release-card-version { font-size: 15px; font-weight: 600; color: var(--sp-text, #1a1915); }
.sp-release-card-badges { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }
.sp-release-card-actions { display: flex; gap: 6px; flex-wrap: wrap; flex-shrink: 0; }
.sp-release-card-summary { font-size: 13px; color: #888; line-height: 1.6; margin-bottom: 10px; }
.sp-release-notes {
  font-size: 12px;
  color: #666;
  line-height: 1.7;
  padding-left: 16px;
  margin-bottom: 10px;
}
.sp-release-card-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 11px;
  color: #aaa;
  padding-top: 10px;
  border-top: 0.5px solid rgba(0,0,0,0.06);
}
.sp-release-checksum { font-family: monospace; }

/* ---------- Events ---------- */
.sp-events { display: flex; flex-direction: column; gap: 6px; }
.sp-events--full { max-height: none; }
.sp-event-row { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 0.5px solid rgba(0,0,0,0.06); }
.sp-event-row:last-child { border-bottom: none; }
.sp-event-info { flex: 1; overflow: hidden; }
.sp-event-path { display: block; font-size: 12px; font-weight: 500; color: var(--sp-text, #1a1915); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-event-time { display: block; font-size: 11px; color: #999; margin-top: 1px; }
.sp-event-meta { display: block; font-size: 11px; color: #bbb; margin-top: 1px; }

/* ---------- Tables ---------- */
.sp-table-wrap { overflow-x: auto; border-radius: 8px; border: 0.5px solid rgba(0,0,0,0.07); }
@media (prefers-color-scheme: dark) {
  .sp-table-wrap { border-color: rgba(255,255,255,0.06); }
}
.sp-table { min-width: 100%; border-collapse: collapse; font-size: 12px; }
.sp-table thead tr { background: rgba(0,0,0,0.025); }
@media (prefers-color-scheme: dark) {
  .sp-table thead tr { background: rgba(255,255,255,0.03); }
}
.sp-table th {
  padding: 9px 14px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #999;
  text-align: left;
  white-space: nowrap;
}
.sp-table td {
  padding: 9px 14px;
  color: #888;
  border-top: 0.5px solid rgba(0,0,0,0.06);
  white-space: nowrap;
}
@media (prefers-color-scheme: dark) {
  .sp-table td { border-color: rgba(255,255,255,0.05); color: #888; }
}
.sp-td-strong { color: var(--sp-text, #1a1915) !important; font-weight: 500; }
.sp-td-mono { font-family: monospace; font-size: 11px; }
.sp-perf-rate { padding: 2px 6px; border-radius: 4px; font-size: 11px; }
.sp-perf-rate--bad { background: rgba(220,38,38,0.1); color: #a32d2d; }
.sp-perf-rate--warn { background: rgba(245,158,11,0.1); color: #854f0b; }

/* ---------- Buttons ---------- */
.sp-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 7px;
  cursor: pointer;
  border: 0.5px solid rgba(0,0,0,0.12);
  background: #fff;
  color: var(--sp-text, #1a1915);
  transition: background 0.12s, transform 0.1s;
  text-decoration: none;
  white-space: nowrap;
  letter-spacing: -0.01em;
}
@media (prefers-color-scheme: dark) {
  .sp-btn { background: #2a2926; border-color: rgba(255,255,255,0.08); color: #ddd; }
}
.sp-btn:hover { background: #f5f5f3; transform: translateY(-1px); }
.sp-btn:active { transform: translateY(0); }
.sp-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.sp-btn--primary { background: #e8602a; border-color: #e8602a; color: #fff; }
.sp-btn--primary:hover { background: #d4551e; }
.sp-btn--ghost { border: none; background: transparent; }
.sp-btn--ghost:hover { background: rgba(0,0,0,0.05); }
.sp-btn--danger { border-color: rgba(180,35,24,0.25); color: #b42318; }
.sp-btn--danger:hover { background: rgba(220,38,38,0.06); }

/* ---------- Forms ---------- */
.sp-form { display: flex; flex-direction: column; gap: 16px; }
.sp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 600px) { .sp-form-grid { grid-template-columns: 1fr; } }
.sp-field { display: flex; flex-direction: column; gap: 6px; }
.sp-field--span2 { grid-column: 1 / -1; }
.sp-field-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #999;
}
.sp-input {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 0.5px solid rgba(0,0,0,0.12);
  background: #fff;
  color: var(--sp-text, #1a1915);
  font-size: 13px;
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
  width: 100%;
}
.sp-input:focus { border-color: rgba(232,96,42,0.45); box-shadow: 0 0 0 3px rgba(232,96,42,0.1); }
@media (prefers-color-scheme: dark) {
  .sp-input { background: #2a2926; border-color: rgba(255,255,255,0.08); color: #ddd; }
}
.sp-textarea {
  padding: 10px 12px;
  border-radius: 8px;
  border: 0.5px solid rgba(0,0,0,0.12);
  background: #fff;
  color: var(--sp-text, #1a1915);
  font-size: 13px;
  outline: none;
  resize: vertical;
  transition: border-color 0.12s, box-shadow 0.12s;
  width: 100%;
  font-family: inherit;
}
.sp-textarea:focus { border-color: rgba(232,96,42,0.45); box-shadow: 0 0 0 3px rgba(232,96,42,0.1); }
@media (prefers-color-scheme: dark) {
  .sp-textarea { background: #2a2926; border-color: rgba(255,255,255,0.08); color: #ddd; }
}
.sp-checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--sp-text, #1a1915);
  cursor: pointer;
  padding: 10px 14px;
  background: rgba(0,0,0,0.03);
  border-radius: 8px;
  border: 0.5px solid rgba(0,0,0,0.08);
}
.sp-checkbox { accent-color: #e8602a; width: 14px; height: 14px; }
.sp-form-actions { display: flex; gap: 8px; padding-top: 4px; }

/* ---------- Timeline form ---------- */
.sp-timeline-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 14px;
  align-items: end;
}
@media (max-width: 600px) {
  .sp-timeline-form { grid-template-columns: 1fr; }
}
.sp-timeline-submit { padding-top: 0; }

/* ---------- Export page ---------- */
.sp-export-desc {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 16px;
}

/* ---------- Empty states ---------- */
.sp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  color: #aaa;
  font-size: 14px;
}
.sp-empty-inline { font-size: 12px; color: #aaa; padding: 8px 0; }

/* ---------- Login ---------- */
.sp-login-root {
  min-height: 100vh;
  background: #f5f4f1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
@media (prefers-color-scheme: dark) {
  .sp-login-root { background: #0d0d0c; }
}
.sp-login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border: 0.5px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (prefers-color-scheme: dark) {
  .sp-login-card { background: #1a1917; border-color: rgba(255,255,255,0.07); }
}
.sp-login-brand { margin-bottom: 4px; }
.sp-login-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--sp-text, #1a1915);
  margin: 0;
}
.sp-login-subtitle { font-size: 13px; color: #999; margin-top: 4px; }
.sp-login-message {
  padding: 10px 14px;
  background: rgba(232,96,42,0.08);
  border: 0.5px solid rgba(232,96,42,0.18);
  border-radius: 8px;
  font-size: 13px;
  color: var(--sp-text, #1a1915);
}
.sp-login-form { display: flex; flex-direction: column; gap: 14px; }
.sp-login-footer { text-align: center; }
.sp-login-footer a { font-size: 12px; color: #aaa; text-decoration: none; }
.sp-login-footer a:hover { color: #666; }

/* ---------- Diagnostics ---------- */
.sp-diagnostics {
  background: rgba(0,0,0,0.03);
  border: 0.5px solid rgba(0,0,0,0.08);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sp-diagnostics-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #999; }
.sp-diagnostics-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sp-diagnostics-row span:first-child { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #aaa; }
.sp-diagnostics-row span:last-child, .sp-diagnostics-row code { font-size: 12px; color: var(--sp-text, #1a1915); word-break: break-all; }
.sp-diagnostics-row code { font-family: monospace; font-size: 11px; }

/* ---------- Loading ---------- */
.sp-loading-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #aaa;
  font-size: 14px;
}
.sp-loading-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #e8602a;
  animation: sp-pulse 1.2s ease-in-out infinite;
}
@keyframes sp-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1); }
}
`;