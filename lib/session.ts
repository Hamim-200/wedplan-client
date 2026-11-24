import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

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