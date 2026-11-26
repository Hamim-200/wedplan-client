import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/session";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  await requireRole("customer", "/dashboard/customer");
  return <DashboardShell role="customer">{children}</DashboardShell>;
}