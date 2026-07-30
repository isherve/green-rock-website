import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pages = ["", "/about", "/services", "/projects", "/properties", "/materials", "/gallery", "/blog", "/careers", "/testimonials", "/contact", "/privacy", "/terms"];
  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
}
