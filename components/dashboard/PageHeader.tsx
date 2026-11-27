import type { ReactNode } from "react";

export function PageHeader({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-4xl font-semibold">{title}</h1>
        {text ? <p className="mt-1 text-sm text-muted-foreground">{text}</p> : null}
      </div>
      {action}
    </div>
  );
}