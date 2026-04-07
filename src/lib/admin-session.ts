import "server-only";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth-shared";

function isSecureCookie() {
  return process.env.NODE_ENV === "production";
}

export async function getAdminSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_SESSION_COOKIE)?.value || null;
}

export async function setAdminSessionToken(token: string, expiresInMinutes: number) {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: Math.max(60, expiresInMinutes * 60),
  });
}

export async function clearAdminSessionToken() {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: 0,
  });
}
