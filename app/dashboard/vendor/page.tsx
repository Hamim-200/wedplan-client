import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { VendorOverview } from "@/components/vendor/VendorOverview";

export const metadata: Metadata = { title: "Vendor Overview" };

export default function VendorOverviewPage() {
  return (
    <>
      <PageHeader title="Overview" text="A quick look at your services and bookings." />
      <VendorOverview />
    </>
  );
}