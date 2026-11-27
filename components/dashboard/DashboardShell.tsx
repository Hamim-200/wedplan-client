import type { ReactNode } from "react";
import { Container } from "@/components/shared/Container";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { UserRole } from "@/lib/roles";

export function DashboardShell({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  return (
    <Container className="py-6 sm:py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar role={role} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}