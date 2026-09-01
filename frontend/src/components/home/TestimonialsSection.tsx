"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { usePublicList } from "@/hooks/usePublicData";
import { useLocale } from "@/hooks/useLocale";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import type { Testimonial } from "@/types";

export function TestimonialsSection() {
  const { t } = useLocale();
  const { data: testimonials = [] } = usePublicList<Testimonial>("/testimonials", { limit: "6", featured: "true" }, MOCK_TESTIMONIALS);

  return (
    <section className="page-section bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle={t("homeTestimonialsSubtitle")} title={t("homeTestimonialsTitle")} align="center" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
