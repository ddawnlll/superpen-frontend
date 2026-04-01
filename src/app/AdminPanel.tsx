"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getApiBaseUrl,
  loginWithCredentials,
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

export default function AdminPanel() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [authToken, setAuthToken] = useState("");
  const [loginForm, setLoginForm] = useState<LoginFormState>(EMPTY_LOGIN);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [form, setForm] = useState<ReleaseFormState>(EMPTY_FORM);
  const [message, setMessage] = useState("Log in to manage releases.");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      void loadReleases();
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
    });

    if (response.status === 401) {
      window.localStorage.removeItem("superpen-admin-jwt");
      setAuthToken("");
      throw new Error("Session expired. Please log in again.");
    }

    return response;
  }

  async function loadReleases() {
    setIsBusy(true);
    setMessage("Loading release data...");
    try {
      const response = await authenticatedFetch("/api/admin/releases");
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = (await response.json()) as SiteData;
      setSiteData(data);
      setMessage("Release data loaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load release data.");
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
        const errorText = await response.text();
        throw new Error(errorText || `Request failed: ${response.status}`);
      }

      const data = (await response.json()) as SiteData;
      setSiteData(data);
      setMessage(`Saved release ${form.version}.`);
      setForm(EMPTY_FORM);
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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete release.");
    } finally {
      setIsBusy(false);
    }
  }

  function logout() {
    window.localStorage.removeItem("superpen-admin-jwt");
    setAuthToken("");
    setSiteData(null);
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
              <p className="admin-copy">Log in with your admin account to manage versions and downloads.</p>
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
            <p className="admin-eyebrow">Release management</p>
            <h1>SuperPen admin</h1>
            <p className="admin-copy">
              Manage current versions, download links, and release notes from one place.
            </p>
          </div>
          <div className="admin-top-actions">
            <button type="button" className="secondary-button" onClick={loadReleases} disabled={isBusy}>
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

        <div className="admin-grid">
          <section className="admin-card">
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

          <section className="admin-card">
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
        </div>
      </section>
    </main>
  );
}
