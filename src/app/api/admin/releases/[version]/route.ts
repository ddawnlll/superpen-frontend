import { proxyAdminRequest } from "@/lib/admin-api";

export async function DELETE(_: Request, context: { params: Promise<{ version: string }> }) {
  const { version } = await context.params;
  return proxyAdminRequest(`/api/admin/releases/${encodeURIComponent(version)}`, {
    method: "DELETE",
  });
}
