import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/shared/Container";
import { BrowseServices } from "@/components/services/BrowseServices";
import { ServiceCardSkeleton } from "@/components/services/ServiceCardSkeleton";
import { fetchLocations } from "@/lib/data/browse";

export const metadata: Metadata = {
  title: "Browse Services",
  description: "Search and filter wedding photographers, venues, florists, caterers and more.",
};

export default async function ServicesPage() {
  const locations = await fetchLocations();

  return (
    <Container className="py-12">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">Discover</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Browse Wedding Services</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Search, filter and compare approved services from trusted vendors.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <BrowseServices locations={locations} />
      </Suspense>
    </Container>
  );
}