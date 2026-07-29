import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminUser } from "@/lib/supabase/auth-server";

/**
 * Admin routes are gated here as well as in middleware. Middleware handles the
 * redirect cheaply; this second check means a rendering path that somehow
 * skipped it still cannot leak data.
 *
 * The login page provides its own layout, so it opts out via the pathname
 * check in middleware rather than nesting inside this shell.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
