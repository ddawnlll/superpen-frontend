import type { Release } from "@/lib/superpen-api";

export function buildTrackedDownloadUrl(release: Release | null, label: string, target: string, path = "/") {
  if (!release?.downloadUrl) {
    return "#";
  }

  const params = new URLSearchParams({
    release: release.version,
    url: release.downloadUrl,
    label,
    target,
    path,
  });

  return `/api/releases/download?${params.toString()}`;
}
