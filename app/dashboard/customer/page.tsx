import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CustomerOverview } from "@/components/customer/CustomerOverview";

export const metadata: Metadata = { title: "Customer Overview" };

export default function CustomerOverviewPage() {
  return (
    <>
      <PageHeader title="Overview" text="A quick look at your booking requests." />
      <CustomerOverview />
    </>
  );
}