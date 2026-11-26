"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { EditServiceForm } from "@/components/vendor/EditServiceForm";
import { useApiData } from "@/hooks/useApiData";
import type { MyService } from "@/lib/types";

export function EditService({ id }: { id: string }) {
  const { data, error, loading, reload } = useApiData<{ service: MyService }>(
    `/api/vendor/services/${id}`
  );

  if (error) {
    return (
      <EmptyState
        title="Could not load this service"
        text={error}
        action={
          <div className="flex gap-3">
            <Link href="/dashboard/vendor/services" className={buttonVariants()}>
              Back to My Services
            </Link>
            <Button variant="outline" onClick={reload}>
              Try again
            </Button>
          </div>
        }
      />
    );
  }

  if (loading || !data) {
    return <Skeleton className="h-96 max-w-2xl rounded-2xl" />;
  }

  return <EditServiceForm service={data.service} />;
}