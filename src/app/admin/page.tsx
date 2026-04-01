import type { Metadata } from "next";
import AdminPanel from "../AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage SuperPen release versions and download links.",
};

export default function AdminPage() {
  return <AdminPanel />;
}
