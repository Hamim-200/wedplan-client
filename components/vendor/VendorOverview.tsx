"use client";

import { BadgeCheck, CalendarCheck, Clock, Store, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { useApiData } from "@/hooks/useApiData";
import type { VendorStats } from "@/lib/types";

export function VendorOverview() {
  const { data, error, loading, reload } = useApiData<{ stats: VendorStats }>(
    "/api/vendor/stats"
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  const stats = data?.stats;
  if (!stats) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Total Services" value={stats.totalServices} Icon={Store} />
      <StatCard label="Active Services" value={stats.activeServices} Icon={Zap} />
      <StatCard label="Pending Booking Requests" value={stats.pendingBookings} Icon={Clock} />
      <StatCard label="Accepted Bookings" value={stats.acceptedBookings} Icon={CalendarCheck} />
      <StatCard label="Current Plan" value={stats.subscriptionPlan} Icon={BadgeCheck} />
    </div>
  );
}