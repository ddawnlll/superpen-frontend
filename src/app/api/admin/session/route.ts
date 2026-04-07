import { NextResponse } from "next/server";
import { getAdminSessionToken } from "@/lib/admin-session";

export async function GET() {
  const token = await getAdminSessionToken();
  return NextResponse.json({ authenticated: Boolean(token) });
}
