import Link from "next/link";
import { Heart } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Heart className="size-4 fill-current" />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight">WedPlan</span>
    </Link>
  );
}