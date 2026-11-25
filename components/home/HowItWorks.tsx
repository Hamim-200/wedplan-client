import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const steps = [
  {
    title: "Browse and Compare",
    text: "Search services by name, category or location and compare prices.",
  },
  {
    title: "Send a Booking Request",
    text: "Pick your event date and location, add a message and send it to the vendor.",
  },
  {
    title: "Get a Reply",
    text: "The vendor accepts or rejects your request, and you can track it any time.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Simple process"
          title="How WedPlan Works"
          text="From first search to confirmed vendor in three easy steps."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.1}>
              <div className="relative h-full rounded-2xl border bg-card p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup" className={buttonVariants({ size: "lg" })}>
            Get Started Free
          </Link>
        </div>
      </Container>
    </section>
  );
}