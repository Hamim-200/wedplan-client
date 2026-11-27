"use client";

import { useState } from "react";
import { BadgeCheck, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useApiData } from "@/hooks/useApiData";
import { apiFetch } from "@/lib/api";
import { formatEventDate, formatMoney } from "@/lib/format";
import type { SubscriptionInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "Maximum 3 active services",
  "Basic vendor dashboard",
  "Booking request management",
];

const PREMIUM_FEATURES = [
  "Unlimited active services",
  "Premium Vendor badge",
  "All Free plan features",
];

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SubscriptionPanel() {
  const { data, error, loading, reload } = useApiData<{ subscription: SubscriptionInfo }>(
    "/api/payments/subscription"
  );
  const [upgrading, setUpgrading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function upgrade() {
    setUpgrading(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/api/payments/checkout", {
        method: "POST",
        auth: true,
      });
      // Leave for Stripe's secure payment page. We keep the spinner on.
      window.location.assign(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the payment");
      setUpgrading(false);
    }
  }

  async function cancel() {
    setCancelling(true);
    try {
      await apiFetch("/api/payments/cancel", { method: "POST", auth: true });
      toast.success("Your subscription will end at the end of the billing period");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel the subscription");
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
      reload();
    }
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load your subscription"
        text={error}
        action={<Button onClick={reload}>Try again</Button>}
      />
    );
  }

  if (loading && !data) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const subscription = data?.subscription;
  if (!subscription) return null;

  const isPremium = subscription.plan === "premium";

  return (
    <>
      {isPremium ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-accent p-4">
          <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold">You are a Premium vendor</p>
            <p className="text-muted-foreground">
              {subscription.cancelAtPeriodEnd
                ? `Your plan will end on ${subscription.expiresAt ? formatEventDate(subscription.expiresAt) : "the end of the period"}. After that you return to the Free plan.`
                : `Your plan renews on ${subscription.expiresAt ? formatEventDate(subscription.expiresAt) : "the next billing date"}.`}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free */}
        <div
          className={cn(
            "flex flex-col rounded-2xl border bg-card p-6 shadow-sm",
            !isPremium && "ring-2 ring-primary/40"
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Free</h2>
            {!isPremium ? <Badge>Current plan</Badge> : null}
          </div>
          <p className="mt-2 text-4xl font-semibold">
            $0 <span className="text-base font-normal text-muted-foreground">/ month</span>
          </p>
          <div className="mt-6 flex-1">
            <FeatureList items={FREE_FEATURES} />
          </div>
        </div>

        {/* Premium */}
        <div
          className={cn(
            "flex flex-col rounded-2xl border bg-card p-6 shadow-sm",
            isPremium && "ring-2 ring-primary/40"
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Premium</h2>
            {isPremium ? <Badge>Current plan</Badge> : <Badge variant="secondary">Recommended</Badge>}
          </div>
          <p className="mt-2 text-4xl font-semibold">
            {formatMoney(subscription.priceCents, subscription.currency)}{" "}
            <span className="text-base font-normal text-muted-foreground">/ month</span>
          </p>
          <div className="mt-6 flex-1">
            <FeatureList items={PREMIUM_FEATURES} />
          </div>

          <div className="mt-6">
            {isPremium ? (
              subscription.cancelAtPeriodEnd ? (
                <p className="text-sm text-muted-foreground">Cancellation is scheduled.</p>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-destructive"
                  onClick={() => setConfirmCancel(true)}
                >
                  Cancel subscription
                </Button>
              )
            ) : (
              <Button size="lg" className="w-full" onClick={upgrade} disabled={upgrading}>
                {upgrading ? <Loader2 className="size-4 animate-spin" /> : null}
                {upgrading ? "Redirecting to Stripe..." : "Upgrade to Premium"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Payments are processed securely by Stripe in test mode. Use the test card
        4242 4242 4242 4242 with any future date and any CVC.
      </p>

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Premium?</DialogTitle>
            <DialogDescription>
              You keep Premium until the end of the current billing period. After that, only
              your 3 oldest active services stay active.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmCancel(false)}>
              Keep Premium
            </Button>
            <Button onClick={cancel} disabled={cancelling}>
              {cancelling ? <Loader2 className="size-4 animate-spin" /> : null}
              Yes, cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}