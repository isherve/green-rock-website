"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { SITE_CONFIG } from "@/lib/constants";
import { canAccessAdmin } from "@/lib/roles";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "ishimwehervin10@gmail.com", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const res = await api.post("/auth/login", data);
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (!canAccessAdmin(user?.role)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setError("Access denied. Admin credentials required.");
        return;
      }
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Invalid credentials";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] dark:bg-slate-950 px-4">
      <div className="w-full max-w-md clean-card p-8">
        <div className="text-center mb-8">
          <Image src={SITE_CONFIG.logo} alt="Logo" width={864} height={864} unoptimized className="h-16 w-auto max-w-[180px] object-contain mx-auto mb-4" />
          <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold font-display">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-2">{SITE_CONFIG.shortName} Dashboard</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input type="email" placeholder="Email" defaultValue="ishimwehervin10@gmail.com" {...register("email")} />
          <Input type="password" placeholder="Password" {...register("password")} />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-muted-foreground text-xs mt-6">
          <Link href="/" className="hover:text-primary">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
