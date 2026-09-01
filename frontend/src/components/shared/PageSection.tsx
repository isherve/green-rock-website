import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
  id?: string;
}

/** Consistent inner-page section spacing and backgrounds */
export function PageSection({ children, className, muted = false, id }: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "page-section",
        muted ? "bg-[#f8faf9] dark:bg-slate-900/40" : "bg-white dark:bg-slate-950",
        className
      )}
    >
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
