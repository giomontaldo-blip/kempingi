import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { organizationSchema, websiteSchema } from "../lib/schema";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kempingi.com"),
  title: {
    default: "kempingi.com – Najlepsze kempingi w Polsce",
    template: "%s | kempingi.com",
  },
  description: "Największa baza kempingów w Polsce. Znajdź idealny kemping – nad jeziorem, w górach, nad morzem.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://kempingi.com",
    siteName: "kempingi.com",
    title: "kempingi.com – Najlepsze kempingi w Polsce",
    description: "Największa baza kempingów w Polsce.",
  },
  alternates: { canonical: "https://kempingi.com" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1D9E75",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema(), websiteSchema()]) }}
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-700 focus:text-white focus:rounded-lg focus:text-sm">
          Przejdź do treści
        </a>
        {children}
      </body>
    </html>
  );
}
