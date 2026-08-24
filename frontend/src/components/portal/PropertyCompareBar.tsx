"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyCompareProps {
  properties: Property[];
}

export function PropertyCompareBar({ properties }: PropertyCompareProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const compared = properties.filter((p) => selected.includes(p.id));

  if (properties.length < 2) return null;

  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
        <Scale className="w-4 h-4" /> Select up to 3 properties to compare
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {properties.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant={selected.includes(p.id) ? "default" : "outline"}
            onClick={() => toggle(p.id)}
          >
            {p.title.slice(0, 30)}{p.title.length > 30 ? "…" : ""}
          </Button>
        ))}
      </div>
      {selected.length >= 2 && (
        <Button size="sm" onClick={() => setShowCompare(!showCompare)}>
          {showCompare ? "Hide" : "Compare"} ({selected.length})
        </Button>
      )}
      {showCompare && compared.length >= 2 && (
        <div className="mt-4 overflow-x-auto border rounded-xl">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">Feature</th>
                {compared.map((p) => (
                  <th key={p.id} className="text-left px-4 py-3">{p.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Price", get: (p: Property) => formatPrice(p.price, p.currency) },
                { label: "Location", get: (p: Property) => p.location },
                { label: "Type", get: (p: Property) => p.propertyType },
                { label: "Purpose", get: (p: Property) => p.purpose },
                { label: "Bedrooms", get: (p: Property) => String(p.bedrooms ?? "—") },
                { label: "Bathrooms", get: (p: Property) => String(p.bathrooms ?? "—") },
                { label: "Area", get: (p: Property) => (p.area ? `${p.area} ${p.areaUnit}` : "—") },
              ].map((row) => (
                <tr key={row.label} className="border-t">
                  <td className="px-4 py-3 font-medium">{row.label}</td>
                  {compared.map((p) => (
                    <td key={p.id} className="px-4 py-3">{row.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
