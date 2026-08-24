"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { LOCALES, type LocaleCode } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { translate } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type LanguageSwitcherProps = {
  variant?: "header" | "pills" | "compact" | "icon";
  surface?: "dark" | "light";
  className?: string;
};

export function LanguageSwitcher({
  variant = "pills",
  surface = "dark",
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  if (variant === "icon") {
    const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

    return (
      <div ref={ref} className={cn("relative", className)}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          aria-label={translate("footerLanguage", locale)}
          aria-expanded={open}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          <Globe className="h-4 w-4" />
        </Button>

        {open && (
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[168px] rounded-xl border border-border bg-background shadow-xl p-1.5 animate-in fade-in slide-in-from-top-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
              {translate("footerLanguage", locale)}
            </p>
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                type="button"
                onClick={() => {
                  setLocale(loc.code as LocaleCode);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  locale === loc.code
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <span>
                  {loc.flag} {loc.label}
                </span>
                {locale === loc.code && <Check className="h-4 w-4 shrink-0" />}
              </button>
            ))}
            <p className="px-3 py-1 text-[10px] text-muted-foreground border-t border-border mt-1 pt-2">
              {current.flag} {current.label}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (variant === "pills") {
    const onLight = surface === "light";
    return (
      <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2", className)}>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0",
            onLight ? "text-primary" : "text-secondary"
          )}
        >
          <Globe className="h-3.5 w-3.5" />
          {translate("footerLanguage", locale)}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => setLocale(loc.code as LocaleCode)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all border whitespace-nowrap",
                locale === loc.code
                  ? "bg-secondary text-dark border-secondary"
                  : onLight
                    ? "bg-muted text-foreground/80 border-border hover:bg-muted/80"
                    : "bg-white/5 text-white/70 border-white/15 hover:bg-white/10 hover:text-white"
              )}
            >
              {loc.flag} {loc.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className={cn(
          "rounded-lg border border-border bg-background px-2 py-2 text-sm min-w-[130px]",
          className
        )}
        aria-label={translate("footerLanguage", locale)}
      >
        {LOCALES.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.flag} {loc.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-8 py-2 text-sm font-medium cursor-pointer hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[140px]"
        aria-label={translate("footerLanguage", locale)}
      >
        {LOCALES.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.flag} {loc.label}
          </option>
        ))}
      </select>
      <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
