/** Curated Unsplash photos for each service slug */
export const SERVICE_IMAGES: Record<string, string> = {
  construction:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
  "residential-construction":
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "commercial-construction":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "real-estate":
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  "property-sales":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "property-rentals":
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "building-materials":
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
  architecture:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  "interior-design":
    "https://images.unsplash.com/photo-1618221193310-864a156e3944?auto=format&fit=crop&w=800&q=80",
  "project-management":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  painting:
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
  timber:
    "https://images.unsplash.com/photo-1513828583688-c52645db1e51?auto=format&fit=crop&w=800&q=80",
  default:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
};

export function getServiceImage(service: { slug: string; image?: string | null }): string {
  const url = service.image?.trim();
  if (url) return url;
  return SERVICE_IMAGES[service.slug] ?? SERVICE_IMAGES.default;
}
