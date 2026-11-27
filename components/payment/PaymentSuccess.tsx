"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { CheckoutResultResponse } from "@/lib/types";

type Outcome =
    | { key: string; kind: "paid"; amount: number; currency: string }
    | { key: string; kind: "pending" }
    | { key: string; kind: "failed" }
    | { key: string; kind: "error"; message: string };

const MAX_CHECKS = 8;
const WAIT_MS = 2000;

export function PaymentSuccess({ sessionId }: { sessionId: string | null }) {
    const [attempt, setAttempt] = useState(0);
    const [outcome, setOutcome] = useState<Outcome | null>(null);

    const key = `${sessionId}#${attempt}`;
    const checking = sessionId !== null && outcome?.key !== key;

    useEffect(() => {
        if (!sessionId) return;
        let cancelled = false;

        async function run() {
            for (let i = 0; i < MAX_CHECKS; i++) {
                try {
                    const result = await apiFetch<CheckoutResultResponse>(
                        `/api/payments/session/${sessionId}`,
                        { auth: true }
                    );
                    if (cancelled) return;

                    const { status, amount, currency } = result.transaction;
                    if (status === "paid") {
                        setOutcome({ key, kind: "paid", amount, currency });
                        return;
                    }
                    if (status === "failed" || status === "cancelled") {
                        setOutcome({ key, kind: "failed" });
                        return;
                    }
                } catch (err) {
                    if (cancelled) return;
                    setOutcome({
                        key,
                        kind: "error",
                        message: err instanceof Error ? err.message : "Could not check your payment",
                    });
                    return;
                }

                // Still pending: the webhook may need a moment.
                await new Promise((resolve) => setTimeout(resolve, WAIT_MS));
                if (cancelled) return;
            }
            setOutcome({ key, kind: "pending" });
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [sessionId, key]);

    let content: React.ReactNode;

    if (!sessionId) {
        content = (
            <Message
                Icon={AlertCircle}
                tone="text-destructive"
                title="Payment not found"
                text="We could not find a payment to check. Please open your subscription page."
            />
        );
    } else if (checking || !outcome) {
        content = (
            <div className="flex flex-col items-center">
                <Loader2 className="size-12 animate-spin text-primary" />
                <h1 className="mt-5 text-4xl font-semibold">Confirming your payment...</h1>
                <p className="mt-2 max-w-md text-muted-foreground">
                    Please wait while Stripe confirms your payment. Do not close this page.
                </p>
            </div>
        );
    } else if (outcome.kind === "paid") {
        content = (
            <Message
                Icon={CheckCircle2}
                tone="text-green-600"
                title="Payment successful!"
                text={`Thank you. We received ${formatMoney(outcome.amount, outcome.currency)} and your Premium plan is active.`}
            />
        );
    } else if (outcome.kind === "pending") {
        content = (
            <Message
                Icon={Clock}
                tone="text-amber-600"
                title="Still processing"
                text="Your payment is taking longer than usual to confirm. Premium turns on automatically as soon as Stripe confirms it."
                extra={<Button onClick={() => setAttempt((value) => value + 1)}>Check again</Button>}
            />
        );
    } else if (outcome.kind === "failed") {
        content = (
            <Message
                Icon={AlertCircle}
                tone="text-destructive"
                title="Payment was not completed"
                text="No money was taken and your plan did not change. You can try again from the subscription page."
            />
        );
    } else {
        content = (
            <Message
                Icon={AlertCircle}
                tone="text-destructive"
                title="Could not check your payment"
                text={outcome.message}
                extra={<Button onClick={() => setAttempt((value) => value + 1)}>Try again</Button>}
            />
        );
    }

    return (
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
            {content}
            {!checking ? (
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href="/dashboard/vendor/subscription" className={buttonVariants({ variant: "outline" })}>
                        View Subscription
                    </Link>
                    <Link href="/dashboard/vendor" className={buttonVariants()}>
                        Go to Dashboard
                    </Link>
                </div>
            ) : null}
        </Container>
    );
}

function Message({
    Icon,
    tone,
    title,
    text,
    extra,
}: {
    Icon: typeof CheckCircle2;
    tone: string;
    title: string;
    text: string;
    extra?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center">
            <Icon className={`size-14 ${tone}`} />
            <h1 className="mt-5 text-4xl font-semibold">{title}</h1>
            <p className="mt-2 max-w-md text-muted-foreground">{text}</p>
            {extra ? <div className="mt-5">{extra}</div> : null}
        </div>
    );
}