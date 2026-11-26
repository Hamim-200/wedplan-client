"use client";

import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export type StatusFilter = BookingStatus | "all";

const OPTIONS: StatusFilter[] = ["all", "pending", "accepted", "rejected", "cancelled"];

export function BookingStatusFilter({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition",
            value === option
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-card hover:bg-accent"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}