import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { getFeaturedServices } from "@/lib/data/public";

export async function FeaturedServices() {
  const services = await getFeaturedServices(6);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Featured"
          title="Featured Wedding Services"
          text="Hand-picked, approved services from trusted vendors."
        />

        {services.length === 0 ? (
          <EmptyState
            title="No services yet"
            text="Approved services will appear here. Please check back soon."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service._id} delay={(index % 3) * 0.08}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/services" className={buttonVariants({ variant: "outline", size: "lg" })}>
            View All Services
          </Link>
        </div>
      </Container>
    </section>
  );
}