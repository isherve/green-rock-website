import type { LocaleCode } from "@/lib/constants";
import type { NavItem } from "@/lib/nav-data";
import { NAV_LINKS } from "@/lib/nav-data";
import { translate } from "@/lib/i18n/translations";

export function getLocalizedNav(locale: LocaleCode): NavItem[] {
  return NAV_LINKS.map((item) => localizeNavItem(item, locale));
}

function localizeNavItem(item: NavItem, locale: LocaleCode): NavItem {
  return {
    ...item,
    label: translate(item.labelKey, locale),
    sections: item.sections?.map((section) => ({
      ...section,
      title: translate(section.titleKey, locale),
      items: section.items.map((link) => ({
        ...link,
        label: translate(link.labelKey, locale),
        description: link.descriptionKey
          ? translate(link.descriptionKey, locale)
          : undefined,
        badge: link.badgeKey ? translate(link.badgeKey, locale) : undefined,
      })),
    })),
    featured: item.featured
      ? {
          ...item.featured,
          title: translate(item.featured.titleKey, locale),
          description: translate(item.featured.descriptionKey, locale),
          cta: translate(item.featured.ctaKey, locale),
        }
      : undefined,
  };
}

export function getLocalizedSearchCategories(locale: LocaleCode) {
  return [
    { value: "ALL", label: translate("catAll", locale) },
    { value: "HOUSE", label: translate("catHouse", locale) },
    { value: "APARTMENT", label: translate("catApartment", locale) },
    { value: "COMMERCIAL", label: translate("catCommercial", locale) },
    { value: "LAND", label: translate("catLand", locale) },
    { value: "OFFICE", label: translate("catOffice", locale) },
    { value: "WAREHOUSE", label: translate("catWarehouse", locale) },
  ] as const;
}

export function getLocalizedPriceRanges(locale: LocaleCode) {
  return [
    { value: "ALL", label: translate("priceAny", locale) },
    { value: "0-50000000", label: translate("priceUnder50M", locale) },
    { value: "50000000-150000000", label: translate("price50to150M", locale) },
    { value: "150000000-500000000", label: translate("price150to500M", locale) },
    { value: "500000000+", label: translate("price500MPlus", locale) },
  ] as const;
}
