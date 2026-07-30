import { EmployeePortalLayout } from "@/components/portal/PortalRouteLayout";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <EmployeePortalLayout>{children}</EmployeePortalLayout>;
}
