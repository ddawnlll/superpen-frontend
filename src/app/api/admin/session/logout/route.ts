import { NextResponse } from "next/server";
import { clearAdminSessionToken } from "@/lib/admin-session";

export async function POST() {
  await clearAdminSessionToken();
  return NextResponse.json({ ok: true });
}
