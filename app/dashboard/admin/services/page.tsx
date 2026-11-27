import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ManageServices } from "@/components/admin/ManageServices";

export const metadata: Metadata = { title: "Manage Services" };

export default function ManageServicesPage() {
  return (
    <>
      <PageHeader
        title="Manage Services"
        text="Review pending services, approve or reject them, and remove inappropriate ones."
      />
      <ManageServices />
    </>
  );
}