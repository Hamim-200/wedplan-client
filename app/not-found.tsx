import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold tracking-widest text-primary uppercase">Error 404</p>
      <h1 className="mt-3 text-5xl font-semibold">Page not found</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to Home
        </Link>
        <Link href="/services" className={buttonVariants({ variant: "outline" })}>
          Browse Services
        </Link>
      </div>
    </Container>
  );
}