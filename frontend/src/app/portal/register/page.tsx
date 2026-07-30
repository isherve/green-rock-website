import { PortalAuthForm } from "@/components/portal/PortalAuthForm";

export default function PortalRegisterPage() {
  return <PortalAuthForm mode="register" portal="customer" redirectPath="/portal/dashboard" />;
}
