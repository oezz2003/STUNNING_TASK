import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Idea Forge | Transform Ideas into Website Blueprints",
  description:
    "An AI-powered idea refinement tool that transforms your raw concepts into professional website blueprints with detailed sitemaps, visual identity, and tech stack recommendations.",
  keywords: [
    "AI",
    "website planning",
    "blueprint",
    "idea generator",
    "product design",
    "UX strategy",
  ],
  authors: [{ name: "Ezzeldeen", url: "https://github.com/oezz2003" }],
  openGraph: {
    title: "Idea Forge | Transform Ideas into Website Blueprints",
    description:
      "Transform your raw concepts into professional website blueprints powered by AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Idea Forge",
    description: "AI-powered idea refinement for website blueprints",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
