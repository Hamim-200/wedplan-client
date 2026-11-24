import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { needsOnboarding } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Choose Your Account Type" };

export default async function OnboardingPage() {
  const user = await requireUser("/onboarding");
  if (!needsOnboarding(user)) redirect("/dashboard");

  return (
    <AuthShell title="One last step" subtitle="How will you use WedPlan? You can't change this later.">
      <OnboardingForm />
    </AuthShell>
  );
}