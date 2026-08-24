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
import { FOOTER_NAV, translate } from "@/lib/i18n/translations";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

export function Footer() {
  const { locale } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1628] text-white relative overflow-hidden">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

      {/* Newsletter */}
      <div className="border-b border-white/8">
        <div className="container mx-auto px-4 py-10 lg:py-14">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold font-display leading-tight">
                {translate("footerNewsletterTitle", locale)}{" "}
                <span className="text-secondary">Green Rock</span>
              </h3>
              <p className="text-white/60 mt-3 max-w-md text-sm leading-relaxed">
                {translate("footerNewsletterSubtitle", locale)}
              </p>
            </div>
            <NewsletterForm variant="footer" />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 max-w-6xl mx-auto">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <BrandLogo size="md" variant="onDark" className="mb-5" />
            <p className="text-white/65 text-sm leading-relaxed mb-3">
              {translate("siteDescription", locale)}
            </p>
            <p className="text-secondary/85 text-xs leading-relaxed mb-6 font-medium">
              {translate("architectureNote", locale)}
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="h-4 w-4 text-secondary shrink-0" />
                {SITE_CONFIG.address}
              </div>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex items-center gap-3 text-white/70 hover:text-secondary transition-colors"
              >
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                {SITE_CONFIG.phone}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 text-white/70 hover:text-secondary transition-colors break-all"
              >
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-2">
            <h4 className="text-secondary text-sm font-semibold uppercase tracking-wider mb-4">
              {translate("footerCompany", locale)}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {translate(link.key, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-secondary text-sm font-semibold uppercase tracking-wider mb-4">
              {translate("footerServices", locale)}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {translate(link.key, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-secondary text-sm font-semibold uppercase tracking-wider mb-4">
              {translate("footerResources", locale)}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {translate(link.key, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-secondary text-sm font-semibold uppercase tracking-wider mb-4">
              {translate("footerPortals", locale)}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_NAV.portals.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {translate(link.key, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-white/45 text-center md:text-left">
              © {currentYear} {SITE_CONFIG.shortName}. {translate("footerRights", locale)}
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 text-white/70 hover:bg-secondary hover:text-dark transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-4 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              {translate("footerPrivacy", locale)}
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              {translate("footerTerms", locale)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
