"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Green Rock, I'd like to inquire about your services.")}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#128C7E]" />
      </span>
    </motion.a>
  );
}
