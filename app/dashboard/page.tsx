import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDashboardPath, needsOnboarding } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardIndexPage() {
  const user = await requireUser("/dashboard");
  if (needsOnboarding(user)) redirect("/onboarding");
  redirect(getDashboardPath(user.role));
}