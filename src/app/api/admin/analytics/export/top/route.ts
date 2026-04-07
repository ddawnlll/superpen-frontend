import { proxyAdminRequest } from "@/lib/admin-api";

export async function GET() {
  return proxyAdminRequest("/api/admin/analytics/export/top");
}
