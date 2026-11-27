"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useApiData } from "@/hooks/useApiData";
import { formatMoney, formatShortDate } from "@/lib/format";
import type { Transaction, TransactionsResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<Transaction["status"], string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
};

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56";

export function Transactions() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const query = new URLSearchParams({ page: String(page), limit: "10" });
  if (status) query.set("status", status);

  const { data, error, loading, reload } = useApiData<TransactionsResponse>(
    `/api/admin/transactions?${query.toString()}`
  );

  return (
    <>
      <div className="mb-5">
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by payment status"
        >
          <option value="">All payment statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error ? (
        <EmptyState
          title="Could not load transactions"
          text={error}
          action={<Button onClick={reload}>Try again</Button>}
        />
      ) : loading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : data && data.transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          text="Premium subscription payments will appear here once vendors upgrade."
        />
      ) : (
        <>
          <div
            className={cn(
              "overflow-x-auto rounded-2xl border bg-card shadow-sm transition-opacity",
              loading && "opacity-60"
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      <p className="font-medium">
                        {transaction.vendor?.businessName ??
                          transaction.vendor?.name ??
                          "Unknown vendor"}
                      </p>
                      {transaction.vendor?.businessName ? (
                        <p className="text-xs text-muted-foreground">{transaction.vendor.name}</p>
                      ) : null}
                    </TableCell>
                    <TableCell className="capitalize">{transaction.plan}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {formatMoney(transaction.amount, transaction.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", STATUS_STYLE[transaction.status])}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatShortDate(transaction.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data ? (
            <PaginationBar
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onChange={setPage}
              disabled={loading}
            />
          ) : null}
        </>
      )}
    </>
  );
}