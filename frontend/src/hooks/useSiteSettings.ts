"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SITE_CONFIG } from "@/lib/constants";

export type SiteSettingsRecord = {
  site?: {
    name?: string;
    tagline?: string;
    description?: string;
    architectureNote?: string;
    logo?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    phone2?: string;
    whatsapp?: string;
    address?: string;
    workingHours?: string;
  };
};

export function useSiteSettings() {
  return useQuery<SiteSettingsRecord>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return (res.data.data ?? {}) as SiteSettingsRecord;
    },
    staleTime: 5 * 60_000,
  });
}

export function useResolvedSiteConfig(settings?: SiteSettingsRecord) {
  return {
    name: settings?.site?.name || SITE_CONFIG.name,
    shortName: SITE_CONFIG.shortName,
    tagline: settings?.site?.tagline || SITE_CONFIG.tagline,
    description: settings?.site?.description || SITE_CONFIG.description,
    architectureNote: settings?.site?.architectureNote || SITE_CONFIG.architectureNote,
    email: settings?.contact?.email || SITE_CONFIG.email,
    phone: settings?.contact?.phone || SITE_CONFIG.phone,
    whatsapp: settings?.contact?.whatsapp || SITE_CONFIG.whatsapp,
    address: settings?.contact?.address || SITE_CONFIG.address,
    logo: settings?.site?.logo || SITE_CONFIG.logo,
  };
}
