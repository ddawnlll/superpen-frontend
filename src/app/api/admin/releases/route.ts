import { type NextRequest } from "next/server";
import { proxyAdminRequest } from "@/lib/admin-api";

export async function GET() {
  return proxyAdminRequest("/api/admin/releases");
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyAdminRequest("/api/admin/releases", {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
    },
    body,
  });
}
