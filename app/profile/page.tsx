import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { needsOnboarding } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Profile Settings" };

export default async function ProfilePage() {
    const user = await requireUser("/profile");
    if (needsOnboarding(user)) redirect("/onboarding");

    return (
        <Container className="py-10">
            <PageHeader title="Profile Settings" text="Update your personal information." />
            <ProfileForm />
        </Container>
    );
}