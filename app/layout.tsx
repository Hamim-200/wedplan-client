import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const heading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "WedPlan | Wedding Planning Platform",
    template: "%s | WedPlan",
  },
  description:
    "Discover trusted wedding vendors, compare services and send booking requests, all in one place.",
  openGraph: {
    title: "WedPlan | Wedding Planning Platform",
    description:
      "Discover trusted wedding vendors, compare services and send booking requests.",
    siteName: "WedPlan",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#9f3a52",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${heading.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}