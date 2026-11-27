"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApiData } from "@/hooks/useApiData";
import { formatShortDate } from "@/lib/format";
import type { AdminUserDetailsResponse } from "@/lib/types";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b pb-3 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 font-medium break-words">{children}</dd>
    </div>
  );
}

export function UserDetailsDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, error, loading } = useApiData<AdminUserDetailsResponse>(
    `/api/admin/users/${id}`
  );
  const user = data?.user;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">User details</DialogTitle>
          <DialogDescription>Account information and activity.</DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : loading || !user ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : (
          <dl className="space-y-3 text-sm">
            <Row label="Name">{user.name}</Row>
            <Row label="Email">{user.email}</Row>
            <Row label="Role">
              <span className="capitalize">{user.role}</span>
            </Row>
            <Row label="Status">
              {user.isBlocked ? (
                <Badge className="bg-red-100 text-red-800">Blocked</Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              )}
            </Row>
            {user.role === "vendor" ? (
              <>
                <Row label="Business">{user.businessName ?? "Not set"}</Row>
                <Row label="Plan">
                  <span className="capitalize">{user.subscriptionPlan}</span>
                </Row>
                <Row label="Services">{data?.stats.services ?? 0}</Row>
              </>
            ) : null}
            {user.role !== "admin" ? (
              <Row label="Bookings">{data?.stats.bookings ?? 0}</Row>
            ) : null}
            <Row label="Joined">{user.createdAt ? formatShortDate(user.createdAt) : "Unknown"}</Row>
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}