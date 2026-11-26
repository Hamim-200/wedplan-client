"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useApiData } from "@/hooks/useApiData";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { MyService } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<MyService["status"], string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
};

export function MyServices() {
    const { data, error, loading, reload } = useApiData<{ services: MyService[] }>(
        "/api/vendor/services"
    );
    const [busyId, setBusyId] = useState<string | null>(null);
    const [toDelete, setToDelete] = useState<MyService | null>(null);

    async function toggleActive(service: MyService) {
        setBusyId(service._id);
        try {
            await apiFetch(`/api/vendor/services/${service._id}/availability`, {
                method: "PATCH",
                auth: true,
                body: { isActive: !service.isActive },
            });
            toast.success(service.isActive ? "Service is now inactive" : "Service is now active");
            reload();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not update the service");
        } finally {
            setBusyId(null);
        }
    }

    async function confirmDelete() {
        if (!toDelete) return;
        setBusyId(toDelete._id);
        try {
            await apiFetch(`/api/vendor/services/${toDelete._id}`, { method: "DELETE", auth: true });
            toast.success("Service deleted");
            setToDelete(null);
            reload();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not delete the service");
        } finally {
            setBusyId(null);
        }
    }

    if (error) {
        return (
            <EmptyState
                title="Could not load your services"
                text={error}
                action={<Button onClick={reload}>Try again</Button>}
            />
        );
    }

    if (loading && !data) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 rounded-2xl" />
                ))}
            </div>
        );
    }

    const services = data?.services ?? [];

    if (services.length === 0) {
        return (
            <EmptyState
                title="You haven't added any services yet"
                text="Add your first service and it will appear after admin approval."
                action={
                    <Link href="/dashboard/vendor/add-service" className={buttonVariants()}>
                        <Plus className="size-4" />
                        Add Service
                    </Link>
                }
            />
        );
    }

    return (
        <>
            <div className="space-y-4">
                {services.map((service) => {
                    const busy = busyId === service._id;
                    return (
                        <article
                            key={service._id}
                            className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row"
                        >
                            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-44">
                                {service.images[0] ? (
                                    <Image
                                        src={service.images[0]}
                                        alt={service.serviceName}
                                        fill
                                        sizes="(min-width: 640px) 176px, 100vw"
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
                                <p className="text-sm text-muted-foreground">{service.category}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                    <span className="font-semibold text-primary">{formatPrice(service.price)}</span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="size-4" />
                                        {service.location}
                                    </span>
                                </div>
                                {service.status === "rejected" ? (
                                    <p className="text-xs text-destructive">
                                        Rejected services are not visible to customers. Edit it to resubmit.
                                    </p>
                                ) : service.status === "pending" ? (
                                    <p className="text-xs text-muted-foreground">Waiting for admin approval.</p>
                                ) : null}

                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Link
                                        href={`/services/${service._id}`}
                                        className={buttonVariants({ variant: "outline", size: "sm" })}
                                    >
                                        <Eye className="size-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={`/dashboard/vendor/services/${service._id}/edit`}
                                        className={buttonVariants({ variant: "outline", size: "sm" })}
                                    >
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={busy}
                                        onClick={() => toggleActive(service)}
                                    >
                                        {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                                        {service.isActive ? "Set Inactive" : "Set Active"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={busy}
                                        onClick={() => setToDelete(service)}
                                        className="text-destructive"
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