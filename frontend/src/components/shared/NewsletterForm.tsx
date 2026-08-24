"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";

interface NewsletterFormProps {
  variant?: "default" | "footer";
  className?: string;
}

export function NewsletterForm({
  variant = "default",
  className,
}: NewsletterFormProps) {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await api.post("/newsletter/subscribe", { email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 text-sm",
          variant === "footer" ? "text-white" : "text-primary",
          className
        )}
      >
        <CheckCircle className="h-5 w-5 shrink-0" />
        <span>Thank you for subscribing!</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col sm:flex-row gap-3", className)}
    >
      <Input
        type="email"
        placeholder={t("footerEmailPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={cn(
          variant === "footer" &&
            "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-secondary/50"
        )}
      />
      <Button
        type="submit"
        variant={variant === "footer" ? "secondary" : "default"}
        disabled={status === "loading"}
        className="shrink-0"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t("footerSubscribe")}
          </>
        )}
      </Button>
      {status === "error" && (
        <p className="text-xs text-red-400 sm:absolute sm:mt-14">
          Failed to subscribe. Please try again.
        </p>
      )}
    </form>
  );
}
