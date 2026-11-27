import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole("admin", "/dashboard/admin");
  return <DashboardShell role="admin">{children}</DashboardShell>;
}