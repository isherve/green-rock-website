import { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <section className="page-section container mx-auto px-4 max-w-3xl prose prose-lg">
        <p>Last updated: July 2026</p>
        <h2>Information We Collect</h2>
        <p>{SITE_CONFIG.name} collects information you provide through contact forms, property inquiries, job applications, and newsletter subscriptions.</p>
        <h2>How We Use Your Information</h2>
        <p>We use your information to respond to inquiries, process applications, send newsletters, and improve our services.</p>
        <h2>Data Protection</h2>
        <p>We implement industry-standard security measures to protect your personal data.</p>
        <h2>Contact</h2>
        <p>For privacy concerns, contact us at {SITE_CONFIG.email}.</p>
      </section>
    </>
  );
}
