"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { apiFetch } from "@/lib/api";
import { getDashboardPath } from "@/lib/roles";

export function OnboardingForm() {
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (role === "vendor" && businessName.trim().length < 2) {
      setError("Business name is required for vendors");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/users/me/onboarding", {
        method: "POST",
        auth: true,
        body: { role, businessName: role === "vendor" ? businessName.trim() : undefined },
      });
      toast.success("All set! Welcome to WedPlan");
      window.location.assign(getDashboardPath(role));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your choice");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <RoleSelector value={role} onChange={setRole} />

      {role === "vendor" ? (
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="e.g. Dream Weddings Studio"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {submitting ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}