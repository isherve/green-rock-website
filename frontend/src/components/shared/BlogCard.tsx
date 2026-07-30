"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Blog } from "@/types";

interface BlogCardProps {
  post: Blog;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const imageUrl =
    post.coverImage ??
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group pro-card overflow-hidden hover:-translate-y-1 transition-transform"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge className="absolute top-3 left-3" variant="secondary">
          {post.category}
        </Badge>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
          )}
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author.name}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
        >
          Read More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}
