"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { SITE_CONFIG } from "@/lib/constants";
import { isCustomerRole } from "@/lib/roles";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email (e.g. name@gmail.com)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: "login" | "register";
  redirectPath: string;
}

export function PortalAuthForm({ mode, redirectPath }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginForm) => {
    setError("");
    try {
      const res = await api.post("/auth/login", data);
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      if (!isCustomerRole(user.role)) {
        localStorage.clear();
        setError("This account is not a customer account. Use the admin login for staff access.");
        return;
      }

      router.push(redirectPath);
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Authentication failed";
      if (msg === "Network Error") {
        msg = "Cannot reach the server. If this persists, the site database may not be configured on Vercel yet.";
      }
      if (msg.includes("DATABASE_URL") || msg.includes("Environment variable not found")) {
        msg = "Database not connected. In Vercel: Storage → Create Postgres → Redeploy → run seed.";
      }
      setError(msg);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setError("");
    try {
      const payload = {
        ...data,
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || undefined,
      };
      const res = await api.post("/auth/register", payload);
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      if (!isCustomerRole(user.role)) {
        localStorage.clear();
        setError("Registration succeeded but account role is invalid for the customer portal.");
        return;
      }

      router.push(redirectPath);
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Authentication failed";
      if (msg === "Network Error") {
        msg = "Cannot reach the server. If this persists, the site database may not be configured on Vercel yet.";
      }
      if (msg.includes("DATABASE_URL") || msg.includes("Environment variable not found")) {
        msg = "Database not connected. In Vercel: Storage → Create Postgres → Redeploy → run seed.";
      }
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4 py-12">
      <div className="w-full max-w-md pro-card p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Image src={SITE_CONFIG.logo} alt="Logo" width={864} height={864} unoptimized className="h-14 w-auto max-w-[160px] object-contain mx-auto mb-4" />
          {isRegister ? (
            <UserPlus className="w-7 h-7 text-primary mx-auto mb-2" />
          ) : (
            <Lock className="w-7 h-7 text-primary mx-auto mb-2" />
          )}
          <h1 className="text-2xl font-bold font-display">
            {isRegister ? "Create Account" : "Sign In"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Customer Portal · {SITE_CONFIG.shortName}
          </p>
        </div>

        {isRegister ? (
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
            <div>
              <Input placeholder="Full name" {...registerForm.register("name")} />
              {registerForm.formState.errors.name && (
                <p className="text-destructive text-xs mt-1">{registerForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Input placeholder="Phone (optional)" {...registerForm.register("phone")} />
            </div>
            <div>
              <Input type="email" placeholder="Email address" {...registerForm.register("email")} />
              {registerForm.formState.errors.email && (
                <p className="text-destructive text-xs mt-1">{registerForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Input type="password" placeholder="Password (min. 8 characters)" {...registerForm.register("password")} />
              {registerForm.formState.errors.password && (
                <p className="text-destructive text-xs mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
              {registerForm.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register"}
            </Button>
          </form>
        ) : (
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <Input type="email" placeholder="Email address" {...loginForm.register("email")} />
            <Input type="password" placeholder="Password" {...loginForm.register("password")} />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
              {loginForm.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link href="/portal/login" className="text-primary font-medium">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New customer?{" "}
              <Link href="/portal/register" className="text-primary font-medium">
                Register
              </Link>
            </>
          )}
        </p>
        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link href="/" className="hover:text-foreground">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
