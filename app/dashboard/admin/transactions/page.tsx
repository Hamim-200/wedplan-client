import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Transactions } from "@/components/admin/Transactions";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        text="Subscription payments from vendors. These records are read-only."
      />
      <Transactions />
    </>
  );
}