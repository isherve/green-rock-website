"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Tag, Key, Layers, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLocalizedSearchCategories, getLocalizedPriceRanges } from "@/lib/i18n/nav";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

interface PropertySearchBarProps {
  className?: string;
  variant?: "hero" | "compact";
  defaultLocation?: string;
  defaultPurpose?: string;
  defaultType?: string;
  defaultPrice?: string;
}

export function PropertySearchBar({
  className,
  variant = "hero",
  defaultLocation = "",
  defaultPurpose = "ALL",
  defaultType = "ALL",
  defaultPrice = "ALL",
}: PropertySearchBarProps) {
  const router = useRouter();
  const { locale, t } = useLocale();
  const categories = useMemo(() => getLocalizedSearchCategories(locale), [locale]);
  const priceRanges = useMemo(() => getLocalizedPriceRanges(locale), [locale]);
  const [tab, setTab] = useState<"SALE" | "RENT">(
    defaultPurpose === "RENT" ? "RENT" : "SALE"
  );
  const [location, setLocation] = useState(defaultLocation);
  const [purpose, setPurpose] = useState(defaultPurpose);
  const [type, setType] = useState(defaultType);
  const [price, setPrice] = useState(defaultPrice);

  useEffect(() => {
    setLocation(defaultLocation);
    setPurpose(defaultPurpose);
    setType(defaultType);
    setPrice(defaultPrice);
    if (defaultPurpose === "RENT") setTab("RENT");
    else if (defaultPurpose === "SALE") setTab("SALE");
  }, [defaultLocation, defaultPurpose, defaultType, defaultPrice]);

  function handleTabChange(next: "SALE" | "RENT") {
    setTab(next);
    setPurpose(next);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    if (purpose !== "ALL") params.set("purpose", purpose);
    if (type !== "ALL") params.set("type", type);
    if (price !== "ALL") params.set("price", price);
    router.push(`/properties${params.toString() ? `?${params}` : ""}`);
  }

  const fieldClass =
    "border-0 shadow-none h-11 rounded-none bg-transparent focus-visible:ring-0 text-sm";

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "pro-card overflow-hidden",
        variant === "hero" && "shadow-2xl border-white/20 bg-white",
        className
      )}
    >
      <div className="flex border-b border-border bg-accent/30">
        <button
          type="button"
          onClick={() => handleTabChange("SALE")}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px",
            tab === "SALE"
              ? "border-primary text-primary bg-white"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Tag className="h-4 w-4" />
          {t("searchBuy")}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("RENT")}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px",
            tab === "RENT"
              ? "border-primary text-primary bg-white"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Key className="h-4 w-4" />
          {t("searchRent")}
        </button>
      </div>

      <div className="p-2 md:p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_auto] gap-2 md:gap-0 md:items-stretch md:divide-x divide-border">
          <div className="flex items-center gap-2 px-3 rounded-lg md:rounded-none border border-border md:border-0">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <Input
              placeholder={t("searchLocationPlaceholder")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={cn(fieldClass, "h-11")}
            />
          </div>

          <div className="rounded-lg md:rounded-none border border-border md:border-0 px-1">
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger className={cn(fieldClass, "gap-2")}>
                <Tag className="h-3.5 w-3.5 text-primary shrink-0" />
                <SelectValue placeholder={t("searchPropertyStatus")} />
              </SelectTrigger>
              <SelectContent className="min-w-[220px]">
                <SelectGroup>
                  <SelectLabel className="text-[10px] uppercase tracking-widest text-primary pl-8 pr-2 py-2">
                    {t("searchPropertyStatus")}
                  </SelectLabel>
                  <SelectItem value="ALL">{t("searchAllStatuses")}</SelectItem>
                  <SelectItem value="SALE">{t("searchForSale")}</SelectItem>
                  <SelectItem value="RENT">{t("searchForRent")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg md:rounded-none border border-border md:border-0 px-1">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className={cn(fieldClass, "gap-2")}>
                <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                <SelectValue placeholder={t("searchPropertyCategory")} />
              </SelectTrigger>
              <SelectContent className="min-w-[260px]">
                <SelectGroup>
                  <SelectLabel className="text-[10px] uppercase tracking-widest text-primary pl-8 pr-2 py-2">
                    {t("searchPropertyCategory")}
                  </SelectLabel>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg md:rounded-none border border-border md:border-0 px-1">
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className={cn(fieldClass, "gap-2")}>
                <DollarSign className="h-3.5 w-3.5 text-primary shrink-0" />
                <SelectValue placeholder={t("searchPriceRange")} />
              </SelectTrigger>
              <SelectContent className="min-w-[220px]">
                <SelectGroup>
                  <SelectLabel className="text-[10px] uppercase tracking-widest text-primary pl-8 pr-2 py-2">
                    {t("searchPriceRange")}
                  </SelectLabel>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 md:px-8 rounded-lg shrink-0 w-full md:w-auto"
          >
            <Search className="w-4 h-4" />
            {t("searchProperty")}
          </Button>
        </div>
      </div>
    </form>
  );
}
