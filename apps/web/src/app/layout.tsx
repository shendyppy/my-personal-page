import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "./providers/ThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { TopProgressBar } from "@/components/atoms/TopProgressBar";
import { EXTERNAL_LINKS, SITE_CONFIG } from "@/constants/config";
import "./globals.css";

// Editorial type system for the revamp:
// Syne — display headlines, Space Grotesk — body, Space Mono — terminal/labels.
const fontDisplay = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fontBody = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fontMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
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

// Pre-paint theme + accent init. Runs synchronously as the first thing in
// <body> so the correct `.dark` class and `--accent` value are set before the
// first paint — no FOUC. Defaults match ThemeProvider (dark theme, lime
// accent). The accent map is inlined (can't import TS pre-paint) and must be
// kept in sync with ACCENTS in src/constants/config.ts.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';var d=document.documentElement;if(t==='dark'){d.classList.add('dark')}else{d.classList.remove('dark')}var a=localStorage.getItem('accent')||'lime';var m={lime:{dark:'#D7FF3E',light:'#4D7A00'},orange:{dark:'#FF6B35',light:'#D9531E'},violet:{dark:'#7C6CFF',light:'#5A48E0'},teal:{dark:'#3EE0C8',light:'#0E9C86'}};var v=(m[a]&&m[a][t])||m.lime[t];d.style.setProperty('--accent',v)}catch(e){}})();`;

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
  // `suppressHydrationWarning` on <html>: the pre-paint themeInitScript mutates
  // <html>'s class + --accent before hydration, so the server ("<html lang='en'>")
  // and client differ. This is the documented Next.js pattern for theme scripts —
  // React skips the attribute warning for this element only; children still
  // reconcile normally.
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} font-body antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
