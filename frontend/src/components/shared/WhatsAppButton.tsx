import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: "default" | "outline";
}

export function WhatsAppButton({
  message = "Hello Green Rock, I would like to inquire about your services.",
  className,
  variant = "default",
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <Button variant={variant} className={className} asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-4 h-4 mr-2" />
        Chat on WhatsApp
      </a>
    </Button>
  );
}
