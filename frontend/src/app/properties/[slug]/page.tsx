import { Metadata } from "next";

import { notFound } from "next/navigation";

import Link from "next/link";

import Image from "next/image";

import { PageHero } from "@/components/shared/PageHero";

import { ContactForm } from "@/components/shared/ContactForm";

import { fetchPublicOne } from "@/lib/server-api";

import { MOCK_PROPERTIES } from "@/lib/mock-data";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { formatPrice } from "@/lib/utils";

import { ArrowLeft, Bed, Bath, Maximize, MapPin } from "lucide-react";

import { PropertyFavoriteButton } from "@/components/portal/PropertyFavoriteButton";

import type { Property } from "@/types";



type Props = { params: Promise<{ slug: string }> };



export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const property = (await fetchPublicOne<Property>(`/properties/${slug}`)) ?? MOCK_PROPERTIES.find((p) => p.slug === slug);

  return { title: property?.title, description: property?.description };

}



export default async function PropertyDetailPage({ params }: Props) {

  const { slug } = await params;

  const property = (await fetchPublicOne<Property>(`/properties/${slug}`)) ?? MOCK_PROPERTIES.find((p) => p.slug === slug);

  if (!property) notFound();



  const images = property.images?.length

    ? property.images

    : [{ id: "0", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", order: 0, propertyId: property.id, createdAt: "" }];



  return (

    <>

      <PageHero title={property.title} subtitle={property.location} />

      <section className="py-16 container mx-auto px-4">

        <Button variant="ghost" asChild className="mb-8">

          <Link href="/properties"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties</Link>

        </Button>



        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">

              <Image src={images[0].url} alt={property.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />

            </div>

            {images.length > 1 && (

              <div className="grid grid-cols-4 gap-3">

                {images.slice(1, 5).map((img) => (

                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden">

                    <Image src={img.url} alt="" fill className="object-cover" sizes="150px" />

                  </div>

                ))}

              </div>

            )}



            <div>

              <div className="flex flex-wrap gap-2 mb-4">

                <Badge>{property.propertyType}</Badge>

                <Badge variant="secondary">For {property.purpose === "RENT" ? "Rent" : "Sale"}</Badge>

                {property.featured && <Badge variant="warning">Featured</Badge>}

              </div>

              <h2 className="text-3xl font-bold text-primary mb-4">

                {formatPrice(property.price, property.currency)}

                {property.purpose === "RENT" && <span className="text-base font-normal text-muted-foreground">/mo</span>}

              </h2>

              <PropertyFavoriteButton propertyId={property.id} className="mb-6" />

              <p className="text-muted-foreground leading-relaxed mb-6">{property.description}</p>



              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">

                {property.bedrooms != null && (

                  <span className="flex items-center gap-2"><Bed className="w-4 h-4 text-primary" /> {property.bedrooms} Bedrooms</span>

                )}

                {property.bathrooms != null && (

                  <span className="flex items-center gap-2"><Bath className="w-4 h-4 text-primary" /> {property.bathrooms} Bathrooms</span>

                )}

                {property.area != null && (

                  <span className="flex items-center gap-2"><Maximize className="w-4 h-4 text-primary" /> {property.area} {property.areaUnit}</span>

                )}

                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {property.address ?? property.location}</span>

              </div>



              {property.amenities?.length > 0 && (

                <div>

                  <h3 className="font-semibold mb-3">Amenities</h3>

                  <ul className="grid sm:grid-cols-2 gap-2">

                    {property.amenities.map((a) => (

                      <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">

                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />{a}

                      </li>

                    ))}

                  </ul>

                </div>

              )}

            </div>

          </div>



          <div className="pro-card p-8 rounded-2xl h-fit sticky top-24">

            <h3 className="text-xl font-semibold mb-6">Schedule a Viewing</h3>

            <ContactForm defaultType="PROPERTY" />

          </div>

        </div>

      </section>

    </>

  );

}

