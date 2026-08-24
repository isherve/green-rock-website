"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AnimatedPageShell } from "@/components/motion/AnimatedPageShell";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPortal = pathname?.startsWith("/portal");

  if (isAdmin || isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <AnimatedPageShell>{children}</AnimatedPageShell>
      <Footer />
      <CookieConsent />
    </>
  );
}
