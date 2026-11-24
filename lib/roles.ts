export type UserRole = "admin" | "vendor" | "customer";

export function getDashboardPath(role?: string | null): string {
  if (role === "admin") return "/dashboard/admin";
  if (role === "vendor") return "/dashboard/vendor";
  return "/dashboard/customer";
}

// Only allow redirects to pages inside our own site.
export function safeCallbackUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

// New accounts must choose Vendor or Customer once. Admins never do.
export function needsOnboarding(user: {
  role?: string | null;
  roleSelected?: boolean | null;
}): boolean {
  return user.role !== "admin" && user.roleSelected === false;
}