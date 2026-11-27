import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/session";

export default async function VendorLayout({ children }: { children: ReactNode }) {
  await requireRole("vendor", "/dashboard/vendor");
  return <DashboardShell role="vendor">{children}</DashboardShell>;
}