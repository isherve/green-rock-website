import { PortalAuthForm } from "@/components/portal/PortalAuthForm";

export default function PortalLoginPage() {
  return <PortalAuthForm mode="login" portal="customer" redirectPath="/portal/dashboard" />;
}
