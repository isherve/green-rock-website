"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login" || pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="light" style={{ colorScheme: "light" }}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
