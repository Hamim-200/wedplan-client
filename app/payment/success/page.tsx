import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment Success" };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  await requireRole("vendor", "/payment/success");
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : null;

  return <PaymentSuccess sessionId={sessionId} />;
}