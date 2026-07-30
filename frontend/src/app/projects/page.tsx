import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { fetchPublic, withFallback } from "@/lib/server-api";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import type { Project } from "@/types";

export const metadata = { title: "Projects", description: "Explore our completed, ongoing and upcoming construction projects." };

export default async function ProjectsPage() {
  const projects = withFallback(await fetchPublic<Project>("/projects", { limit: "50" }), MOCK_PROJECTS);
  const completed = projects.filter((p) => p.status === "COMPLETED");
  const ongoing = projects.filter((p) => p.status === "ONGOING");
  const upcoming = projects.filter((p) => p.status === "UPCOMING");

  const sections = [
    { title: "Completed Projects", items: completed },
    { title: "Ongoing Projects", items: ongoing },
    { title: "Upcoming Projects", items: upcoming },
  ];

  return (
    <>
      <PageHero title="Our Projects" subtitle="Excellence in every build" />
      {sections.map((section) => section.items.length > 0 && (
        <section key={section.title} className="py-16 container mx-auto px-4">
          <SectionHeading title={section.title} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {section.items.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      ))}
    </>
  );
}
