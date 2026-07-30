import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { BlogCard } from "@/components/shared/BlogCard";
import { fetchPublic, withFallback } from "@/lib/server-api";
import { MOCK_BLOG } from "@/lib/mock-data";
import type { Blog } from "@/types";

export const metadata = { title: "Blog", description: "Construction tips, real estate news and industry insights." };

export default async function BlogPage() {
  const posts = withFallback(await fetchPublic<Blog>("/blog", { limit: "50" }), MOCK_BLOG);

  return (
    <>
      <PageHero title="Blog & News" subtitle="Insights from the industry" />
      <section className="py-16 container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((b) => (
            <Link key={b.id} href={`/blog/${b.slug}`}><BlogCard post={b} /></Link>
          ))}
        </div>
      </section>
    </>
  );
}
