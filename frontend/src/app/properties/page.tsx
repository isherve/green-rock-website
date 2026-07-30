"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PropertiesContent from "./PropertiesContent";

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}
