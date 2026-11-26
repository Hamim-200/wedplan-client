"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { Booking, BookingsResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

function vendorLabel(booking: Booking) {
  return booking.vendor?.businessName ?? booking.vendor?.name ?? "WedPlan Vendor";
}

export function MyBookings() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const query = new URLSearchParams({ page: String(page), limit: "8" });
  if (status !== "all") query.set("status", status);

  const { data, error, loading, reload } = useApiData<BookingsResponse>(
    `/api/customer/bookings?${query.toString()}`
  );

  function changeStatus(next: StatusFilter) {
    setStatus(next);
    setPage(1);
  }

  async function confirmCancel() {
    if (!toCancel) return;
    setCancelling(true);
    try {
      await apiFetch(`/api/customer/bookings/${toCancel._id}/cancel`, {
        method: "PATCH",
        auth: true,
      });
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel the booking");
    } finally {
      setCancelling(false);
      setToCancel(null);
      reload();
    }
  }

  return (
    <>
      <BookingStatusFilter value={status} onChange={changeStatus} />

      {error ? (
        <EmptyState
          title="Could not load your bookings"
          text={error}
          action={<Button onClick={reload}>Try again</Button>}
        />
      ) : loading && !data ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : data && data.bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          text={
            status === "all"
              ? "You haven't sent any booking requests yet."
              : `You have no ${status} bookings.`
          }
          action={
            status === "all" ? (
              <Link href="/services" className={buttonVariants()}>
                Browse Services
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
            {data?.bookings.map((booking) => (
              <article
                key={booking._id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-40">
                  {booking.service?.image ? (
                    <Image
                      src={booking.service.image}
                      alt={booking.service.serviceName}
                      fill
                      sizes="(min-width: 640px) 160px, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-2xl font-semibold">
                      {booking.service?.serviceName ?? "Service no longer available"}
                    </h2>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">by {vendorLabel(booking)}</p>
                  <div className="grid gap-1 text-sm sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" />
                      {formatEventDate(booking.eventDate)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span className="truncate">{booking.eventLocation}</span>
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requested on {formatShortDate(booking.createdAt)}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => setSelected(booking)}>
                      <Eye className="size-4" />
                      View Details
                    </Button>
                    {booking.status === "pending" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setToCancel(booking)}
                      >
                        Cancel Request
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
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

      {/* Details dialog */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Booking details</DialogTitle>
                <DialogDescription>
                  {selected.service?.serviceName ?? "Service no longer available"}
                </DialogDescription>
              </DialogHeader>
              <dl className="space-y-3 text-sm">
                <Row label="Status">
                  <BookingStatusBadge status={selected.status} />
                </Row>
                <Row label="Vendor">{vendorLabel(selected)}</Row>
                {selected.service ? (
                  <>
                    <Row label="Category">{selected.service.category}</Row>
                    <Row label="Price">{formatPrice(selected.service.price)}</Row>
                  </>
                ) : null}
                <Row label="Event date">{formatEventDate(selected.eventDate)}</Row>
                <Row label="Event location">{selected.eventLocation}</Row>
                <Row label="Requested on">{formatShortDate(selected.createdAt)}</Row>
                <Row label="Your message">
                  {selected.message ? (
                    <span className="whitespace-pre-line">{selected.message}</span>
                  ) : (
                    <span className="text-muted-foreground">No message</span>
                  )}
                </Row>
              </dl>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation */}
      <Dialog open={toCancel !== null} onOpenChange={(open) => !open && setToCancel(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel this request?</DialogTitle>
            <DialogDescription>
              The vendor will no longer see it as pending. You can send a new request later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setToCancel(null)}>
              Keep it
            </Button>
            <Button onClick={confirmCancel} disabled={cancelling}>
              {cancelling ? <Loader2 className="size-4 animate-spin" /> : null}
              Yes, cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b pb-3 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 font-medium">{children}</dd>
    </div>
  );
}