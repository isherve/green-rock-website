import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { fetchPublic } from "@/lib/server-api";

const FALLBACK = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
  "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=600&q=80",
];

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const items = await fetchPublic<{ id: string; url: string; title: string }>("/gallery", { limit: "50" });
  const images = items.length > 0 ? items.map((i) => ({ id: i.id, url: i.url, title: i.title })) : FALLBACK.map((url, i) => ({ id: String(i), url, title: `Gallery ${i + 1}` }));

  return (
    <>
      <PageHero title="Gallery" subtitle="Our work in pictures" />
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group">
              <Image src={item.url} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
