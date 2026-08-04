"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Award,
  Clock,
  Users,
  Truck,
  PenTool,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TiltCard3D } from "@/components/motion/TiltCard3D";

const REASONS = [
  {
    icon: Shield,
    title: "Trusted Quality",
    description:
      "Over 15 years of delivering premium construction and supply services with uncompromising quality standards.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description:
      "Recognized for excellence in construction and real estate across Rwanda and East Africa.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "We respect deadlines. Our project management ensures timely completion without compromising quality.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Skilled architects, engineers, and craftsmen dedicated to bringing your vision to life.",
  },
  {
    icon: PenTool,
    title: "Architecture & Drawings",
    description:
      "We help in drawing, making quotations, and architecture of the house to be built — professional plans tailored to your vision and budget.",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    description:
      "Consistent building materials supply with delivery to your site anywhere in Rwanda.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 section-padding">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Why Green Rock"
          title="Why Choose Us"
          description="We combine expertise, quality, and dedication to deliver exceptional results for every client."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {REASONS.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="motion-3d"
            >
              <TiltCard3D className="pro-card p-6 lg:p-8 group h-full">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <reason.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
