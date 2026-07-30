"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const imageUrl =
    product.images?.[0] ??
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group pro-card overflow-hidden hover:-translate-y-1 transition-transform"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {!product.availability && (
          <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
            <Badge variant="muted">Out of Stock</Badge>
          </div>
        )}
        {product.featured && (
          <Badge className="absolute top-3 left-3" variant="secondary">
            Featured
          </Badge>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category?.name ?? "Materials"}
        </p>
        <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/materials/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="text-xl font-bold text-primary mb-3">
          {formatPrice(product.price, product.currency)}
        </p>

        {product.deliveryOption && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
            <Truck className="h-3.5 w-3.5 text-primary" />
            Delivery available
            {product.deliveryCharge != null &&
              ` · ${formatPrice(product.deliveryCharge, product.currency)}`}
          </div>
        )}

        <Button
          asChild
          variant="outline"
          className="w-full group/btn"
          disabled={!product.availability}
        >
          <Link href={`/materials/${product.slug}`}>
            <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            View Product
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
