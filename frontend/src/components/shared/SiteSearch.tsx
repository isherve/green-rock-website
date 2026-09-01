"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useLocale } from "@/hooks/useLocale";

type SearchResults = {
  properties: { slug: string; title: string; location: string }[];
  projects: { slug: string; title: string; location: string }[];
  products: { slug: string; name: string }[];
  blogPosts: { slug: string; title: string }[];
};

export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);

  const runSearch = async (q: string) => {
    if (q.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/search", { params: { q: q.trim(), limit: 5, locale } });
      setResults(res.data.data);
      setOpen(true);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const total =
    (results?.properties.length ?? 0) +
    (results?.projects.length ?? 0) +
    (results?.products.length ?? 0) +
    (results?.blogPosts.length ?? 0);

  return (
    <div className="relative">
      <form
        className={compact ? "flex gap-2" : "flex gap-2 max-w-xl mx-auto"}
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim().length >= 2) {
            window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
          }
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              void runSearch(e.target.value);
            }}
            onFocus={() => results && setOpen(true)}
            placeholder="Search properties, projects, materials…"
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={loading || query.trim().length < 2}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {open && results && total > 0 && compact && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-xl z-50 p-3 max-h-80 overflow-y-auto">
          {results.properties.map((p) => (
            <Link key={p.slug} href={`/properties/${p.slug}`} className="block px-3 py-2 text-sm hover:bg-accent rounded-lg" onClick={() => setOpen(false)}>
              <span className="text-xs text-primary font-medium">Property</span> {p.title}
            </Link>
          ))}
          {results.projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="block px-3 py-2 text-sm hover:bg-accent rounded-lg" onClick={() => setOpen(false)}>
              <span className="text-xs text-primary font-medium">Project</span> {p.title}
            </Link>
          ))}
          {results.products.map((p) => (
            <Link key={p.slug} href={`/materials/${p.slug}`} className="block px-3 py-2 text-sm hover:bg-accent rounded-lg" onClick={() => setOpen(false)}>
              <span className="text-xs text-primary font-medium">Material</span> {p.name}
            </Link>
          ))}
          {results.blogPosts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block px-3 py-2 text-sm hover:bg-accent rounded-lg" onClick={() => setOpen(false)}>
              <span className="text-xs text-primary font-medium">Blog</span> {p.title}
            </Link>
          ))}
          <Link href={`/search?q=${encodeURIComponent(query)}`} className="block text-center text-xs text-primary pt-2" onClick={() => setOpen(false)}>
            View all results
          </Link>
        </div>
      )}
    </div>
  );
}
