import { type NextRequest } from "next/server";
import { proxyAdminRequest } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  return proxyAdminRequest(`/api/admin/analytics/timeline${query ? `?${query}` : ""}`);
}
