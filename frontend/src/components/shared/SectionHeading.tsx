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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className={cn(
        "mb-10 lg:mb-14",
        align === "center" && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {subtitle && <span className="section-label">{subtitle}</span>}
      <h2 className="text-3xl lg:text-[2.25rem] font-bold text-foreground mb-3 leading-tight font-display motion-3d">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
      )}
      <div
        className={cn(
          "mt-5 h-0.5 w-14 bg-secondary",
          align === "center" && "mx-auto"
        )}
      />
    </motion.div>
  );
}
