"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export function PortalStatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("pro-card p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1 font-display">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PortalEmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="pro-card p-12 text-center">
      <p className="text-lg font-semibold mb-2">{title}</p>
      <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}

interface DataListProps {
  items: { id: string; title: string; subtitle?: string; meta?: string; status?: string }[];
  emptyTitle: string;
  emptyDescription: string;
}

export function PortalDataList({ items, emptyTitle, emptyDescription }: DataListProps) {
  if (items.length === 0) {
    return <PortalEmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="pro-card divide-y divide-border overflow-hidden">
      {items.map((item) => (
        <div key={item.id} className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-accent/50 transition-colors">
          <div className="min-w-0">
            <p className="font-medium">{item.title}</p>
            {item.subtitle && <p className="text-sm text-muted-foreground mt-0.5">{item.subtitle}</p>}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {item.meta && <span className="text-xs text-muted-foreground">{item.meta}</span>}
            {item.status && (
              <span className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-primary/10 text-primary">
                {item.status}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
