import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SubscriptionPanel } from "@/components/vendor/SubscriptionPanel";

export const metadata: Metadata = { title: "Subscription" };

export default function SubscriptionPage() {
  return (
    <>
      <PageHeader
        title="Subscription"
        text="Choose the plan that fits your business. Upgrade any time."
      />
      <SubscriptionPanel />
    </>
  );
}