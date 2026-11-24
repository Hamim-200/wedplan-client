import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { getServerSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  const session = await getServerSession();
  if (session) redirect("/dashboard");

  return (
    <AuthShell title="Create your account" subtitle="Join WedPlan and start planning today">
      <SignUpForm />
    </AuthShell>
  );
}