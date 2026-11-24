"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/shared/Container";
import { UserMenu } from "@/components/layout/UserMenu";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition hover:bg-accent",
                isActive(link.href) ? "text-primary" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <Skeleton className="h-9 w-32 rounded-full" />
          ) : user ? (
            <UserMenu
              name={user.name}
              email={user.email}
              image={user.image}
              role={user.role}
            />
          ) : (
            <>
              <Link href="/signin" className={buttonVariants({ variant: "ghost" })}>
                Sign In
              </Link>
              <Link href="/signup" className={buttonVariants()}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {!isPending && user ? (
            <UserMenu
              name={user.name}
              email={user.email}
              image={user.image}
              role={user.role}
            />
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </Container>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-heading">WedPlan</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  isActive(link.href) ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isPending && !user ? (
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={buttonVariants()}
                >
                  Sign Up
                </Link>
              </div>
            ) : null}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}