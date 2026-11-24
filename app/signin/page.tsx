import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { safeCallbackUrl } from "@/lib/roles";
import { getServerSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const session = await getServerSession();
  if (session) redirect("/dashboard");

  const { callbackUrl } = await searchParams;

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue planning your wedding">
      <SignInForm callbackUrl={safeCallbackUrl(callbackUrl)} />
    </AuthShell>
  );
}