"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const statusVariant: Record<Project["status"], "success" | "warning" | "default"> = {
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/projects/${project.slug}`} className="group clean-card overflow-hidden block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={statusVariant[project.status]}>
              {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
            </Badge>
            {project.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
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
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mt-4 group-hover:gap-3 transition-all">
            View project <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
