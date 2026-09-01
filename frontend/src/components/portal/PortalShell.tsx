"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type PortalUser = { name: string; email: string; role: string };

interface PortalShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  nav: { label: string; href: string; icon: LucideIcon }[];
  loginPath: string;
  allowedRoles: (role: string) => boolean;
  portalLabel: string;
  accentClass?: string;
}

export function PortalShell({
  children,
  title,
  subtitle,
  nav,
  loginPath,
  allowedRoles,
  portalLabel,
  accentClass = "bg-primary",
}: PortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace(loginPath);
      return;
    }

    let cancelled = false;
    api
      .get("/auth/me")
      .then((res) => {
        if (cancelled) return;
        const u = res.data.data;
        if (!allowedRoles(u.role)) {
          localStorage.clear();
          router.replace(loginPath);
          return;
        }
        setUser({ name: u.name, email: u.email, role: u.role });
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.clear();
          router.replace(loginPath);
        }
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router, loginPath, allowedRoles]);

  const logout = () => {
    localStorage.clear();
    router.push(loginPath);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-slate-950 text-foreground">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-border flex flex-col transition-transform duration-200 shadow-sm",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5 border-b border-border shrink-0">
          <Link href={nav[0]?.href ?? "/"} className="flex items-center gap-3">
            <Image src={SITE_CONFIG.logo} alt="Logo" width={864} height={864} unoptimized className="h-9 w-auto max-w-[120px] object-contain" />
            <div>
              <p className="font-bold text-sm font-display">Green Rock</p>
              <p className="text-xs text-muted-foreground">{portalLabel}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/5 text-foreground/80"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          {user && (
            <div className="mb-3 px-1">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <Button variant="ghost" onClick={logout} className="w-full justify-start rounded-full">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
          <Link href="/" className="block text-xs text-center text-muted-foreground hover:text-primary mt-3">
            ← Back to website
          </Link>
        </div>
      </aside>

      <div className="lg:pl-72 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b px-4 lg:px-8 py-4 shrink-0">
          <div className="flex items-start gap-4">
            <button type="button" className="lg:hidden mt-1" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold font-display">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {checking ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
