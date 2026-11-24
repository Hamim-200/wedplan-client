import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/shared/Container";
import { SERVICE_CATEGORIES } from "@/lib/constants";

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse Services" },
    { href: "/signin", label: "Sign In" },
    { href: "/signup", label: "Sign Up" },
];

const socials = [
    { href: "https://facebook.com", label: "Facebook" },
    { href: "https://instagram.com", label: "Instagram" },
    { href: "https://x.com", label: "X" },
    { href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
    return (
        <footer className="mt-auto border-t bg-secondary/40">
            <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-4">
                    <Logo />
                    <p className="text-sm text-muted-foreground">
                        WedPlan connects couples with trusted wedding vendors, from photographers to
                        venues, so planning your big day feels simple and joyful.
                    </p>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {quickLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="hover:text-primary">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold">Categories</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {SERVICE_CATEGORIES.map((category) => (
                            <li key={category}>
                                <Link
                                    href={`/services?category=${encodeURIComponent(category)}`}
                                    className="hover:text-primary"
                                >
                                    {category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Contact</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="size-4 text-primary" /> support@wedplan.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="size-4 text-primary" /> +880 1700 000000
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="size-4 text-primary" /> Dhaka, Bangladesh
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border bg-card px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary"
                            >
                                {social.label}
                            </a>
                        ))}
                    </div>
                </div>
            </Container>

            <div className="border-t">
                <Container className="py-4 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} WedPlan. All rights reserved.
                </Container>
            </div>
        </footer>
    );
}