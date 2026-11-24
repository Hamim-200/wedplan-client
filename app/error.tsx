"use client";

import { useEffect } from "react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-semibold">Something went wrong</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        An unexpected error happened. Please try again, and if it continues, come back a bit later.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </Container>
  );
}