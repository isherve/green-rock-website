"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={cn(
        "mb-10 lg:mb-12",
        align === "center" && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {subtitle && <span className="section-label">{subtitle}</span>}
      <h2 className="text-3xl lg:text-[2.35rem] font-bold text-foreground mb-3 leading-[1.15] font-display tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}
