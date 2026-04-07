import type { Metadata } from "next";
import AdminPanel from "../../AdminPanel";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the SuperPen admin panel.",
};

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const nextParam = searchParams.next;
  const loginNextPath = typeof nextParam === "string" && nextParam ? nextParam : "/admin";

  return <AdminPanel loginNextPath={loginNextPath} />;
}
