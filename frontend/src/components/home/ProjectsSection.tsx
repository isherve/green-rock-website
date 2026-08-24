"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Button } from "@/components/ui/button";
import { usePublicList } from "@/hooks/usePublicData";
import { useLocale } from "@/hooks/useLocale";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import type { Project } from "@/types";

export function ProjectsSection() {
  const { t } = useLocale();
  const { data: projects = [] } = usePublicList<Project>("/projects", { limit: "6", featured: "true" }, MOCK_PROJECTS);

  return (
    <section className="py-20 lg:py-28 section-padding">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle={t("homeProjectsSubtitle")} title={t("homeProjectsTitle")} align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">{t("homeViewAllProjects")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
