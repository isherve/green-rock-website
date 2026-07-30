"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertySearchBar } from "@/components/shared/PropertySearchBar";
import { SITE_CONFIG } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-end pb-12 lg:pb-16 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
          alt="Premium real estate in Rwanda"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark/85" />
      </div>

      <div className="container relative mx-auto px-4 w-full pt-32">
        <div className="max-w-4xl mb-10 lg:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-semibold text-sm uppercase tracking-[0.25em] mb-4"
          >
            Rwanda · Real Estate · Construction · Supply
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5 font-display"
          >
            Buy, Build & Supply with{" "}
            <span className="text-secondary">{SITE_CONFIG.shortName}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/85 max-w-2xl leading-relaxed mb-6"
          >
            {SITE_CONFIG.description} {SITE_CONFIG.architectureNote}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/properties">
                Browse Properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg border-white/40 text-white bg-white/10 hover:bg-white hover:text-dark">
              <Link href="/contact">List Your Property</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="max-w-5xl"
        >
          <p className="text-white/90 font-medium mb-3 text-sm uppercase tracking-wider">Search Property</p>
          <PropertySearchBar variant="hero" />
        </motion.div>
      </div>
    </section>
  );
}
