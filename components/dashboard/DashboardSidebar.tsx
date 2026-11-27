"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  Settings,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/roles";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const NAV: Record<UserRole, NavItem[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/vendor/services", label: "My Services", Icon: Store },
    { href: "/dashboard/vendor/add-service", label: "Add Service", Icon: PlusCircle },
    { href: "/dashboard/vendor/bookings", label: "Booking Requests", Icon: CalendarCheck },
    { href: "/dashboard/vendor/subscription", label: "Subscription", Icon: CreditCard },
    { href: "/dashboard/vendor/profile", label: "Profile Settings", Icon: Settings },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", Icon: CalendarCheck },
    { href: "/dashboard/customer/profile", label: "Profile Settings", Icon: Settings },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", Icon: Users },
    { href: "/dashboard/admin/services", label: "Manage Services", Icon: Store },
    { href: "/dashboard/admin/transactions", label: "Transactions", Icon: Receipt },
  ],
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = NAV[role];

  function isActive(href: string) {
    // The Overview link is the role's root, so it must match exactly.
    return href === `/dashboard/${role}` ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:w-60 lg:shrink-0 lg:self-start">
      <p className="mb-3 hidden items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase lg:flex">
        <ArrowLeftRight className="size-3.5" />
        {role} area
      </p>
      <nav
        aria-label="Dashboard navigation"
        className="flex gap-1 overflow-x-auto rounded-2xl border bg-card p-2 shadow-sm lg:flex-col lg:overflow-visible"
      >
        {items.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition",
              isActive(href)
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-accent"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}