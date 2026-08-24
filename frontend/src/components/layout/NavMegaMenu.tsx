"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav-data";
import { useLocale } from "@/hooks/useLocale";

interface NavMegaMenuProps {
  item: NavItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NavMegaMenu({ item, isOpen, onClose }: NavMegaMenuProps) {
  const { t } = useLocale();
  if (!item?.sections?.length) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[calc(4.5rem+2.5rem)] bg-dark/20 z-40 lg:block hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="absolute left-0 right-0 top-full z-50 hidden lg:block border-b border-slate-200 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-900"
            onMouseLeave={onClose}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid lg:grid-cols-[1fr_260px] gap-8">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
                  {item.sections.map((section) => (
                    <div key={section.title}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4 pb-2 border-b-2 border-primary/20">
                        {section.title}
                      </p>
                      <ul className="space-y-0.5">
                        {section.items.map((link) => {
                          const Icon = link.icon;
                          return (
                            <li key={link.href + link.label}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                className="group flex items-start gap-3 rounded-lg px-2 py-2 -mx-2 hover:bg-accent transition-colors"
                              >
                                {Icon && (
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                )}
                                <span className="min-w-0 flex-1 pt-0.5">
                                  <span className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-sm group-hover:text-primary transition-colors">
                                      {link.label}
                                    </span>
                                    {link.badge && (
                                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary/25 text-foreground">
                                        {link.badge}
                                      </span>
                                    )}
                                  </span>
                                  {link.description && (
                                    <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                      {link.description}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                {item.featured && (
                  <div className="relative rounded-xl overflow-hidden bg-dark text-white min-h-[240px]">
                    <Image
                      src={item.featured.image}
                      alt=""
                      fill
                      className="object-cover opacity-40"
                      sizes="260px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/85 to-dark/50 p-6 flex flex-col justify-end">
                      <p className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                        Green Rock
                      </p>
                      <h3 className="font-display text-xl font-semibold leading-snug mb-2">
                        {item.featured.title}
                      </h3>
                      <p className="text-sm text-white/75 leading-relaxed mb-5">
                        {item.featured.description}
                      </p>
                      <Link
                        href={item.featured.href}
                        onClick={onClose}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5",
                          "text-sm font-semibold text-white hover:bg-primary/90 transition-colors w-fit"
                        )}
                      >
                        {item.featured.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                >
                  {t("viewAll")} {item.label?.toLowerCase()}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {t("heroEyebrow")}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
