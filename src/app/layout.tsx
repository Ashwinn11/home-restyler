import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Home Restyler",
  description:
    "Restyle any room instantly with AI-powered interior design. Upload a photo, pick a style, and transform your space.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-ink text-parchment antialiased grain">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="pt-14 pb-16 sm:pb-0">{children}</main>
            <MobileNav />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
