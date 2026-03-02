import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

const pageTitle = "Room Restyler | AI Interior Design & Virtual Room Makeovers";
const pageDescription =
  "Restyle any room from one photo. Generate interior design concepts, test paint colors, refine with chat, and export presentation-ready visuals in minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "room restyler",
    "ai interior design",
    "virtual room makeover",
    "room design generator",
    "ai room redesign",
    "paint color visualizer",
    "interior design app",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/"),
    siteName: "Room Restyler",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Room Restyler AI interior design app",
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
  name: "Room Restyler",
  url: absoluteUrl("/"),
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  description: pageDescription,
  publisher: {
    "@type": "Organization",
    name: "Room Restyler",
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
  name: "Room Restyler",
  url: absoluteUrl("/"),
  description: pageDescription,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Room Restyler",
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
