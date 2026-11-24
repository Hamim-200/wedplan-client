"use client";

import { Store, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value: "customer" | "vendor";
  onChange: (role: "customer" | "vendor") => void;
}

const options = [
  {
    value: "customer" as const,
    title: "Customer",
    text: "Find and book wedding services",
    Icon: UserRound,
  },
  {
    value: "vendor" as const,
    title: "Vendor",
    text: "Publish services and get bookings",
    Icon: Store,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ value: optionValue, title, text, Icon }) => (
        <button
          key={optionValue}
          type="button"
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
          className={cn(
            "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition",
            value === optionValue
              ? "border-primary bg-accent ring-2 ring-primary/30"
              : "hover:bg-muted"
          )}
        >
          <Icon className="size-5 text-primary" />
          <span className="text-sm font-semibold">{title}</span>
          <span className="text-xs text-muted-foreground">{text}</span>
        </button>
      ))}
    </div>
  );
}