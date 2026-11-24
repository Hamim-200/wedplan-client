import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { SignOutButton } from "@/components/auth/SignOutButton";

export const metadata: Metadata = { title: "Account Blocked" };

export default function BlockedPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-semibold">Your account is blocked</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        An administrator has blocked this account, so you can&apos;t use WedPlan right now.
        Please contact support@wedplan.com if you think this is a mistake.
      </p>
      <div className="mt-8">
        <SignOutButton />
      </div>
    </Container>
  );
}