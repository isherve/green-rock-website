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
    defaultValues: { email: "admin@greenrock.com", password: "" },
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
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl">
        <div className="text-center mb-8">
          <Image src={SITE_CONFIG.logo} alt="Logo" width={864} height={864} className="h-16 w-auto max-w-[180px] object-contain mx-auto mb-4" />
          <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-white/60 text-sm mt-2">{SITE_CONFIG.shortName} Dashboard</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input type="email" placeholder="Email" defaultValue="admin@greenrock.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" {...register("email")} />
          <Input type="password" placeholder="Password" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" {...register("password")} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-white/40 text-xs mt-6">
          <Link href="/" className="hover:text-white/70">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
