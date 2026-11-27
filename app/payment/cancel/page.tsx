import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default async function PaymentCancelPage() {
    await requireRole("vendor", "/payment/cancel");

    return (
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
            <XCircle className="size-14 text-muted-foreground" />
            <h1 className="mt-5 text-4xl font-semibold">Payment cancelled</h1>
            <p className="mt-2 max-w-md text-muted-foreground">
                You left the payment page, so nothing was charged and your plan has not changed.
                You can upgrade whenever you are ready.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/dashboard/vendor/subscription" className={buttonVariants()}>
                    Back to Subscription
                </Link>
                <Link href="/dashboard/vendor" className={buttonVariants({ variant: "outline" })}>
                    Go to Dashboard
                </Link>
            </div>
        </Container>
    );
}