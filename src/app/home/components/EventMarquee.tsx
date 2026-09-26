"use client";

import { motion } from "framer-motion";

interface EventMarqueeProps {
  className?: string;
}

export default function EventMarquee({ className = "" }: EventMarqueeProps) {
  const items = [
    "AAGAZ 2K26",
    "STAR NIGHT",
    "SUNANDA SHARMA LIVE",
    "GEETA UNIVERSITY",
    "100 PHYSICAL PASSES",
    "SERIAL RANGE # 1100–1200",
    "VERIFIED TURNSTILE ENTRY",
  ];

  // Repeat for continuous seamless scrolling
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative w-full overflow-hidden bg-neutral-50 dark:bg-[#101015] border-y border-neutral-200/90 dark:border-neutral-800 py-3.5 select-none transition-colors ${className}`}>
      {/* Subtle edge fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-50 dark:from-[#101015] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-50 dark:from-[#101015] to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform"
      >
        {marqueeItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 text-xs font-mono tracking-widest uppercase">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-amber-300 transition-colors">
              {item}
            </span>
            <span className="text-orange-500 dark:text-amber-400 font-bold text-sm">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
