"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearTokenCache } from "@/lib/api";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleClick() {
    await signOut();
    clearTokenCache();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleClick}>
      Sign Out
    </Button>
  );
}