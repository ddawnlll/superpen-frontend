"use client";

import { useEffect } from "react";

const VISITOR_KEY = "superpen-visitor-id";
const SESSION_KEY = "superpen-session-id";
const SESSION_STARTED_KEY = "superpen-session-started-at";
const HEARTBEAT_MS = 15000;

type TrackedElement = HTMLElement & {
  dataset: DOMStringMap & {
    analyticsEvent?: string;
    analyticsLabel?: string;
    analyticsTarget?: string;
    analyticsRelease?: string;
  };
};

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function getVisitorId() {
  let visitorId = window.localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = generateId("visitor");
    window.localStorage.setItem(VISITOR_KEY, visitorId);
  }
  return visitorId;
}

function getSessionId() {
  let sessionId = window.sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateId("session");
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
    window.sessionStorage.setItem(SESSION_STARTED_KEY, String(Date.now()));
  }
  return sessionId;
}

function syncTrackingCookies() {
  document.cookie = `${VISITOR_KEY}=${encodeURIComponent(getVisitorId())}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  document.cookie = `${SESSION_KEY}=${encodeURIComponent(getSessionId())}; path=/; samesite=lax`;
}

function getElapsedSeconds() {
  const startedAt = Number(window.sessionStorage.getItem(SESSION_STARTED_KEY) || Date.now());
  return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
}

function track(payload: Record<string, unknown>, useBeacon = false) {
  const body = JSON.stringify({
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    path: window.location.pathname,
    pageTitle: document.title,
    referrer: document.referrer || undefined,
    occurredAt: new Date().toISOString(),
    ...payload,
  });

  if (useBeacon && typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon("/api/analytics/track", body);
    return;
  }

  void fetch("/api/analytics/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: useBeacon,
  }).catch(() => undefined);
}

export default function AnalyticsTracker() {
  useEffect(() => {
    let heartbeat: number | undefined;

    const onPageHide = () => {
      track(
        {
          eventType: "session_end",
          elapsedSeconds: getElapsedSeconds(),
        },
        true,
      );
    };

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("[data-analytics-event]") as TrackedElement | null;
      if (!target) {
        return;
      }

      const label = target.dataset.analyticsLabel || target.textContent?.trim() || undefined;
      const targetId = target.dataset.analyticsTarget || undefined;
      const releaseVersion = target.dataset.analyticsRelease || undefined;
      const eventType = target.dataset.analyticsEvent || "click";

      if (eventType !== "click") {
        track({
          eventType: "click",
          label,
          targetId,
          releaseVersion,
          metadata: {
            sourceEvent: eventType,
          },
        });
      }

      track({
        eventType,
        label,
        targetId,
        releaseVersion,
      });
    };

    const startTracking = () => {
      getVisitorId();
      getSessionId();
      syncTrackingCookies();

      track({
        eventType: "page_view",
        metadata: {
          url: window.location.href,
        },
      });

      heartbeat = window.setInterval(() => {
        track({
          eventType: "session_heartbeat",
          elapsedSeconds: getElapsedSeconds(),
        });
      }, HEARTBEAT_MS);

      window.addEventListener("click", onClick, true);
      window.addEventListener("pagehide", onPageHide);
      window.addEventListener("beforeunload", onPageHide);
    };

    const startupTimer = window.setTimeout(startTracking, 1200);

    return () => {
      if (heartbeat) {
        window.clearInterval(heartbeat);
      }

      if (startupTimer) {
        window.clearTimeout(startupTimer);
      }

      window.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onPageHide);
    };
  }, []);

  return null;
}
