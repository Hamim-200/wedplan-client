import Link from "next/link";
import {
  Camera,
  Building2,
  Flower2,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getCategoryCounts } from "@/lib/data/public";

const ICONS: Record<string, LucideIcon> = {
  "Photography & Videography": Camera,
  "Wedding Venues": Building2,
  "Decoration & Florist": Flower2,
  "Catering Services": UtensilsCrossed,
  "Makeup & Styling": Sparkles,
  "Wedding Fashion": Shirt,
};

export async function Categories() {
  const categories = await getCategoryCounts();

  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Wedding Service Categories"
          text="Start with what you need most and discover vendors in each category."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = ICONS[category.name] ?? Sparkles;
            return (
              <Reveal key={category.name} delay={(index % 3) * 0.08}>
                <Link
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-7" />
                  </span>
                  <span>
                    <span className="block text-xl font-semibold">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.count} {category.count === 1 ? "service" : "services"}
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}