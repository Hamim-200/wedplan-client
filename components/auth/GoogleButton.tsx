"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export function GoogleButton({ callbackURL = "/dashboard" }: { callbackURL?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const { error } = await signIn.social({ provider: "google", callbackURL });
      if (error) {
        toast.error(error.message ?? "Google sign-in failed");
        setLoading(false);
      }
      // On success the browser leaves for Google, so we keep the spinner.
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5.05 5.05 0 0 1-2.19 3.31v2.75h3.54c2.07-1.91 3.25-4.72 3.25-8.09Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.54-2.75c-.98.66-2.24 1.05-3.74 1.05-2.87 0-5.3-1.94-6.17-4.55H2.18v2.84A11 11 0 0 0 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.83 13.89a6.6 6.6 0 0 1 0-4.22V6.83H2.18a11 11 0 0 0 0 9.9l3.65-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 6.83l3.65 2.84C6.7 7.32 9.13 5.38 12 5.38Z"
          />
        </svg>
      )}
      Continue with Google
    </Button>
  );
}