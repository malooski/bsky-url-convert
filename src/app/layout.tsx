import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
    title: "ATProto to Bluesky",
    description: "Redirect ATProto URLs to Bluesky URLs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-background">{children}</body>
        </html>
    );
}
