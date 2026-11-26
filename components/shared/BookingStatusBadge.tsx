import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLE: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge className={cn("capitalize", STYLE[status])}>{status}</Badge>;
}