import type { LocaleCode } from "@/lib/constants";

function pickField(item: object, field: string, locale: LocaleCode): string {
  const record = item as Record<string, string | null | undefined>;
  if (locale === "en") return String(record[field] ?? "");
  const suffix = locale === "fr" ? "Fr" : "Rw";
  const translated = record[`${field}${suffix}`];
  return translated ? String(translated) : String(record[field] ?? "");
}

export function localizeProperty<
  T extends {
    title: string;
    description: string;
    titleFr?: string | null;
    titleRw?: string | null;
    descriptionFr?: string | null;
    descriptionRw?: string | null;
  },
>(item: T, locale: LocaleCode): T {
  return {
    ...item,
    title: pickField(item, "title", locale),
    description: pickField(item, "description", locale),
  };
}

export function localizeService<
  T extends {
    title: string;
    description: string;
    titleFr?: string | null;
    titleRw?: string | null;
    descriptionFr?: string | null;
    descriptionRw?: string | null;
  },
>(item: T, locale: LocaleCode): T {
  return {
    ...item,
    title: pickField(item, "title", locale),
    description: pickField(item, "description", locale),
  };
}

export function localizeBlog<
  T extends {
    title: string;
    excerpt: string;
    content?: string;
    titleFr?: string | null;
    titleRw?: string | null;
    excerptFr?: string | null;
    excerptRw?: string | null;
    contentFr?: string | null;
    contentRw?: string | null;
  },
>(item: T, locale: LocaleCode): T {
  return {
    ...item,
    title: pickField(item, "title", locale),
    excerpt: pickField(item, "excerpt", locale),
    ...(item.content !== undefined && { content: pickField(item, "content", locale) }),
  };
}

export function localizeProject<
  T extends {
    title: string;
    description: string;
    titleFr?: string | null;
    titleRw?: string | null;
    descriptionFr?: string | null;
    descriptionRw?: string | null;
  },
>(item: T, locale: LocaleCode): T {
  return {
    ...item,
    title: pickField(item, "title", locale),
    description: pickField(item, "description", locale),
  };
}

export function localizeProduct<
  T extends {
    name: string;
    description: string;
    nameFr?: string | null;
    nameRw?: string | null;
    descriptionFr?: string | null;
    descriptionRw?: string | null;
    category?: { name: string; nameFr?: string | null; nameRw?: string | null } | null;
  },
>(item: T, locale: LocaleCode): T {
  const localized = {
    ...item,
    name: pickField(item, "name", locale),
    description: pickField(item, "description", locale),
  } as T;

  if (item.category) {
    return {
      ...localized,
      category: {
        ...item.category,
        name: pickField(item.category, "name", locale),
      },
    } as T;
  }

  return localized;
}
