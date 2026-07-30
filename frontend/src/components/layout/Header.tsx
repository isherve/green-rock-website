"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { NavMegaMenu } from "@/components/layout/NavMegaMenu";
import { MobileNavAccordion } from "@/components/layout/MobileNavAccordion";
import { NAV_LINKS } from "@/lib/nav-data";
import { SITE_CONFIG, LOCALES } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();
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
            <Link href="/employee/login" className="hover:text-secondary transition-colors">Employee Portal</Link>
            <span className="text-white/40">|</span>
            <span>{SITE_CONFIG.address}</span>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-white shadow-sm border-border"
            : "bg-white/95 backdrop-blur-sm border-transparent"
        )}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="container mx-auto flex h-18 items-center justify-between px-4 lg:px-6 relative">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Image
              src={SITE_CONFIG.logo}
              alt={`${SITE_CONFIG.name} logo`}
              width={48}
              height={48}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
              priority
            />
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-foreground leading-tight block font-display">
                Green Rock
              </span>
              <span className="text-xs text-muted-foreground tracking-wide">
                General Supply Ltd
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 relative">
            {NAV_LINKS.map((item) => {
              const hasMega = Boolean(item.mega && item.sections?.length);
              return (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => hasMega && setActiveMega(item.label)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-50 min-w-[180px] rounded-xl border border-border bg-background p-1.5 shadow-xl"
              >
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Language
                </p>
                {LOCALES.map((loc) => (
                  <DropdownMenuItem
                    key={loc.code}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm cursor-pointer outline-none hover:bg-primary/10",
                      locale === loc.code && "bg-primary/10 text-primary font-medium"
                    )}
                    onSelect={() => setLocale(loc.code)}
                  >
                    <span>{loc.flag}</span>
                    {loc.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <select
                      value={locale}
                      onChange={(e) => setLocale(e.target.value as typeof locale)}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                    >
                      {LOCALES.map((loc) => (
                        <option key={loc.code} value={loc.code}>
                          {loc.flag} {loc.label}
                        </option>
                      ))}
                    </select>
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
