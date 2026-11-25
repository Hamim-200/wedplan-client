import { CalendarCheck, CreditCard, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const benefits: { title: string; text: string; Icon: LucideIcon }[] = [
  {
    title: "Verified Vendors",
    text: "Every service is reviewed by our team before it appears on the platform.",
    Icon: ShieldCheck,
  },
  {
    title: "Everything in One Place",
    text: "Photographers, venues, florists, caterers and more, all easy to compare.",
    Icon: Users,
  },
  {
    title: "Simple Booking Requests",
    text: "Send a request in seconds and track its status from your dashboard.",
    Icon: CalendarCheck,
  },
  {
    title: "Secure and Transparent",
    text: "Clear prices, protected accounts and safe payments powered by Stripe.",
    Icon: CreditCard,
  },
];

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Why WedPlan"
          title="Why Choose WedPlan?"
          text="We make wedding planning calmer, faster and more trustworthy."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, text, Icon }, index) => (
            <Reveal key={title} delay={index * 0.08}>
              <div className="h-full rounded-2xl border bg-card p-6 text-center shadow-sm">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                  <Icon className="size-7" />
                </span>
                <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}