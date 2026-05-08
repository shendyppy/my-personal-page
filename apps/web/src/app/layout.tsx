import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "./providers/ThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { TopProgressBar } from "@/components/atoms/TopProgressBar";
import { EXTERNAL_LINKS, SITE_CONFIG } from "@/constants/config";
import "./globals.css";

const geistOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const title = `${SITE_CONFIG.author} | Software Engineer`;
const description =
  "A personal space to sharpen my skills while exploring and experimenting with new tech stacks I haven't tried before — featuring projects, experiences, and an interactive 3D skills viewer.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: title,
    template: `%s | ${SITE_CONFIG.author}`,
  },
  description,
  applicationName: SITE_CONFIG.title,
  authors: [{ name: SITE_CONFIG.author, url: EXTERNAL_LINKS.linkedin }],
  creator: SITE_CONFIG.author,
  keywords: [
    "Shendy Putra Perdana Yohansah",
    "Shendy Yohansah",
    "Software Engineer",
    "Front-End Developer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Three.js",
    "Portfolio",
    "Indonesia",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.title,
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@shendyppy",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_CONFIG.author,
  alternateName: "Shenks",
  url: SITE_CONFIG.url,
  image: `${SITE_CONFIG.url}${SITE_CONFIG.profileImage}`,
  jobTitle: "Software Engineer",
  description,
  email: `mailto:${EXTERNAL_LINKS.email}`,
  sameAs: [
    EXTERNAL_LINKS.github,
    EXTERNAL_LINKS.linkedin,
    EXTERNAL_LINKS.instagram,
    EXTERNAL_LINKS.twitter,
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Three.js",
    "Node.js",
    "PostgreSQL",
    "Prisma",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistOutfit.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded-md"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <QueryProvider>
          <ThemeProvider>
            <TopProgressBar />
            {children}
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
