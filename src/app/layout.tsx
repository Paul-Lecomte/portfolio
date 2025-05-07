import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Desktop from "@/components/Desktop";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Custom OS Portfolio",
    description: "A creative portfolio designed to resemble an interactive operating system interface.",
    keywords: ["portfolio", "operating system", "design", "interactive", "UI", "UX", "web design", "react", "next.js"],
    author: "Paul Lecomte",
    openGraph: {
        title: "Custom OS Portfolio",
        description: "A portfolio designed like an operating system, showcasing creative UI and web development skills.",
        type: "website",
        url: "https://your-portfolio-url.com", // Replace with the actual URL
        siteName: "Custom OS Portfolio",
        images: [
            {
                url: "/images/og-image.png", // Replace with the actual image path for a preview
                width: 1200,
                height: 630,
                alt: "Portfolio Thumbnail",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@yourtwitterhandle", // Replace with your Twitter handle
        creator: "@yourtwitterhandle", // Replace with your Twitter handle
        title: "Custom OS Portfolio",
        description: "A portfolio designed like an operating system, showcasing creative UI and web development skills.",
        image: "/images/og-image.png", // Replace with the actual image path for a preview
    },
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1.0",
    themeColor: "#00116a", // Set a theme color for the browser header
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Desktop (Main Area) */}
        <Desktop />
        </body>
        </html>
    );
}