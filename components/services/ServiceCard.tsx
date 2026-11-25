import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const image = service.images[0];
  const vendorName = service.vendor?.businessName ?? service.vendor?.name ?? "WedPlan Vendor";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={service.serviceName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        <Badge className="absolute top-3 left-3" variant="secondary">
          {service.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 text-2xl font-semibold">{service.serviceName}</h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">{service.location}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <span className="truncate text-muted-foreground">by {vendorName}</span>
          {service.vendor?.isPremium ? (
            <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="Premium vendor" />
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-lg font-semibold text-primary">
            {formatPrice(service.price)}
          </p>
          <Link href={`/services/${service._id}`} className={buttonVariants({ size: "sm" })}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}