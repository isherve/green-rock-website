"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const statusVariant: Record<
  Project["status"],
  "success" | "warning" | "default"
> = {
  COMPLETED: "success",
  ONGOING: "warning",
  UPCOMING: "default",
};

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const imageUrl =
    project.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group pro-card overflow-hidden hover:-translate-y-1 transition-transform aspect-[4/5]"
    >
      <Link href={`/projects/${project.slug}`} className="block h-full">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />

        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={statusVariant[project.status]}>
              {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
            </Badge>
            {project.featured && <Badge variant="secondary">Featured</Badge>}
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">
            {project.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {project.location}
            </span>
            {project.completionDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(project.completionDate)}
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="h-5 w-5 text-white" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
