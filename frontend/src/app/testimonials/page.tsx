import { PageHero } from "@/components/shared/PageHero";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { fetchPublic, withFallback } from "@/lib/server-api";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import type { Testimonial } from "@/types";

export const metadata = { title: "Testimonials", description: "What our clients say about Green Rock." };

export default async function TestimonialsPage() {
  const testimonials = withFallback(await fetchPublic<Testimonial>("/testimonials", { limit: "50" }), MOCK_TESTIMONIALS);

  return (
    <>
      <PageHero title="Testimonials" subtitle="Trusted by hundreds of clients" />
      <section className="page-section container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
        </div>
      </section>
    </>
  );
}
