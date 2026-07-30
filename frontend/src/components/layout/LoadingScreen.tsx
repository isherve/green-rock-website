"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

interface LoadingScreenProps {
  duration?: number;
}

export function LoadingScreen({ duration = 2000 }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <Image
                src={SITE_CONFIG.logo}
                alt={`${SITE_CONFIG.name} logo`}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover shadow-xl"
                priority
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-secondary"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                Green Rock
              </h2>
              <p className="text-sm text-muted-foreground">
                General Supply Ltd
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
