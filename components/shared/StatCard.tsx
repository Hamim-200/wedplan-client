import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string | number;
  Icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-semibold capitalize">{value}</p>
      </div>
    </div>
  );
}