
import Link from "next/link";
import {
    Mail,
    MapPin,
    Phone,
    ArrowUpRight,
    Heart,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/shared/Container";
import { SERVICE_CATEGORIES } from "@/lib/constants";

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse Services" },
    { href: "/signin", label: "Sign In" },
    { href: "/signup", label: "Create Account" },
];

const socials = [
    { href: "https://facebook.com", label: "Facebook" },
    { href: "https://instagram.com", label: "Instagram" },
    { href: "https://x.com", label: "X" },
];

export function Footer() {
    return (
        <footer className="mt-auto border-t border-border bg-muted/30">
            <Container>

                <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

                    <div className="space-y-5 lg:pr-8">
                        <Logo />

                        <p className="max-w-xs text-sm leading-7 text-muted-foreground">
                            WedPlan connects couples with trusted wedding vendors,
                            making it easier to plan meaningful celebrations
                            and unforgettable moments.
                        </p>

                        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Heart className="size-3.5 text-rose-500" />
                            Made for your forever moments.
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-semibold tracking-wide">
                            Quick Links
                        </h3>

                        <ul className="space-y-4 text-sm text-muted-foreground">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center gap-1 transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-semibold tracking-wide">
                            Explore Categories
                        </h3>

                        <ul className="space-y-4 text-sm text-muted-foreground">
                            {SERVICE_CATEGORIES.map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/services?category=${encodeURIComponent(category)}`}
                                        className="inline-block transition-colors hover:text-foreground"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-7">
                        <div>
                            <h3 className="mb-6 text-sm font-semibold tracking-wide">
                                Get in Touch
                            </h3>

                            <ul className="space-y-5 text-sm text-muted-foreground">
                                <li className="flex items-center gap-3">
                                    <Mail className="size-4 shrink-0 text-rose-500" />
                                    <a
                                        href="mailto:support@wedplan.com"
                                        className="transition-colors hover:text-foreground"
                                    >
                                        support@wedplan.com
                                    </a>
                                </li>

                                <li className="flex items-center gap-3">
                                    <Phone className="size-4 shrink-0 text-rose-500" />
                                    <a
                                        href="tel:+8801700000000"
                                        className="transition-colors hover:text-foreground"
                                    >
                                        +880 1700 000000
                                    </a>
                                </li>

                                <li className="flex items-center gap-3">
                                    <MapPin className="size-4 shrink-0 text-rose-500" />
                                    <span>Dhaka, Bangladesh</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Follow Us
                            </h4>

                            <div className="flex flex-wrap gap-4">
                                {socials.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-rose-500 hover:underline"
                                    >
                                        {social.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border">
                    <div className="flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row">

                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} WedPlan. All rights reserved.
                        </p>

                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            Crafted with
                            <Heart className="size-3 text-rose-500" />
                            for beautiful beginnings.
                        </p>

                        <p className="text-xs font-medium text-muted-foreground">
                            Your day, your story.
                        </p>

                    </div>
                </div>

            </Container>
        </footer>
    );
}
