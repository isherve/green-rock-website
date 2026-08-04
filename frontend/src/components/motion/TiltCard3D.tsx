"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard3D({ children, className, intensity = 14 }: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 260, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 260, damping: 22 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * intensity);
    rotateX.set(-y * intensity);
  }

  function handleLeave() {
    setHovering(false);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div className="[perspective:1000px] h-full" style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
        className={cn("transition-shadow duration-300 h-full", hovering && "shadow-2xl shadow-primary/10", className)}
      >
        <div style={{ transform: "translateZ(24px)" }}>{children}</div>
      </motion.div>
    </div>
  );
}
