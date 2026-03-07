import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

const pageTitle = "HomeRestyler | All-in-One AI Spatial Studio";
const pageDescription =
  "Experience the limitless potential of HomeRestyler. The professional AI spatial studio for virtual staging, interior redesign, and paint visualization. photoreal results in seconds.";

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
    siteName: "HomeRestyler",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "homerestyler AI room design app",
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
  name: "HomeRestyler",
  url: absoluteUrl("/"),
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  description: pageDescription,
  publisher: {
    "@type": "Organization",
    name: "HomeRestyler",
    url: absoluteUrl("/"),
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI virtual staging for real estate",
    "Paint color visualization",
    "Architectural spatial redesign",
    "Professional-grade photoreal renders",
    "Before/after comparison",
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HomeRestyler",
  url: absoluteUrl("/"),
  description: pageDescription,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HomeRestyler",
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
