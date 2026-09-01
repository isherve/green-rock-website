"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

const FAQ_ITEMS = [
  {
    q: "What services does Green Rock provide?",
    a: "Construction, real estate, architecture & drawings, building materials supply, and project management across Rwanda.",
  },
  {
    q: "How do I request a construction quotation?",
    a: "Use the Contact page or register for the Customer Portal to submit construction and quote requests.",
  },
  {
    q: "Do you deliver building materials?",
    a: "Yes. Cement, steel, tiles, and more with bulk ordering and site delivery anywhere in Rwanda.",
  },
  {
    q: "How do I list my property for sale or rent?",
    a: "Contact us with property details or use Co-Listing under Properties. Our team will guide you through the process.",
  },
  {
    q: "What is the Customer Portal?",
    a: "A secure area to manage saved properties, quotes, orders, invoices, payments, and support tickets.",
  },
];

export function HomeFaqSection() {
  return (
    <section className="page-section bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading
          subtitle="Questions"
          title="Frequently asked questions"
          description="Services, pricing, and how booking works. Still unsure? Message the team and we reply quickly."
          align="center"
        />
        <div className="space-y-3 mt-10">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="clean-card group">
              <summary className="cursor-pointer p-5 font-medium text-foreground list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-primary text-xl leading-none shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/contact">Contact our team</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full">
            <a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
