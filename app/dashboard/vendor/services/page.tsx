import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MyServices } from "@/components/vendor/MyServices";

export const metadata: Metadata = { title: "My Services" };

export default function MyServicesPage() {
  return (
    <>
      <PageHeader
        title="My Services"
        text="Manage your services, availability and approval status."
        action={
          <Link href="/dashboard/vendor/add-service" className={buttonVariants()}>
            <Plus className="size-4" />
            Add Service
          </Link>
        }
      />
      <MyServices />
    </>
  );
}