"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Loader2, MapPin, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useApiData } from "@/hooks/useApiData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { apiFetch } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { AdminServicesResponse, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

const STATUS_STYLE: Record<Service["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function ManageServices() {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);

  const search = useDebouncedValue(searchText.trim());

  const query = new URLSearchParams({ page: String(page), limit: "8" });
  if (search) query.set("search", search);
  if (status) query.set("status", status);
  if (category) query.set("category", category);

  const { data, error, loading, reload } = useApiData<AdminServicesResponse>(
    `/api/admin/services?${query.toString()}`
  );

  async function changeStatus(service: Service, next: string) {
    if (next === service.status) return;
    setBusyId(service._id);
    try {
      await apiFetch(`/api/admin/services/${service._id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status: next },
      });
      toast.success(`Service marked as ${next}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change the status");
    } finally {
      setBusyId(null);
      reload();
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusyId(toDelete._id);
    try {
      await apiFetch(`/api/admin/services/${toDelete._id}`, { method: "DELETE", auth: true });
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the service");
    } finally {
      setBusyId(null);
      setToDelete(null);
      reload();
    }
  }

  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or location..."
            className="pl-9"
            aria-label="Search services"
          />
        </div>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {SERVICE_CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <EmptyState
          title="Could not load services"
          text={error}
          action={<Button onClick={reload}>Try again</Button>}
        />
      ) : loading && !data ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : data && data.services.length === 0 ? (
        <EmptyState title="No services found" text="Try a different search or filter." />
      ) : (
        <>
          <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
            {data?.services.map((service) => {
              const busy = busyId === service._id;
              const vendorName =
                service.vendor?.businessName ?? service.vendor?.name ?? "Unknown vendor";
              return (
                <article
                  key={service._id}
                  className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row"
                >
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-40">
                    {service.images[0] ? (
                      <Image
                        src={service.images[0]}
                        alt={service.serviceName}
                        fill
                        sizes="(min-width: 640px) 160px, 100vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-2xl font-semibold">{service.serviceName}</h2>
                      <Badge className={cn("capitalize", STATUS_STYLE[service.status])}>
                        {service.status}
                      </Badge>
                      {!service.isActive ? <Badge variant="outline">Inactive</Badge> : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {service.category} · by {vendorName}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="font-semibold text-primary">
                        {formatPrice(service.price)}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-4" />
                        {service.location}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <select
                        value={service.status}
                        disabled={busy}
                        onChange={(event) => changeStatus(service, event.target.value)}
                        className="h-8 rounded-lg border border-input bg-background px-2 text-sm capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Change status"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      {busy ? <Loader2 className="size-4 animate-spin text-primary" /> : null}

                      {service.status === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            disabled={busy}
                            onClick={() => changeStatus(service, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            disabled={busy}
                            onClick={() => changeStatus(service, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : null}

                      <Link
                        href={`/services/${service._id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <Eye className="size-4" />
                        Preview
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        disabled={busy}
                        onClick={() => setToDelete(service)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
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

      <Dialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this service?</DialogTitle>
            <DialogDescription>
              &quot;{toDelete?.serviceName}&quot; will be removed permanently. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} disabled={busyId !== null}>
              {busyId !== null ? <Loader2 className="size-4 animate-spin" /> : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}