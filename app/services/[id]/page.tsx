import type { Metadata } from "next";
import { ServiceDetails } from "@/components/services/ServiceDetails";

export const metadata: Metadata = {
    title: "Service Details",
    description: "View service details, photos and vendor information, then request a booking.",
};

export default async function ServiceDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <ServiceDetails id={id} />;
}