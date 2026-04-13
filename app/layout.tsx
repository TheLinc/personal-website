import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Onest } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const BASE_URL = "https://lincolnlaylor.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: "Lincoln Laylor — Full Stack Developer",
  description:
    "Full-stack developer with 4+ years shipping production software at startups and government agencies. Specialising in React, Next.js, TypeScript, Node.js, and React Native.",

  keywords: [
    "Lincoln Laylor",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "React Native",
    "Software Engineer Canada",
    "Frontend Developer",
  ],
  authors: [{ name: "Lincoln Laylor", url: BASE_URL }],
  creator: "Lincoln Laylor",

  /* ── OpenGraph ── */
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: BASE_URL,
    siteName: "Lincoln Laylor",
    title: "Lincoln Laylor — Full Stack Developer",
    description:
      "Full-stack developer with 4+ years building fast, accessible web and mobile applications.",
    images: [
      {
        url: "/opengraph-image",   // served by app/opengraph-image.tsx
        width: 1200,
        height: 630,
        alt: "Lincoln Laylor — Full Stack Developer",
      },
    ],
  },

  /* ── Twitter / X ── */
  twitter: {
    card: "summary_large_image",
    title: "Lincoln Laylor — Full Stack Developer",
    description:
      "Full-stack developer with 4+ years building fast, accessible web and mobile applications.",
    images: ["/opengraph-image"],
  },

  /* ── Crawl directives ── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Alternate / canonical ── */
  alternates: {
    canonical: BASE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lincoln Laylor",
  url: "https://lincolnlaylor.com",
  jobTitle: "Full Stack Developer",
  description:
    "Full-stack developer with 4+ years building fast, accessible web and mobile applications.",
  sameAs: [
    "https://github.com/TheLinc",
    "https://www.linkedin.com/in/lincolnlaylor/",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "React Native",
    "Python",
    "AWS",
    "Docker",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${bricolage.variable} ${jetbrainsMono.variable} ${onest.variable}`}
      >
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
