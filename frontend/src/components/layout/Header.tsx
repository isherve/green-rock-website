"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Menu, X, ChevronDown, Sun, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavMegaMenu } from "@/components/layout/NavMegaMenu";
import { MobileNavAccordion } from "@/components/layout/MobileNavAccordion";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale } from "@/hooks/useLocale";
import { getLocalizedNav } from "@/lib/i18n/nav";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { locale, t } = useLocale();
  const navLinks = useMemo(() => getLocalizedNav(locale), [locale]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b bg-white/95 dark:bg-slate-950/95 backdrop-blur-md",
          isScrolled ? "border-border shadow-sm" : "border-transparent"
        )}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="container mx-auto flex h-16 lg:h-[4.25rem] items-center justify-between px-4 lg:px-6 relative">
          <BrandLogo />

          <nav className="hidden lg:flex items-center gap-1 relative">
            {navLinks.map((item) => {
              const hasMega = Boolean(item.mega && item.sections?.length);
              return (
                <div key={item.labelKey}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => hasMega && setActiveMega(item.labelKey)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                      "text-foreground/80 hover:text-primary hover:bg-primary/5",
                      activeMega === item.labelKey && "text-primary bg-primary/5"
                    )}
                  >
                    {item.label}
                    {hasMega && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 opacity-50 transition-transform",
                          activeMega === item.labelKey && "rotate-180"
                        )}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher variant="icon" />

            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full" asChild>
              <Link href="/search" aria-label="Search site">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            <Button asChild className="hidden md:inline-flex rounded-full px-5">
              <Link href="/contact">Get Started</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <NavMegaMenu
          item={navLinks.find((n) => n.labelKey === activeMega) ?? null}
          isOpen={Boolean(activeMega)}
          onClose={() => setActiveMega(null)}
        />

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border overflow-hidden max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-950"
            >
              <div className="container mx-auto px-2 py-4">
                <MobileNavAccordion items={navLinks} onNavigate={() => setMobileOpen(false)} />
                <div className="pt-4 px-4 space-y-3 border-t border-border mt-3">
                  <Button asChild className="w-full rounded-full">
                    <Link href="/contact" onClick={() => setMobileOpen(false)}>Get Started</Link>
                  </Button>
                  <div className="grid grid-cols-1 gap-2">
                    <Button asChild variant="outline" className="w-full rounded-full justify-start">
                      <Link href="/portal/login" onClick={() => setMobileOpen(false)}>{t("customerPortal")}</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full rounded-full justify-start">
                      <Link href="/admin/login" onClick={() => setMobileOpen(false)}>{t("adminPortal")}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
