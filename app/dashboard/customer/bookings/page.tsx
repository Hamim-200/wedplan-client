import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MyBookings } from "@/components/customer/MyBookings";

export const metadata: Metadata = { title: "My Bookings" };

export default function MyBookingsPage() {
  return (
    <>
      <PageHeader
        title="My Bookings"
        text="Track your booking requests. You can cancel a request while it is pending."
      />
      <MyBookings />
    </>
  );
}