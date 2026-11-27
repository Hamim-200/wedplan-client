import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminOverview } from "@/components/admin/AdminOverview";

export const metadata: Metadata = { title: "Admin Overview" };

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader title="Overview" text="A summary of the whole platform." />
      <AdminOverview />
    </>
  );
}