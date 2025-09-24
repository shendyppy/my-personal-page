import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "./providers/ThemeProvider";
import "./globals.css";

const geistOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shendy Putra P. Y. | Software Engineer",
  description:
    "A personal space to sharpen my skills while exploring and experimenting with new tech stacks I haven’t tried before",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistOutfit.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
