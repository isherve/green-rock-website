"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SiteSearch } from "@/components/shared/SiteSearch";
import api from "@/lib/api";

type SearchResults = {
  query: string;
  properties: { slug: string; title: string; location: string; price: number; currency: string }[];
  projects: { slug: string; title: string; location: string }[];
  products: { slug: string; name: string; price: number; currency: string }[];
  blogPosts: { slug: string; title: string; excerpt: string | null }[];
  totalResults: number;
};

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    api
      .get("/search", { params: { q, limit: 10 } })
      .then((res) => setResults(res.data.data))
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <>
      <PageHero title="Search" subtitle="Find properties, projects, materials, and articles" />
      <section className="py-12 container mx-auto px-4 max-w-3xl">
        <SiteSearch />

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && q.length >= 2 && results && (
          <div className="mt-10 space-y-8">
            <p className="text-sm text-muted-foreground">
              {results.totalResults} result{results.totalResults !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
            </p>

            {results.properties.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Properties</h2>
                <ul className="space-y-2">
                  {results.properties.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/properties/${p.slug}`} className="text-primary hover:underline">
                        {p.title}
                      </Link>
                      <span className="text-sm text-muted-foreground"> — {p.location}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.projects.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Projects</h2>
                <ul className="space-y-2">
                  {results.projects.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/projects/${p.slug}`} className="text-primary hover:underline">
                        {p.title}
                      </Link>
                      <span className="text-sm text-muted-foreground"> — {p.location}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.products.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Materials</h2>
                <ul className="space-y-2">
                  {results.products.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/materials/${p.slug}`} className="text-primary hover:underline">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.blogPosts.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Blog</h2>
                <ul className="space-y-2">
                  {results.blogPosts.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="text-primary hover:underline">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.totalResults === 0 && (
              <p className="text-muted-foreground">No results found. Try different keywords.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
