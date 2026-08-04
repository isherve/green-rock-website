import Link from "next/link";
import { Building2, HardHat, Shield, ArrowRight, UserCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";

const PORTALS = [
  {
    title: "Customer Portal",
    description: "Save properties, track quotes, orders, invoices, appointments, and support tickets.",
    href: "/portal/login",
    registerHref: "/portal/register",
    icon: UserCircle,
    color: "bg-primary/10 text-primary",
    features: ["Saved properties", "Material orders", "Support & messages"],
  },
  {
    title: "Employee Portal",
    description: "Tasks, attendance, leave requests, payslips, projects, and internal documents.",
    href: "/employee/login",
    icon: Briefcase,
    color: "bg-secondary/20 text-secondary-foreground",
    features: ["Check-in/out", "Leave requests", "Task updates"],
  },
  {
    title: "Admin ERP",
    description: "Full business management — CRM, properties, inventory, finance, HR, and CMS.",
    href: "/admin/login",
    icon: Shield,
    color: "bg-dark/10 text-dark",
    features: ["Dashboard & analytics", "CRUD modules", "Role-based access"],
  },
] as const;

export function PortalsSection() {
  return (
    <section className="py-20 lg:py-28 section-padding bg-accent/40">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Enterprise Platform"
          title="Access Your Portal"
          description="Green Rock runs on a unified platform — customers, staff, and administrators each have a dedicated portal."
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {PORTALS.map((portal) => (
            <div key={portal.title} className="pro-card p-8 flex flex-col h-full">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${portal.color} mb-5`}>
                <portal.icon className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold font-display mb-2">{portal.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{portal.description}</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 mb-6">
                {portal.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="flex-1">
                  <Link href={portal.href}>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {"registerHref" in portal && portal.registerHref && (
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={portal.registerHref}>Register</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Real estate & construction</span>
          <span className="inline-flex items-center gap-2"><HardHat className="h-4 w-4 text-primary" /> Materials supply</span>
        </div>
      </div>
    </section>
  );
}
