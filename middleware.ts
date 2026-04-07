import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth-shared";
import { verifyAdminJwt } from "@/lib/admin-jwt";

function clearSession(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

function isAdminSessionRoute(pathname: string) {
  return pathname.startsWith("/api/admin/session");
}

function isAdminPage(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminLoginPage(pathname: string) {
  return pathname === "/admin/login";
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isAdminPage(pathname) && !pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  if (isAdminSessionRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isValidToken = await verifyAdminJwt(token);

  if (pathname.startsWith("/api/admin/")) {
    if (isValidToken) {
      return NextResponse.next();
    }

    return clearSession(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  if (isAdminLoginPage(pathname)) {
    if (isValidToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return clearSession(NextResponse.next());
  }

  if (isValidToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return clearSession(NextResponse.redirect(loginUrl));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
