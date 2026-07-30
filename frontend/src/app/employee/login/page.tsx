import { PortalAuthForm } from "@/components/portal/PortalAuthForm";

export default function EmployeeLoginPage() {
  return <PortalAuthForm mode="login" portal="employee" redirectPath="/employee/dashboard" />;
}
