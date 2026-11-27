"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, Receipt, Store, Truck, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { useApiData } from "@/hooks/useApiData";
import { formatMoney } from "@/lib/format";
import type { AdminStats } from "@/lib/types";

export function AdminOverview() {
  const { data, error, loading, reload } = useApiData<{ stats: AdminStats }>(
    "/api/admin/stats"
  );

  if (error) {
    return (
      <EmptyState
        title="Could not load platform stats"
        text={error}
        action={<Button onClick={reload}>Try again</Button>}
      />
    );
  }

  if (loading && !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  const stats = data?.stats;
  if (!stats) return null;

  const chartData = [
    { name: "Pending", value: stats.pendingServices },
    { name: "Approved", value: stats.approvedServices },
    { name: "Rejected", value: stats.rejectedServices },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Registered Users" value={stats.totalUsers} Icon={Users} />
        <StatCard label="Total Vendors" value={stats.totalVendors} Icon={Truck} />
        <StatCard label="Total Customers" value={stats.totalCustomers} Icon={UserRound} />
        <StatCard label="Total Services" value={stats.totalServices} Icon={Store} />
        <StatCard label="Pending Services" value={stats.pendingServices} Icon={Clock} />
        <StatCard label="Total Transactions" value={stats.totalTransactions} Icon={Receipt} />
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold">Services by status</h2>
          <p className="text-sm text-muted-foreground">
            Revenue (paid): <strong>{formatMoney(stats.revenueCents)}</strong>
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#9f3a52" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}