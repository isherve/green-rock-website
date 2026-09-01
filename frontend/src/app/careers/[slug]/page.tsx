import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { CareerApplyForm } from "@/components/shared/CareerApplyForm";
import { fetchPublicOne } from "@/lib/server-api";
import { MOCK_CAREERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Career } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export default async function CareerApplyPage({ params }: Props) {
  const { slug } = await params;
  const job = (await fetchPublicOne<Career>(`/careers/${slug}`)) ?? MOCK_CAREERS.find((c) => c.slug === slug);
  if (!job) notFound();

  return (
    <>
      <PageHero title={job.title} subtitle={`${job.department}, ${job.location}`} />
      <section className="page-section container mx-auto px-4 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/careers"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers</Link>
        </Button>
        <p className="text-muted-foreground mb-4">{job.description}</p>
        {job.requirements && (
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Requirements</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{job.requirements}</p>
          </div>
        )}
        <CareerApplyForm careerId={job.id} jobTitle={job.title} />
      </section>
    </>
  );
}
