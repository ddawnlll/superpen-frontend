import { NextResponse, type NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/superpen-api";
import { getServiceToken } from "@/lib/superpen-api-server";

type TrackPayload = {
  eventType?: string;
  visitorId?: string;
  sessionId?: string;
  path?: string;
  pageTitle?: string;
  referrer?: string;
  label?: string;
  targetId?: string;
  releaseVersion?: string;
  elapsedSeconds?: number;
  metadata?: Record<string, unknown>;
  geo?: {
    country?: string;
    region?: string;
    city?: string;
  };
  device?: {
    browser?: string;
    os?: string;
    type?: string;
  };
  occurredAt?: string;
};

async function parsePayload(request: NextRequest): Promise<TrackPayload | null> {
  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      return (await request.json()) as TrackPayload;
    }

    const rawText = await request.text();
    if (!rawText.trim()) {
      return null;
    }

    return JSON.parse(rawText) as TrackPayload;
  } catch {
    return null;
  }
}

function mergeGeo(request: NextRequest, payload: TrackPayload): TrackPayload {
  return {
    ...payload,
    geo: {
      country:
        payload.geo?.country ||
        request.headers.get("x-country") ||
        request.headers.get("x-vercel-ip-country") ||
        request.headers.get("cf-ipcountry") ||
        undefined,
      region:
        payload.geo?.region ||
        request.headers.get("x-region") ||
        request.headers.get("x-vercel-ip-country-region") ||
        undefined,
      city:
        payload.geo?.city ||
        request.headers.get("x-city") ||
        request.headers.get("x-vercel-ip-city") ||
        undefined,
    },
  };
}

export async function POST(request: NextRequest) {
  const payload = await parsePayload(request);
  if (!payload?.eventType) {
    return NextResponse.json({ error: "eventType is required" }, { status: 400 });
  }

  const token = await getServiceToken();
  if (!token) {
    console.error("[analytics] Missing service token. Check SUPERPEN_API_USERNAME, SUPERPEN_API_PASSWORD, and SUPERPEN_API_BASE_URL.");
    return NextResponse.json({ error: "Analytics service credentials are missing" }, { status: 503 });
  }

  const response = await fetch(`${getApiBaseUrl()}/api/analytics/track`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": request.headers.get("user-agent") || "superpen-frontend-proxy",
      "x-country": request.headers.get("x-country") || request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "",
      "x-region": request.headers.get("x-region") || request.headers.get("x-vercel-ip-country-region") || "",
      "x-city": request.headers.get("x-city") || request.headers.get("x-vercel-ip-city") || "",
      "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
    },
    body: JSON.stringify(mergeGeo(request, payload)),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("[analytics] Backend analytics request failed", {
      status: response.status,
      errorText,
      apiBaseUrl: getApiBaseUrl(),
      eventType: payload.eventType,
    });
    return NextResponse.json(
      { error: errorText || `Analytics request failed (${response.status})` },
      { status: response.status },
    );
  }

  return new NextResponse(null, { status: 204 });
}
