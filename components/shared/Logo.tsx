
import Link from "next/link";
import { Heart } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="relative flex size-10 items-center justify-center rounded-full border-2 border-rose-200 bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
        <Heart className="size-5 fill-current" />
      </span>

      <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Wed<span className="text-rose-500">Plan</span>
      </span>
    </Link>
  );
}
