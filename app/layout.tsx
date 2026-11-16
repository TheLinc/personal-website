import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/components/site/site.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

const BASE_URL = "https://lincolnlaylor.com";

export const viewport: Viewport = { themeColor: "#fbfaf7" };

const TITLE = "Lincoln Laylor — Full-Stack Engineer, Agentic AI Tooling";
const DESCRIPTION =
  "Full-stack engineer leading AI integrations at Opinion System, building Cover Me. I build AI products and the agent workflows that ship them.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Lincoln Laylor",
    "Full Stack Engineer",
    "AI Engineer",
    "Claude Agent SDK",
    "MCP",
    "Next.js",
    "TypeScript",
    "Software Engineer Canada",
  ],
  authors: [{ name: "Lincoln Laylor", url: BASE_URL }],
  creator: "Lincoln Laylor",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: BASE_URL,
    siteName: "Lincoln Laylor",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: BASE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lincoln Laylor",
  url: BASE_URL,
  jobTitle: "Full-Stack Engineer",
  description: DESCRIPTION,
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Ottawa" },
  sameAs: ["https://github.com/TheLinc", "https://www.linkedin.com/in/lincolnlaylor/"],
  knowsAbout: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Claude Agent SDK",
    "Model Context Protocol",
    "LLM evaluation",
    "Supabase",
    "PostgreSQL",
    "Electron",
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
        className={`${archivo.variable} ${plex.variable} ${jetbrains.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
