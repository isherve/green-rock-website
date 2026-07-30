"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface ErpModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  relatedLinks?: { label: string; href: string }[];
}

export function ErpModulePage({ title, description, icon: Icon, features, relatedLinks }: ErpModulePageProps) {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-xl border p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-2xl font-bold font-display">{title}</h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Module capabilities</h3>
        <ul className="grid sm:grid-cols-2 gap-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {relatedLinks && relatedLinks.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {relatedLinks.map((l) => (
            <Button key={l.href} asChild variant="outline" size="sm">
              <Link href={l.href}>
                {l.label} <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
