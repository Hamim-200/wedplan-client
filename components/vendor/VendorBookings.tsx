"use client";

import { useState } from "react";
import { CalendarDays, Check, Loader2, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import {
  BookingStatusFilter,
  type StatusFilter,
} from "@/components/shared/BookingStatusFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useApiData } from "@/hooks/useApiData";
import { apiFetch } from "@/lib/api";
import { formatEventDate, formatPrice, formatShortDate } from "@/lib/format";
import type { BookingsResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function VendorBookings() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const query = new URLSearchParams({ page: String(page), limit: "8" });
  if (status !== "all") query.set("status", status);

  const { data, error, loading, reload } = useApiData<BookingsResponse>(
    `/api/vendor/bookings?${query.toString()}`
  );

  function changeStatus(next: StatusFilter) {
    setStatus(next);
    setPage(1);
  }

  async function decide(id: string, action: "accept" | "reject") {
    setBusyId(id);
    try {
      await apiFetch(`/api/vendor/bookings/${id}/${action}`, { method: "PATCH", auth: true });
      toast.success(action === "accept" ? "Booking accepted" : "Booking rejected");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the booking");
    } finally {
      setBusyId(null);
      reload(); // always refresh, so the list matches the server
    }
  }

  return (
    <>
      <BookingStatusFilter value={status} onChange={changeStatus} />

      {error ? (
        <EmptyState
          title="Could not load booking requests"
          text={error}
          action={<Button onClick={reload}>Try again</Button>}
        />
      ) : loading && !data ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : data && data.bookings.length === 0 ? (
        <EmptyState
          title="No booking requests"
          text={
            status === "all"
              ? "When customers book your services, their requests will appear here."
              : `You have no ${status} requests.`
          }
        />
      ) : (
        <>
          <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
            {data?.bookings.map((booking) => {
              const busy = busyId === booking._id;
              const customerName = booking.customer?.name ?? "Unknown customer";
              return (
                <article
                  key={booking._id}
                  className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-2xl font-semibold">
                        {booking.service?.serviceName ?? "Service no longer available"}
                      </h2>
                      {booking.service ? (
                        <p className="text-sm text-muted-foreground">
                          {booking.service.category} · {formatPrice(booking.service.price)}
                        </p>
                      ) : null}
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      {booking.customer?.image ? (
                        <AvatarImage src={booking.customer.image} alt={customerName} />
                      ) : null}
                      <AvatarFallback>{customerName.slice(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{customerName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {booking.customer?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" />
                      Event: {formatEventDate(booking.eventDate)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      {booking.eventLocation}
                    </p>
                  </div>

                  {booking.message ? (
                    <p className="rounded-lg bg-muted p-3 text-sm whitespace-pre-line">
                      {booking.message}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Requested on {formatShortDate(booking.createdAt)}
                    </p>
                    {booking.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() => decide(booking._id, "accept")}
                        >
                          {busy ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Check className="size-4" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => decide(booking._id, "reject")}
                          className="text-destructive"
                        >
                          <X className="size-4" />
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
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