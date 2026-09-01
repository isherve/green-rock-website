import { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import { ContactForm } from "@/components/shared/ContactForm";
import { MapView } from "@/components/shared/MapView";
import { SITE_CONFIG } from "@/lib/constants";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = { title: "Contact Us", description: "Get in touch with Green Rock General Supply Ltd." };

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you. Request a quote, book a visit, or ask a question." />
      <PageSection>
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <span className="section-label">Get in touch</span>
            <h2 className="text-2xl font-bold mb-8 font-display">How to reach us</h2>
            <div className="space-y-4 mb-8">
              {[
                { icon: MapPin, label: "Address", value: SITE_CONFIG.address },
                { icon: Phone, label: "Phone", value: SITE_CONFIG.phone },
                { icon: Mail, label: "Email", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                { icon: MessageCircle, label: "WhatsApp", value: SITE_CONFIG.whatsapp },
                { icon: Clock, label: "Hours", value: "Mon - Sat: 8:00 AM - 6:00 PM" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 clean-card p-4">
                  <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-sm">
                      {"href" in item && item.href ? (
                        <a href={item.href} className="hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        item.value
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64 rounded-2xl overflow-hidden clean-card">
              <MapView lat={SITE_CONFIG.coordinates.lat} lng={SITE_CONFIG.coordinates.lng} />
            </div>
          </div>
          <div>
            <span className="section-label">Send a message</span>
            <h2 className="text-2xl font-bold mb-2 font-display">Request a quote or place an order</h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Quotes, material orders, property inquiries, and appointment bookings all go to our team at {SITE_CONFIG.email}.
            </p>
            <ContactForm />
          </div>
        </div>
      </PageSection>
    </>
  );
}
