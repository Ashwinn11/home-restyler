import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

const pageTitle = "AI Room Design & Interior Redesign | Home Restyler";
const pageDescription =
  "Transform any room with AI-powered interior design. Upload a photo, choose from 20+ design styles, visualize wall paint colors, and download your redesigned room in minutes. Free to try.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "AI room design",
    "AI interior design",
    "room redesign AI",
    "room interior design app",
    "virtual room makeover",
    "home restyler",
    "paint color visualizer",
    "interior design generator",
    "room design from photo",
    "AI home design",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/"),
    siteName: "Home Restyler",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Home Restyler AI room design app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [absoluteUrl("/twitter-image")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does a redesign take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most generations complete in under a minute, and refinements are typically faster because they build on the current result.",
      },
    },
    {
      "@type": "Question",
      name: "Can I change only wall paint?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Paint mode isolates wall color updates while preserving room layout and furniture.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export results for clients or social posts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Download generated images anytime and use variation outputs for mood boards, client decks, and marketing content.",
      },
    },
  ],
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Home Restyler",
  url: absoluteUrl("/"),
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  description: pageDescription,
  publisher: {
    "@type": "Organization",
    name: "Home Restyler",
    url: absoluteUrl("/"),
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI room restyling from photo",
    "Wall paint color visualization",
    "Chat-based image refinement",
    "Variation generation",
    "Before/after comparison",
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Home Restyler",
  url: absoluteUrl("/"),
  description: pageDescription,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Home Restyler",
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icon.png"),
  sameAs: [],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomeClient />
    </>
  );
}
