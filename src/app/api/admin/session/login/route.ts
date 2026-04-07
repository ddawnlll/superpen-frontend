import { NextResponse, type NextRequest } from "next/server";
import { setAdminSessionToken } from "@/lib/admin-session";
import { getApiBaseUrl, loginWithCredentials } from "@/lib/superpen-api";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null;
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");

  if (!username || !password) {
    return NextResponse.json({ error: "username and password are required" }, { status: 400 });
  }

  try {
    const login = await loginWithCredentials(username, password, getApiBaseUrl());
    await setAdminSessionToken(login.token, login.expiresInMinutes);

    return NextResponse.json({
      user: login.user,
      expiresInMinutes: login.expiresInMinutes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
