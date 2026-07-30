"use client";

import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalData } from "@/hooks/usePortalData";
import { PortalEmptyState } from "@/components/portal/PortalWidgets";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

export default function SavedPropertiesPage() {
  const { data, loading } = usePortalData<Property>("/portal/favorites");

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <PortalEmptyState
        title="No saved properties yet"
        description="Browse listings and save properties you are interested in."
        action={
          <Button asChild>
            <Link href="/properties">Browse Properties</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((p) => (
        <Link key={p.id} href={`/properties/${p.slug}`} className="pro-card overflow-hidden hover:-translate-y-1 transition-transform block">
          <div className="relative aspect-[4/3]">
            <Image
              src={p.images?.[0]?.url ?? "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"}
              alt={p.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <p className="font-semibold line-clamp-2">{p.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{p.location}</p>
            <p className="text-primary font-bold mt-2">{formatPrice(p.price, p.currency)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
