"use client";

import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { COMPANY_STATS } from "@/lib/constants";

export function StatsSection() {
  return (
    <section className="py-16 lg:py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <SectionHeading
          subtitle="Our Track Record"
          title="Numbers That Speak"
          description="Years of dedication to excellence in construction, real estate, and supply."
          className="[&_h2]:text-white [&_p]:text-white/70 [&_span]:text-secondary"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {COMPANY_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-4xl lg:text-5xl font-bold text-white block mb-2"
              />
              <p className="text-sm text-white/70 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
