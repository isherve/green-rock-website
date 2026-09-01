"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut, Menu, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import { ADMIN_NAV_GROUPS, PAGE_TITLES } from "@/lib/admin-nav";
import { canAccessAdmin } from "@/lib/roles";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type AdminUser = { name: string; role: string; email?: string };

let adminUserCache: AdminUser | null = null;

export function clearAdminUserCache() {
  adminUserCache = null;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(adminUserCache);
  const [checkingAuth, setCheckingAuth] = useState(!adminUserCache);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = PAGE_TITLES[pathname ?? ""] ?? "Admin";

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      clearAdminUserCache();
      router.replace("/admin/login");
      return;
    }

    let cancelled = false;

    api.get("/auth/me")
      .then((res) => {
        if (cancelled) return;
        const u = res.data.data;
        if (!canAccessAdmin(u.role)) {
          clearAdminUserCache();
          localStorage.clear();
          router.replace("/admin/login");
          return;
        }
        adminUserCache = { name: u.name, role: u.role, email: u.email };
        setUser(adminUserCache);
      })
      .catch(() => {
        if (cancelled) return;
        clearAdminUserCache();
        localStorage.clear();
        router.replace("/admin/login");
      })
      .finally(() => {
        if (!cancelled) setCheckingAuth(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const logout = () => {
    clearAdminUserCache();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-foreground">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border flex flex-col transition-transform duration-200 shadow-sm",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5 border-b border-border shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image src={SITE_CONFIG.logo} alt="Logo" width={864} height={864} unoptimized className="h-9 w-auto max-w-[120px] object-contain" />
            <div>
              <p className="font-bold text-sm font-display">Green Rock</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto overscroll-contain space-y-5">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{group.title}</p>
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => (
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
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          {user && (
            <div className="mb-3 px-1">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email ?? user.role}</p>
            </div>
          )}
          <Button variant="ghost" onClick={logout} className="w-full justify-start rounded-full">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
          <Link href="/" className="block text-xs text-center text-muted-foreground hover:text-primary mt-3">
            Back to website
          </Link>
        </div>
      </aside>

      <div className="lg:pl-72 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b px-4 lg:px-8 py-4 flex items-center gap-4 shrink-0">
          <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl lg:text-2xl font-bold font-display flex-1">{title}</h1>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex rounded-full">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              View website
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {checkingAuth && !user ? (
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
