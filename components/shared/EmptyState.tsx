import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
        <SearchX className="size-6" />
      </span>
      <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
      {text ? <p className="mt-2 max-w-sm text-sm text-muted-foreground">{text}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}