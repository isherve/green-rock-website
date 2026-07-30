import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchPublicOne } from "@/lib/server-api";
import { MOCK_BLOG } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Blog } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublicOne<Blog>(`/blog/${slug}`) ?? MOCK_BLOG.find((b) => b.slug === slug);
  return { title: post?.title, description: post?.excerpt };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = (await fetchPublicOne<Blog>(`/blog/${slug}`)) ?? MOCK_BLOG.find((b) => b.slug === slug);
  if (!post) notFound();

  const cover = post.coverImage ?? "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";

  return (
    <article>
      <div className="relative h-80 md:h-96">
        <Image src={cover} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-dark/60" />
        <div className="absolute bottom-0 container mx-auto px-4 pb-8">
          <span className="text-secondary text-sm font-medium">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{post.title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog</Link>
        </Button>
        <p className="text-muted-foreground mb-8">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</p>
        <div className="prose prose-lg max-w-none">
          <p>{post.excerpt}</p>
          {post.content && <div className="mt-4 whitespace-pre-wrap">{post.content}</div>}
        </div>
      </div>
    </article>
  );
}
