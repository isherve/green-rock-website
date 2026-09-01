"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { usePublicList } from "@/hooks/usePublicData";
import { useLocale } from "@/hooks/useLocale";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { localizeProduct } from "@/lib/i18n/content";
import type { Product } from "@/types";

export function MaterialsSection() {
  const { t } = useLocale();
  const { data: products = [] } = usePublicList<Product>(
    "/products",
    { limit: "6", featured: "true" },
    MOCK_PRODUCTS,
    localizeProduct
  );

  return (
    <section className="page-section bg-[#f8faf9] dark:bg-slate-900/40">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle={t("homeMaterialsSubtitle")} title={t("homeMaterialsTitle")} align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {products.slice(0, 3).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/materials">{t("homeBrowseMaterials")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
