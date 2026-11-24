import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { getDashboardPath, needsOnboarding } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Dashboard" };

export default async function TemporaryDashboard({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!["admin", "vendor", "customer"].includes(role)) notFound();

  const user = await requireUser(`/dashboard/${role}`);
  if (needsOnboarding(user)) redirect("/onboarding");

  // Someone opening another role's dashboard is sent to their own.
  if (user.role !== role) redirect(getDashboardPath(user.role));

  return (
    <Container className="py-24 text-center">
      <h1 className="text-4xl font-semibold capitalize text-primary">{role} dashboard</h1>
      <p className="mt-4 text-muted-foreground">
        Signed in as {user.name} ({user.email}). The real dashboard arrives in Phase 11.
      </p>
    </Container>
  );
}