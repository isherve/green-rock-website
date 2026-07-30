"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPortal = pathname?.startsWith("/portal") || pathname?.startsWith("/employee");

  if (isAdmin || isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
      <WhatsAppButton />
    </>
  );
}
