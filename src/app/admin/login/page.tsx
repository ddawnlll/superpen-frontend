import type { Metadata } from "next";
import AdminPanel from "../../AdminPanel";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the SuperPen admin panel.",
};

export default function AdminLoginPage() {
  return <AdminPanel />;
}
