import { NextResponse, type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/superpen-api";
import { getServiceToken } from "@/lib/superpen-api-server";

function text(value: string | null) {
  return value?.trim() || "";
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const releaseVersion = text(url.searchParams.get("release"));
  const downloadUrl = text(url.searchParams.get("url"));
  const visitorId = text(url.searchParams.get("visitorId")) || text(request.cookies.get("superpen-visitor-id")?.value || null);
  const sessionId = text(url.searchParams.get("sessionId")) || text(request.cookies.get("superpen-session-id")?.value || null);
  const label = text(url.searchParams.get("label")) || `Download ${releaseVersion || "unknown release"}`;
  const targetId = text(url.searchParams.get("target")) || `download-${releaseVersion || "unknown"}`;
  const sourcePath = text(url.searchParams.get("path")) || "/";

  if (!downloadUrl) {
    return NextResponse.json({ error: "Missing download URL" }, { status: 400 });
  }

  const token = await getServiceToken();
  if (token) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": request.headers.get("user-agent") || "superpen-download-proxy",
      "x-country": request.headers.get("x-country") || request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "",
      "x-region": request.headers.get("x-region") || request.headers.get("x-vercel-ip-country-region") || "",
      "x-city": request.headers.get("x-city") || request.headers.get("x-vercel-ip-city") || "",
      "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
    };

    const basePayload = {
      visitorId: visitorId || undefined,
      sessionId: sessionId || undefined,
      path: sourcePath,
      label,
      targetId,
      releaseVersion: releaseVersion || undefined,
      referrer: request.headers.get("referer") || undefined,
    };

    await fetch(`${getApiBaseUrl()}/api/analytics/track`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        eventType: "download_started",
        ...basePayload,
      }),
      cache: "no-store",
    }).catch(() => undefined);

    await fetch(`${getApiBaseUrl()}/api/analytics/track`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        eventType: "download_completed",
        ...basePayload,
        metadata: {
          completionSource: "download_redirect",
        },
      }),
      cache: "no-store",
    }).catch(() => undefined);
  }

  return NextResponse.redirect(downloadUrl, { status: 307 });
}
