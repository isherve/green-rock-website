"use client";

import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { PropertySearchBar } from "@/components/shared/PropertySearchBar";
import { usePublicList } from "@/hooks/usePublicData";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { Loader2 } from "lucide-react";
import type { Property } from "@/types";

function matchesPrice(price: number, range: string): boolean {
  if (range === "ALL") return true;
  if (range === "500000000+") return price >= 500_000_000;
  const [min, max] = range.split("-").map(Number);
  if (max) return price >= min && price <= max;
  return price >= min;
}

export default function PropertiesContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const purpose = searchParams.get("purpose") ?? "ALL";
  const type = searchParams.get("type") ?? "ALL";
  const price = searchParams.get("price") ?? "ALL";
  const featured = searchParams.get("featured") === "true";

  const { data: properties = [], isLoading } = usePublicList<Property>(
    "/properties",
    { limit: "50" },
    MOCK_PROPERTIES
  );

  const filtered = properties.filter((p) => {
    if (featured && !p.featured) return false;
    if (purpose !== "ALL" && p.purpose !== purpose) return false;
    if (type !== "ALL" && p.propertyType !== type) return false;
    if (!matchesPrice(p.price, price)) return false;
    if (
      q &&
      !p.title.toLowerCase().includes(q.toLowerCase()) &&
      !p.location.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  const hasFilters =
    q || purpose !== "ALL" || type !== "ALL" || price !== "ALL" || featured;

  return (
    <>
      <PageHero
        title="Properties"
        subtitle="Buy, rent, and invest in premium real estate across Rwanda"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
        breadcrumb={[{ label: "Properties" }]}
      />
      <section className="py-12 lg:py-16 container mx-auto px-4">
        <div className="mb-10">
          <PropertySearchBar
            variant="compact"
            className="shadow-lg"
            defaultLocation={q}
            defaultPurpose={purpose}
            defaultType={type}
            defaultPrice={price}
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground text-sm">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </span>
            ) : (
              <>
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "property" : "properties"} found
                {hasFilters && <span> matching your search</span>}
              </>
            )}
          </p>
        </div>

        {filtered.length === 0 && !isLoading ? (
          <div className="pro-card p-12 text-center">
            <p className="text-lg font-medium mb-2">No properties found</p>
            <p className="text-muted-foreground">
              Try adjusting your search filters or browse all listings.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
