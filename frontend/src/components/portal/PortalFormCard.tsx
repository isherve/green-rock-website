"use client";

import { cn } from "@/lib/utils";

interface PortalFormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function PortalFormCard({ title, description, children, className }: PortalFormCardProps) {
  return (
    <div className={cn("clean-card p-6 lg:p-8", className)}>
      <h2 className="text-lg font-semibold font-display mb-1">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mb-6">{description}</p>}
      {!description && <div className="mb-6" />}
      {children}
    </div>
  );
}
