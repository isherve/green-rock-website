export type ContentLocale = 'en' | 'fr' | 'rw';

export function parseContentLocale(value: unknown): ContentLocale {
  if (value === 'fr' || value === 'rw') return value;
  return 'en';
}

type Localizable = Record<string, unknown>;

function pickField(item: Localizable, field: string, locale: ContentLocale): string {
  if (locale === 'en') return String(item[field] ?? '');
  const suffix = locale === 'fr' ? 'Fr' : 'Rw';
  const translated = item[`${field}${suffix}`];
  return translated ? String(translated) : String(item[field] ?? '');
}

export function localizeProperty<T extends Localizable>(item: T, locale: ContentLocale): T {
  return {
    ...item,
    title: pickField(item, 'title', locale),
    description: pickField(item, 'description', locale),
  } as T;
}

export function localizeService<T extends Localizable>(item: T, locale: ContentLocale): T {
  const localized = {
    ...item,
    title: pickField(item, 'title', locale),
    description: pickField(item, 'description', locale),
  } as T;

  if (Array.isArray(item.children)) {
    (localized as Localizable).children = (item.children as Localizable[]).map((child) =>
      localizeService(child, locale)
    );
  }
  if (item.parent && typeof item.parent === 'object') {
    (localized as Localizable).parent = localizeService(item.parent as Localizable, locale);
  }

  return localized;
}

export function localizeBlog<T extends Localizable>(item: T, locale: ContentLocale): T {
  return {
    ...item,
    title: pickField(item, 'title', locale),
    excerpt: pickField(item, 'excerpt', locale),
    content: pickField(item, 'content', locale),
  } as T;
}

export function localizeProject<T extends Localizable>(item: T, locale: ContentLocale): T {
  return {
    ...item,
    title: pickField(item, 'title', locale),
    description: pickField(item, 'description', locale),
  } as T;
}

export function localizeProduct<T extends Localizable>(item: T, locale: ContentLocale): T {
  const localized = {
    ...item,
    name: pickField(item, 'name', locale),
    description: pickField(item, 'description', locale),
  } as T;

  if (item.category && typeof item.category === 'object') {
    const category = item.category as Localizable;
    (localized as Localizable).category = {
      ...category,
      name: pickField(category, 'name', locale),
    };
  }

  return localized;
}

export function localizeList<T extends Localizable>(
  items: T[],
  locale: ContentLocale,
  localize: (item: T, locale: ContentLocale) => T
): T[] {
  return items.map((item) => localize(item, locale));
}

/** Build Prisma OR conditions that search across all language variants */
export function multilingualSearch(fields: string[], query: string) {
  const searchMode = { contains: query, mode: 'insensitive' as const };
  const conditions: Record<string, unknown>[] = [];

  for (const field of fields) {
    conditions.push({ [field]: searchMode });
    conditions.push({ [`${field}Fr`]: searchMode });
    conditions.push({ [`${field}Rw`]: searchMode });
  }

  return conditions;
}
