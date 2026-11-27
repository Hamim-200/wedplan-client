import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AddServiceForm } from "@/components/vendor/AddServiceForm";

export const metadata: Metadata = { title: "Add Service" };

export default function AddServicePage() {
  return (
    <>
      <PageHeader
        title="Add Service"
        text="New services are reviewed by an admin before customers can see them."
      />
      <AddServiceForm />
    </>
  );
}