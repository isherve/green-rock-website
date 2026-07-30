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
import { isCustomerRole, canAccessEmployeePortal } from "@/lib/roles";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  phone: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: "login" | "register";
  portal: "customer" | "employee";
  redirectPath: string;
}

export function PortalAuthForm({ mode, portal, redirectPath }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  const schema = isRegister ? registerSchema : loginSchema;
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const res = await api.post(endpoint, data);
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      const ok =
        portal === "customer"
          ? isCustomerRole(user.role)
          : canAccessEmployeePortal(user.role);

      if (!ok) {
        localStorage.clear();
        setError(
          portal === "customer"
            ? "This account is not a customer account. Use the employee or admin login."
            : "Employee access required. Contact HR if you need portal access."
        );
        return;
      }

      router.push(redirectPath);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4 py-12">
      <div className="w-full max-w-md pro-card p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Image src={SITE_CONFIG.logo} alt="Logo" width={56} height={56} className="rounded-full mx-auto mb-4" />
          {isRegister ? (
            <UserPlus className="w-7 h-7 text-primary mx-auto mb-2" />
          ) : (
            <Lock className="w-7 h-7 text-primary mx-auto mb-2" />
          )}
          <h1 className="text-2xl font-bold font-display">
            {isRegister ? "Create Account" : "Sign In"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {portal === "customer" ? "Customer Portal" : "Employee Portal"} · {SITE_CONFIG.shortName}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <>
              <Input placeholder="Full name" {...register("name")} />
              <Input placeholder="Phone (optional)" {...register("phone")} />
            </>
          )}
          <Input type="email" placeholder="Email address" {...register("email")} />
          <Input type="password" placeholder="Password" {...register("password")} />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isRegister ? "Register" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link href={portal === "customer" ? "/portal/login" : "/employee/login"} className="text-primary font-medium">
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
