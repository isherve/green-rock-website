"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav-data";
import { useLocale } from "@/hooks/useLocale";

interface MobileNavAccordionProps {
  items: NavItem[];
  onNavigate: () => void;
}

export function MobileNavAccordion({ items, onNavigate }: MobileNavAccordionProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <MobileNavItem key={item.href} item={item} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function MobileNavItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const { t } = useLocale();
  const hasMega = Boolean(item.sections?.length);

  if (!hasMega) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="block px-4 py-3 rounded-lg font-medium text-slate-800 dark:text-slate-100 hover:bg-primary/10 hover:text-primary transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <details className="group rounded-lg overflow-hidden">
      <summary className="flex items-center justify-between px-4 py-3 font-medium text-slate-800 dark:text-slate-100 cursor-pointer list-none hover:bg-primary/10 hover:text-primary transition-colors [&::-webkit-details-marker]:hidden">
        <span>{item.label}</span>
        <ChevronDown className="h-4 w-4 opacity-60 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="pb-2 px-2 bg-accent/40">
        {item.sections!.map((section) => (
          <div key={section.title} className="pt-2">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
              {section.title}
            </p>
            {section.items.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={onNavigate}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white transition-colors"
                >
                  {Icon && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="font-medium block">{link.label}</span>
                    {link.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {link.description}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </div>
        ))}
        <Link
          href={item.href}
          onClick={onNavigate}
          className="block mx-3 mt-2 mb-1 text-center text-sm font-semibold text-primary py-2"
        >
          {t("viewAll")} {item.label?.toLowerCase()}
        </Link>
      </div>
    </details>
  );
}
