import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import { Providers } from "@/providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.shortName}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "construction",
    "real estate",
    "building materials",
    "architecture",
    "house drawings",
    "quotation",
    "Rwanda",
    "Kigali",
    "Green Rock",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  icons: {
    icon: SITE_CONFIG.logo,
    apple: SITE_CONFIG.logo,
  },
  openGraph: {
    type: "website",
    locale: "en_RW",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
