import { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" />
      <section className="py-16 container mx-auto px-4 max-w-3xl prose prose-lg">
        <p>Last updated: July 2026</p>
        <h2>Acceptance of Terms</h2>
        <p>By accessing {SITE_CONFIG.name}&apos;s website, you agree to these terms and conditions.</p>
        <h2>Services</h2>
        <p>All services are subject to availability and separate service agreements. Prices listed are indicative and may change.</p>
        <h2>Intellectual Property</h2>
        <p>All content on this website is the property of {SITE_CONFIG.name} and protected by copyright laws.</p>
        <h2>Limitation of Liability</h2>
        <p>{SITE_CONFIG.name} shall not be liable for any indirect damages arising from use of this website.</p>
      </section>
    </>
  );
}
