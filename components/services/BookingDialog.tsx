"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError, apiFetch } from "@/lib/api";

// Today as YYYY-MM-DD (UTC, the same way the server checks it).
function todayString() {
  return new Date().toISOString().slice(0, 10);
}

const bookingSchema = z.object({
  eventDate: z
    .string()
    .min(1, "Please choose the event date")
    .refine((value) => value >= todayString(), "Event date cannot be in the past"),
  eventLocation: z
    .string()
    .trim()
    .min(3, "Event location must be at least 3 characters")
    .max(150, "Event location is too long"),
  message: z.string().trim().max(1000, "Message is too long"),
});

type BookingValues = z.infer<typeof bookingSchema>;

interface BookingDialogProps {
  serviceId: string;
  serviceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDialog({
  serviceId,
  serviceName,
  open,
  onOpenChange,
}: BookingDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [minDate] = useState(() => todayString());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { eventDate: "", eventLocation: "", message: "" },
  });

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setDone(false);
      reset();
    }
  }

  async function onSubmit(values: BookingValues) {
    setSubmitting(true);
    try {
      await apiFetch("/api/customer/bookings", {
        method: "POST",
        auth: true,
        body: { serviceId, ...values },
      });
      toast.success("Booking request sent to the vendor");
      setDone(true);
    } catch (error) {
      if (error instanceof ApiClientError) {
        const detail = error.errors?.[0]?.message;
        toast.error(detail ? `${error.message}: ${detail}` : error.message);
      } else {
        toast.error("Could not send your booking request");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="size-14 text-green-600" />
            <h2 className="mt-4 text-3xl font-semibold">Request sent!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The vendor will review your request. You can track its status from your
              dashboard.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/dashboard/customer"
                className={buttonVariants()}
                onClick={() => handleOpenChange(false)}
              >
                Go to Dashboard
              </Link>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Request a booking</DialogTitle>
              <DialogDescription>
                {serviceName}. The vendor will accept or reject your request.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event date</Label>
                <Input id="eventDate" type="date" min={minDate} {...register("eventDate")} />
                {errors.eventDate ? (
                  <p className="text-sm text-destructive">{errors.eventDate.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventLocation">Event location</Label>
                <Input
                  id="eventLocation"
                  placeholder="e.g. Dhaka Club, Gulshan"
                  {...register("eventLocation")}
                />
                {errors.eventLocation ? (
                  <p className="text-sm text-destructive">{errors.eventLocation.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional message (optional)</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Tell the vendor about your wedding..."
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                ) : null}
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {submitting ? "Sending..." : "Send Booking Request"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}