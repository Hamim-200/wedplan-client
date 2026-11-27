import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ManageUsers } from "@/components/admin/ManageUsers";

export const metadata: Metadata = { title: "Manage Users" };

export default function ManageUsersPage() {
  return (
    <>
      <PageHeader
        title="Manage Users"
        text="Search users, view their details, and block or unblock accounts."
      />
      <ManageUsers />
    </>
  );
}