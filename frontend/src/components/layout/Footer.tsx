"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { useLocale } from "@/hooks/useLocale";
import { useResolvedSiteConfig, useSiteSettings } from "@/hooks/useSiteSettings";
import { FOOTER_NAV } from "@/lib/i18n/translations";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

export function Footer() {
  const { t } = useLocale();
  const { data: settings } = useSiteSettings();
  const site = useResolvedSiteConfig(settings);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12 lg:py-14">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-display font-semibold leading-tight">
                {t("footerNewsletterTitle")}
              </h3>
              <p className="text-white/60 mt-3 max-w-md text-sm leading-relaxed">
                {t("footerNewsletterSubtitle")}
              </p>
            </div>
            <NewsletterForm variant="footer" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-4">
            <BrandLogo size="md" variant="onDark" className="mb-5" />
            <p className="text-white/65 text-sm leading-relaxed mb-6">{site.description}</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                {site.address}
              </div>
              <a href={`tel:${site.phone}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors break-all">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                {site.email}
              </a>
            </div>
          </div>

          {[
            { title: t("footerCompany"), links: FOOTER_NAV.company },
            { title: t("footerServices"), links: FOOTER_NAV.services },
            { title: t("footerResources"), links: FOOTER_NAV.resources },
            { title: t("footerPortals"), links: FOOTER_NAV.portals },
          ].map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-sm font-semibold mb-4 text-white/90">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-white/45 text-center md:text-left">
              © {currentYear} {SITE_CONFIG.shortName}. {t("footerRights")}
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.icon] ?? Facebook;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/70 hover:bg-primary hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">{t("footerPrivacy")}</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">{t("footerTerms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
