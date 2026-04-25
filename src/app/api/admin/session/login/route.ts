import { NextResponse, type NextRequest } from "next/server";
import { setAdminSessionToken } from "@/lib/admin-session";
import { getApiBaseUrl, type LoginResponse } from "@/lib/superpen-api";

type LoginFailureDetails = {
  reason:
    | "missing_credentials"
    | "network_error"
    | "invalid_json"
    | "invalid_credentials"
    | "backend_error";
  apiBaseUrl: string;
  backendUrl: string;
  status?: number;
  backendError?: string;
  rawError?: string;
  suggestion?: string;
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null;
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");
  const apiBaseUrl = getApiBaseUrl();
  const backendUrl = `${apiBaseUrl}/auth/login`;

  if (!username || !password) {
    return NextResponse.json(
      {
        error: "username and password are required",
        details: {
          reason: "missing_credentials",
          apiBaseUrl,
          backendUrl,
          suggestion: "Enter both the admin username and password.",
        } satisfies LoginFailureDetails,
      },
      { status: 400 },
    );
  }

  let response: Response;
  try {
    response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
  } catch (error) {
    const rawError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json(
      {
        error: "Could not reach the release server.",
        details: {
          reason: "network_error",
          apiBaseUrl,
          backendUrl,
          rawError,
          suggestion:
            "Check that the release server is running, the frontend is pointing to the correct local URL, and you are using http:// for local development unless you explicitly configured HTTPS.",
        } satisfies LoginFailureDetails,
      },
      { status: 502 },
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let payload: LoginResponse | { error?: string } | null = null;
  let rawText = "";

  if (contentType.includes("application/json")) {
    payload = (await response.json().catch(() => null)) as LoginResponse | { error?: string } | null;
  } else {
    rawText = await response.text().catch(() => "");
  }

  if (!response.ok) {
    const backendError = (payload as { error?: string } | null)?.error || rawText || `Login failed (${response.status})`;
    const reason = response.status === 401 ? "invalid_credentials" : "backend_error";
    const suggestion =
      response.status === 401
        ? "The release server rejected the username or password. Verify the admin credentials configured in the backend."
        : "The release server responded, but it did not accept the login request. Check backend logs and environment variables.";

    return NextResponse.json(
      {
        error: backendError,
        details: {
          reason,
          apiBaseUrl,
          backendUrl,
          status: response.status,
          backendError,
          suggestion,
        } satisfies LoginFailureDetails,
      },
      { status: response.status },
    );
  }

  if (!payload || !("token" in payload) || !payload.token) {
    return NextResponse.json(
      {
        error: "The release server returned an unexpected login response.",
        details: {
          reason: "invalid_json",
          apiBaseUrl,
          backendUrl,
          status: response.status,
          suggestion: "Check that the backend /auth/login route returns valid JSON with a token.",
        } satisfies LoginFailureDetails,
      },
      { status: 502 },
    );
  }

  await setAdminSessionToken(payload.token, payload.expiresInMinutes);

  return NextResponse.json({
    user: payload.user,
    expiresInMinutes: payload.expiresInMinutes,
  });
}
