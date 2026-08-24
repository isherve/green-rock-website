"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/shared/BrandLogo";
import {
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Phone,
  Mail,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavMegaMenu } from "@/components/layout/NavMegaMenu";
import { MobileNavAccordion } from "@/components/layout/MobileNavAccordion";
import { NAV_LINKS } from "@/lib/nav-data";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="hidden lg:block bg-dark text-white text-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              {SITE_CONFIG.phone}
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              {SITE_CONFIG.email}
            </a>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <Link href="/portal/login" className="hover:text-secondary transition-colors">Customer Portal</Link>
            <Link href="/admin/login" className="hover:text-secondary transition-colors">Admin ERP</Link>
            <span className="text-white/40">|</span>
            <span>{SITE_CONFIG.address}</span>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b",
          "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700",
          isScrolled && "shadow-md"
        )}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="container mx-auto flex h-18 items-center justify-between px-4 lg:px-6 relative">
          <BrandLogo />

          <nav className="hidden lg:flex items-center gap-0.5 relative">
            {NAV_LINKS.map((item) => {
              const hasMega = Boolean(item.mega && item.sections?.length);
              return (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => hasMega && setActiveMega(item.label)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      "text-slate-800 dark:text-slate-100 hover:text-primary",
                      activeMega === item.label && "text-primary"
                    )}
                  >
                    {item.label}
                    {hasMega && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 opacity-60 transition-transform",
                          activeMega === item.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>
                </div>
              );
            })}

          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
              <Link href="/search" aria-label="Search site">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button asChild className="hidden md:inline-flex rounded-lg">
              <Link href="/properties">Search Property</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <NavMegaMenu
          item={NAV_LINKS.find((n) => n.label === activeMega) ?? null}
          isOpen={Boolean(activeMega)}
          onClose={() => setActiveMega(null)}
        />

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="container mx-auto px-2 py-4">
                <MobileNavAccordion
                  items={NAV_LINKS}
                  onNavigate={() => setMobileOpen(false)}
                />
                <div className="pt-4 px-4 space-y-3 border-t border-border mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Portals</p>
                  <div className="grid grid-cols-1 gap-2">
                    <Button asChild variant="outline" className="w-full rounded-lg justify-start">
                      <Link href="/search" onClick={() => setMobileOpen(false)}>
                        <Search className="w-4 h-4 mr-2" /> Search Site
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full rounded-lg justify-start">
                      <Link href="/portal/login" onClick={() => setMobileOpen(false)}>Customer Portal</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full rounded-lg justify-start">
                      <Link href="/admin/login" onClick={() => setMobileOpen(false)}>Admin ERP</Link>
                    </Button>
                  </div>
                  <Button asChild className="w-full rounded-lg">
                    <Link href="/properties" onClick={() => setMobileOpen(false)}>
                      Search Property
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
