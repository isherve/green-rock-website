import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { fetchPublic, withFallback } from "@/lib/server-api";
import { MOCK_CAREERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Briefcase } from "lucide-react";
import type { Career } from "@/types";

export const metadata = { title: "Careers", description: "Join the Green Rock team." };

export default async function CareersPage() {
  const jobs = withFallback(await fetchPublic<Career>("/careers", { limit: "50" }), MOCK_CAREERS);

  return (
    <>
      <PageHero title="Careers" subtitle="Build your future with us" />
      <section className="py-16 container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="pro-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                </div>
              </div>
              <Button asChild><Link href={`/careers/${job.slug}`}>Apply Now</Link></Button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
