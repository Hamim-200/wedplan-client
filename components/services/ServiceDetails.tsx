"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, MapPin, Tag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookingDialog } from "@/components/services/BookingDialog";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/format";
import type { ServiceDetailsResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LoadedResult {
  key: string;
  data?: ServiceDetailsResponse;
  error?: { status: number; message: string };
}

function LoadingView() {
  return (
    <Container className="py-12">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <div className="flex gap-3">
            <Skeleton className="size-20 rounded-lg" />
            <Skeleton className="size-20 rounded-lg" />
            <Skeleton className="size-20 rounded-lg" />
          </div>
        </div>
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </Container>
  );
}

export function ServiceDetails({ id }: { id: string }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<LoadedResult | null>(null);
  const [selected, setSelected] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  const requestKey = `${id}#${attempt}`;
  const loading = result?.key !== requestKey;
  const data = !loading ? result?.data : undefined;
  const error = !loading ? result?.error : undefined;

  useEffect(() => {
    let cancelled = false;

    apiFetch<ServiceDetailsResponse>(`/api/services/${id}`, { auth: true })
      .then((response) => {
        if (!cancelled) setResult({ key: requestKey, data: response });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = err instanceof ApiClientError ? err.status : 0;
        const message = err instanceof Error ? err.message : "Could not load this service";
        setResult({ key: requestKey, error: { status, message } });
      });

    return () => {
      cancelled = true;
    };
  }, [id, requestKey]);

  if (loading) return <LoadingView />;

  if (error || !data) {
    const notFound = error?.status === 404;
    return (
      <Container className="py-16">
        <EmptyState
          title={notFound ? "Service not found" : "Could not load this service"}
          text={
            notFound
              ? "This service doesn't exist or is no longer available."
              : (error?.message ?? "Something went wrong.")
          }
          action={
            <div className="flex gap-3">
              <Link href="/services" className={buttonVariants()}>
                Browse Services
              </Link>
              {!notFound ? (
                <Button variant="outline" onClick={() => setAttempt((value) => value + 1)}>
                  Try again
                </Button>
              ) : null}
            </div>
          }
        />
      </Container>
    );
  }

  const { service, bookable } = data;
  const images = service.images.length > 0 ? service.images : [];
  const activeImage = images[selected] ?? images[0];
  const vendorName = service.vendor?.businessName ?? service.vendor?.name ?? "WedPlan Vendor";

  // What to show in the booking area.
  let bookingArea: React.ReactNode;
  if (bookable) {
    bookingArea = (
      <Button size="lg" className="w-full" onClick={() => setBookingOpen(true)}>
        Request Booking
      </Button>
    );
  } else {
    let message = "This service is not currently available for booking.";
    if (user?.role === "admin") message = "Admins cannot submit booking requests.";
    else if (user?.role === "vendor") {
      message =
        service.vendorId === user.id
          ? "This is your own service. You cannot book it."
          : "Only customers can submit booking requests.";
    }
    bookingArea = (
      <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">{message}</p>
    );
  }

  return (
    <Container className="py-10">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Gallery and description */}
        <div className="space-y-6 lg:col-span-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={service.serviceName}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>

          {images.length > 1 ? (
            <div className="flex flex-wrap gap-3">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === selected}
                  className={cn(
                    "relative size-20 overflow-hidden rounded-lg border-2 transition",
                    index === selected ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}

          <div>
            <h2 className="text-3xl font-semibold">About this service</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>

        {/* Info card */}
        <aside className="lg:col-span-2">
          <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
            <div>
              <Badge variant="secondary" className="mb-3">
                <Tag className="size-3" />
                {service.category}
              </Badge>
              <h1 className="text-4xl leading-tight font-semibold">{service.serviceName}</h1>
            </div>

            <p className="text-3xl font-semibold text-primary">{formatPrice(service.price)}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {service.location}
            </div>

            <div className="flex items-center gap-3 border-t pt-5">
              <Avatar className="size-11">
                {service.vendor?.image ? (
                  <AvatarImage src={service.vendor.image} alt={vendorName} />
                ) : null}
                <AvatarFallback>{vendorName.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate font-medium">
                  {vendorName}
                  {service.vendor?.isPremium ? (
                    <BadgeCheck
                      className="size-4 shrink-0 text-primary"
                      aria-label="Premium vendor"
                    />
                  ) : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  {service.vendor?.isPremium ? "Premium vendor" : "Wedding vendor"}
                </p>
              </div>
            </div>

            <div className="border-t pt-5">{bookingArea}</div>
          </div>
        </aside>
      </div>

      <BookingDialog
        serviceId={service._id}
        serviceName={service.serviceName}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </Container>
  );
}