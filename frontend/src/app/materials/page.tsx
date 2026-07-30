import { PageHero } from "@/components/shared/PageHero";
import { ProductCard } from "@/components/shared/ProductCard";
import { fetchPublic, withFallback } from "@/lib/server-api";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Product } from "@/types";

export const metadata = { title: "Construction Materials", description: "Quality building materials with delivery across Rwanda." };

export default async function MaterialsPage() {
  const products = withFallback(await fetchPublic<Product>("/products", { limit: "50" }), MOCK_PRODUCTS);

  return (
    <>
      <PageHero title="Construction Materials" subtitle="Quality supplies delivered to your site" image="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80" />
      <section className="py-12 container mx-auto px-4">
        <div className="flex flex-wrap gap-3 mb-10">
          {["All", "Cement", "Steel", "Tiles", "Paint", "Roofing", "Plumbing", "Electrical"].map((c) => (
            <span key={c} className="px-4 py-2 rounded-full border text-sm">{c}</span>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}
