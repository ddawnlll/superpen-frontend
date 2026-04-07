import "server-only";

import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/superpen-api";
import { getAdminSessionToken } from "@/lib/admin-session";

function buildBackendUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

async function buildProxyHeaders(initHeaders?: HeadersInit): Promise<Headers> {
  const token = await getAdminSessionToken();
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const headers = new Headers(initHeaders);
  headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

export async function proxyAdminRequest(path: string, init?: RequestInit) {
  try {
    const headers = await buildProxyHeaders(init?.headers);
    const response = await fetch(buildBackendUrl(path), {
      ...init,
      headers,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Admin API proxy failed" }, { status: 502 });
  }
}
