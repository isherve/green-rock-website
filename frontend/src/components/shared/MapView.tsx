"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

interface MapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
  markerTitle?: string;
}

const MapInner = dynamic(() => import("./MapViewInner"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[300px] rounded-xl" />,
});

export function MapView(props: MapViewProps) {
  return (
    <div className={props.className ?? "w-full h-[400px] rounded-xl overflow-hidden"}>
      <MapInner {...props} />
    </div>
  );
}
