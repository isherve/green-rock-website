import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "What services does Green Rock provide?",
    a: "We offer construction, real estate, architecture & drawings, building materials supply, and project management across Rwanda.",
  },
  {
    q: "How do I request a construction quotation?",
    a: "Use the Contact page or register for the Customer Portal to submit construction and quote requests tracked in your dashboard.",
  },
  {
    q: "Can I save properties I am interested in?",
    a: "Yes. Create a free customer account, browse properties, and save listings from any property detail page.",
  },
  {
    q: "Do you deliver building materials?",
    a: "Yes. We supply cement, steel, tiles, and more with bulk ordering and site delivery. Order via the Materials catalog or Customer Portal.",
  },
  {
    q: "How do I list my property for sale or rent?",
    a: "Contact us with property details or use the Co-Listing option under Properties. Our real estate team will guide you through the process.",
  },
  {
    q: "What is the Customer Portal?",
    a: "A secure area to manage saved properties, quotes, construction requests, material orders, appointments, invoices, payments, and support tickets.",
  },
  {
    q: "How do I download my invoice?",
    a: "Sign in to the Customer Portal, open Invoices, and click Download PDF on any invoice issued by Green Rock.",
  },
  {
    q: "How do I apply for a job at Green Rock?",
    a: "Visit the Careers page, browse open positions, and submit your application with CV online.",
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Answers about our services, portals, and how to work with Green Rock"
        breadcrumb={[{ label: "FAQ" }]}
      />
      <section className="py-16 container mx-auto px-4 max-w-3xl">
        <SectionHeading
          subtitle="Help Center"
          title="Common Questions"
          align="center"
        />
        <div className="space-y-4 mt-10">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="pro-card group">
              <summary className="cursor-pointer p-5 font-semibold list-none flex items-center justify-between [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-primary text-xl leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10">
          Still have questions?{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            Contact our team
          </Link>
        </p>
      </section>
    </>
  );
}
