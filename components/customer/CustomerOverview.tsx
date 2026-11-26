"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, Clock, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { useApiData } from "@/hooks/useApiData";
import type { CustomerStats } from "@/lib/types";

export function CustomerOverview() {
  const { data, error, loading, reload } = useApiData<{ stats: CustomerStats }>(
    "/api/customer/bookings/stats"
  );

  if (error) {
    return (
      <EmptyState
        title="Could not load your stats"
        text={error}
        action={<Button onClick={reload}>Try again</Button>}
      />
    );
  }

  if (loading && !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  const stats = data?.stats;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Booking Requests" value={stats.total} Icon={ClipboardList} />
        <StatCard label="Pending Bookings" value={stats.pending} Icon={Clock} />
        <StatCard label="Accepted Bookings" value={stats.accepted} Icon={CheckCircle2} />
        <StatCard label="Rejected Bookings" value={stats.rejected} Icon={XCircle} />
      </div>

      {stats.total === 0 ? (
        <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">Ready to plan your wedding?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse approved services and send your first booking request.
          </p>
          <Link href="/services" className={`${buttonVariants()} mt-5`}>
            Browse Services
          </Link>
        </div>
      ) : null}
    </div>
  );
}