import { Metadata } from "next";

import { notFound } from "next/navigation";

import Link from "next/link";

import Image from "next/image";

import { PageHero } from "@/components/shared/PageHero";

import { ContactForm } from "@/components/shared/ContactForm";

import { fetchPublicOne } from "@/lib/server-api";

import { MOCK_PRODUCTS } from "@/lib/mock-data";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { formatPrice } from "@/lib/utils";

import { ArrowLeft, Package, Truck } from "lucide-react";

import type { Product } from "@/types";



type Props = { params: Promise<{ slug: string }> };



export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const product = (await fetchPublicOne<Product>(`/products/${slug}`)) ?? MOCK_PRODUCTS.find((p) => p.slug === slug);

  return { title: product?.name, description: product?.description };

}



export default async function ProductDetailPage({ params }: Props) {

  const { slug } = await params;

  const product = (await fetchPublicOne<Product>(`/products/${slug}`)) ?? MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) notFound();



  const imageUrl = product.images?.[0] ?? "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80";

  const categoryName = (product as Product & { category?: { name: string } }).category?.name;



  return (

    <>

      <PageHero title={product.name} subtitle={categoryName ?? "Building Materials"} />

      <section className="py-16 container mx-auto px-4">

        <Button variant="ghost" asChild className="mb-8">

          <Link href="/materials"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Materials</Link>

        </Button>



        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">

            <div className="relative aspect-square max-w-lg rounded-2xl overflow-hidden bg-muted">

              <Image src={imageUrl} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />

            </div>



            <div>

              <div className="flex flex-wrap gap-2 mb-4">

                {categoryName && <Badge variant="secondary">{categoryName}</Badge>}

                {product.availability ? (

                  <Badge>In Stock ({product.stock} units)</Badge>

                ) : (

                  <Badge variant="muted">Out of Stock</Badge>

                )}

                {product.deliveryOption && <Badge variant="outline"><Truck className="w-3 h-3 mr-1" /> Delivery Available</Badge>}

              </div>

              <h2 className="text-3xl font-bold text-primary mb-4">{formatPrice(product.price, product.currency)}</h2>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {product.deliveryCharge != null && product.deliveryOption && (

                <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">

                  <Package className="w-4 h-4" /> Delivery charge: {formatPrice(product.deliveryCharge, product.currency)}

                </p>

              )}

            </div>

          </div>



          <div className="pro-card p-8 rounded-2xl h-fit sticky top-24">

            <h3 className="text-xl font-semibold mb-6">Request Quote</h3>

            <ContactForm defaultType="MATERIAL" />

          </div>

        </div>

      </section>

    </>

  );

}

