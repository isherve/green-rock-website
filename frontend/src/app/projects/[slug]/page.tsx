import { Metadata } from "next";

import { notFound } from "next/navigation";

import Link from "next/link";

import Image from "next/image";

import { PageHero } from "@/components/shared/PageHero";

import { ContactForm } from "@/components/shared/ContactForm";

import { fetchPublicOne } from "@/lib/server-api";

import { MOCK_PROJECTS } from "@/lib/mock-data";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";

import type { Project } from "@/types";



type Props = { params: Promise<{ slug: string }> };



export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { slug } = await params;

  const project = (await fetchPublicOne<Project>(`/projects/${slug}`)) ?? MOCK_PROJECTS.find((p) => p.slug === slug);

  return { title: project?.title, description: project?.description };

}



export default async function ProjectDetailPage({ params }: Props) {

  const { slug } = await params;

  const project = (await fetchPublicOne<Project>(`/projects/${slug}`)) ?? MOCK_PROJECTS.find((p) => p.slug === slug);

  if (!project) notFound();



  const imageUrl = project.images?.[0]?.url ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80";
  const galleryImages = project.images?.length ? project.images : [{ id: "0", url: imageUrl, order: 0, projectId: project.id, createdAt: "" }];



  return (

    <>

      <PageHero title={project.title} subtitle={project.location} />

      <section className="page-section container mx-auto px-4">

        <Button variant="ghost" asChild className="mb-8">

          <Link href="/projects"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects</Link>

        </Button>



        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">

              <Image src={imageUrl} alt={project.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />

            </div>



            <div>

              <Badge className="mb-4">{project.status}</Badge>

              <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>



              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">

                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {project.location}</span>

                {project.client && (

                  <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {project.client}</span>

                )}

                {project.completionDate && (

                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {new Date(project.completionDate).toLocaleDateString()}</span>

                )}

              </div>



              {project.servicesUsed?.length > 0 && (

                <div>

                  <h3 className="font-semibold mb-3">Services Used</h3>

                  <ul className="space-y-2">

                    {project.servicesUsed.map((s) => (

                      <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">

                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />{s}

                      </li>

                    ))}

                  </ul>

                </div>

              )}

            </div>

            {galleryImages.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3">Project Progress Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image src={img.url} alt="" fill className="object-cover" sizes="200px" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>



          <div className="clean-card p-8 rounded-2xl h-fit sticky top-24">

            <h3 className="text-xl font-semibold mb-6">Start a Similar Project</h3>

            <ContactForm defaultType="CONSTRUCTION" />

          </div>

        </div>

      </section>

    </>

  );

}

