import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { getDashboardPath, needsOnboarding, type UserRole } from "./roles";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

// For private pages: sends visitors to Sign In (or Blocked) when needed.
export async function requireUser(callbackUrl = "/dashboard") {
  const session = await getServerSession();
  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  if (session.user.isBlocked) {
    redirect("/blocked");
  }
  return session.user;
}

// For dashboards: only the matching role may enter. Others go to their own dashboard.
export async function requireRole(role: UserRole, callbackUrl: string) {
  const user = await requireUser(callbackUrl);
  if (needsOnboarding(user)) redirect("/onboarding");
  if (user.role !== role) redirect(getDashboardPath(user.role));
  return user;
}