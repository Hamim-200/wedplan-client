import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { VendorBookings } from "@/components/vendor/VendorBookings";

export const metadata: Metadata = { title: "Booking Requests" };

export default function VendorBookingsPage() {
  return (
    <>
      <PageHeader
        title="Booking Requests"
        text="Review requests from customers. Only pending requests can be accepted or rejected."
      />
      <VendorBookings />
    </>
  );
}