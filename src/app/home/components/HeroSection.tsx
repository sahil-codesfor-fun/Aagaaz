"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  Ticket,
  Flame,
  Award,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Scroll parallax for background typography
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth 3D Card Tilt on Mouse Move
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 20 });
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 1024) {
        const { innerWidth, innerHeight } = window;
        const xNorm = e.clientX / innerWidth - 0.5;
        const yNorm = e.clientY / innerHeight - 0.5;
        mouseX.set(xNorm);
        mouseY.set(yNorm);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const isDark = mounted && resolvedTheme === "dark";

  // 24 Sparkling Stardust Constellation Particles (Visible ONLY in Dark Mode)
  const stardustCloud = [
    { cx: 340, cy: 190, r: 1.5, dur: 2.1, delay: 0 },
    { cx: 370, cy: 175, r: 2.5, dur: 2.8, delay: 0.3 },
    { cx: 400, cy: 185, r: 1.2, dur: 3.2, delay: 0.7 },
    { cx: 430, cy: 160, r: 3.2, dur: 2.4, delay: 0.1 },
    { cx: 460, cy: 170, r: 2.0, dur: 3.6, delay: 0.9 },
    { cx: 490, cy: 145, r: 3.0, dur: 2.2, delay: 0.4 },
    { cx: 520, cy: 160, r: 1.8, dur: 2.9, delay: 1.1 },
    { cx: 550, cy: 135, r: 3.5, dur: 2.5, delay: 0.2 },
    { cx: 580, cy: 150, r: 2.2, dur: 3.1, delay: 0.8 },
    { cx: 610, cy: 130, r: 1.6, dur: 2.3, delay: 0.5 },
    { cx: 640, cy: 145, r: 3.8, dur: 2.7, delay: 1.3 },
    { cx: 670, cy: 120, r: 2.4, dur: 3.0, delay: 0.6 },
    { cx: 700, cy: 135, r: 1.8, dur: 2.6, delay: 1.0 },
    { cx: 730, cy: 115, r: 3.2, dur: 3.4, delay: 0.3 },
    { cx: 760, cy: 130, r: 2.0, dur: 2.2, delay: 0.9 },
    { cx: 790, cy: 110, r: 2.8, dur: 2.9, delay: 0.4 },
    { cx: 820, cy: 125, r: 1.5, dur: 3.3, delay: 1.2 },
    { cx: 850, cy: 105, r: 3.2, dur: 2.5, delay: 0.7 },
    { cx: 420, cy: 200, r: 1.5, dur: 3.0, delay: 0.5 },
    { cx: 510, cy: 180, r: 2.2, dur: 2.7, delay: 1.0 },
    { cx: 600, cy: 170, r: 1.8, dur: 3.2, delay: 0.3 },
    { cx: 690, cy: 155, r: 2.8, dur: 2.6, delay: 0.8 },
    { cx: 780, cy: 145, r: 1.6, dur: 3.1, delay: 1.4 },
    { cx: 870, cy: 130, r: 2.5, dur: 2.8, delay: 0.2 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-24 pb-12 sm:pb-16 md:pb-20 overflow-hidden bg-white dark:bg-[#0a0a0c] text-neutral-900 dark:text-white transition-colors duration-300 flex flex-col justify-start lg:justify-center lg:min-h-[calc(100vh-4rem)]"
    >
      {/* Light Mode subtle warm aura / Dark Mode festival backlight */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/20 dark:from-amber-500/25 via-orange-100/15 dark:via-orange-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-rose-100/15 dark:from-rose-500/15 via-amber-100/15 dark:via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1b1b26_1px,transparent_1px),linear-gradient(to_bottom,#1b1b26_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_25%,#000_70%,transparent_100%)] opacity-70 dark:opacity-30 pointer-events-none" />

      {/* Elegant Floating Stardust Sparkles */}
      <div className="absolute top-6 left-0 right-0 h-[400px] pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="gold-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="30%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sparkling Stardust Micro-particles */}
          {stardustCloud.map((pt, i) => (
            <motion.circle
              key={i}
              cx={pt.cx}
              cy={pt.cy}
              r={pt.r * 1.1}
              fill="url(#gold-core)"
              filter="url(#soft-glow)"
              animate={{
                opacity: [0.15, 0.85, 0.15],
                scale: [0.8, 1.25, 0.8],
                y: [-4, 4, -4],
              }}
              transition={{
                duration: pt.dur,
                repeat: Infinity,
                delay: pt.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 w-full my-0 lg:my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* Left Column: Sequential Progressive Entrance */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4 text-left">
            
            {/* Step 1: Live Event Status Badge with Geeta University Branding */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="inline-flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-neutral-100/90 dark:bg-[#101015]/90 border border-neutral-200 dark:border-amber-400/40 shadow-xs dark:shadow-[0_0_14px_rgba(251,191,36,0.18)] text-[10.5px] sm:text-xs font-mono text-neutral-800 dark:text-neutral-200"
            >
              <div className="relative w-4 h-4 rounded-md overflow-hidden bg-white shrink-0">
                <Image
                  src="/geeta_logo.png"
                  alt="Geeta University"
                  width={16}
                  height={16}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="font-bold text-neutral-900 dark:text-white tracking-wider uppercase text-[10.5px] sm:text-[11px]">GEETA UNIVERSITY</span>
              <span className="text-neutral-300 dark:text-amber-500/60 hidden sm:inline">|</span>
              <span className="text-orange-600 dark:text-amber-400 font-bold tracking-wider text-[10.5px] sm:text-[11px]">OFFICIAL STAR NIGHT 2026</span>
            </motion.div>

            {/* Step 2 & 3: Main Typographic Headline */}
            <div className="space-y-0.5 overflow-hidden">
              <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3.5">
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-[0.95] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  AAGAZ
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.92, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-rose-600 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 leading-[0.95] dark:drop-shadow-[0_0_25px_rgba(251,191,36,0.35)]"
                >
                  2K26
                </motion.span>
              </div>

              {/* Step 4: STAR NIGHT Headline with Interactive Letter Hover Lighting */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] select-none"
              >
                <div className="inline-flex flex-wrap group-starnight cursor-pointer py-0.5">
                  {"STAR NIGHT".split("").map((char, index) => (
                    <span
                      key={index}
                      className={`star-night-letter ${char === " " ? "w-2.5 sm:w-4 md:w-5" : ""}`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Step 5: Verified Artist Spotlight Strip with Equalizer Soundwave */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.58 }}
              className="p-3 sm:p-3.5 rounded-2xl bg-neutral-950 dark:bg-[#101015]/95 text-white shadow-xl dark:shadow-[0_0_24px_rgba(0,0,0,0.5)] border border-neutral-800 dark:border-amber-400/40 flex items-center justify-between gap-4 max-w-lg group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-neutral-950 flex items-center justify-center font-bold shadow-[0_0_12px_rgba(251,191,36,0.45)] shrink-0">
                  <Flame className="w-5 h-5 fill-neutral-950" />
                </div>
                <div>
                  <div className="text-[9.5px] font-mono tracking-widest text-amber-300 dark:text-amber-400 uppercase font-semibold">
                    OFFICIAL HEADLINER
                  </div>
                  <div className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                    <span>SUNANDA SHARMA</span>
                    <span className="text-[9px] font-mono font-bold bg-amber-400 text-neutral-950 px-1.5 py-0.5 rounded-full shadow-xs">
                      LIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* Soundwave equalizer bars */}
              <div className="hidden sm:flex items-center gap-1 pr-2">
                {[12, 24, 16, 28, 14, 22, 16, 26].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [6, h, 8, h + 2, 6] }}
                    transition={{ duration: 0.6 + (i % 4) * 0.12, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.7)]"
                  />
                ))}
              </div>
            </motion.div>

            {/* Event Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.68 }}
              className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-lg leading-relaxed"
            >
              Welcome to the official flagship celebration of Aagaz 2K26 at Geeta University. Experience live headline performances by Sunanda Sharma and authenticated digital pass entry.
            </motion.p>

            {/* Step 6: CTAs (Clean in Light Mode, Golden Obsidian in Dark Mode) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.78 }}
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              {/* Register for Entry Pass Button */}
              <Link
                href="/register/guest"
                className={`group flex items-center justify-center gap-2 rounded-xl px-5 py-3 sm:px-6 sm:py-3.5 font-bold text-xs sm:text-sm shadow-md transition-all duration-300 active:scale-95 cursor-pointer relative z-10 ${
                  isDark
                    ? "golden-obsidian-btn hover:-translate-y-0.5"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                }`}
              >
                <span>Register for Entry Pass</span>
                <ArrowRight className="w-4 h-4 text-amber-300 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>

              {/* Festival Schedule Button */}
              <Link
                href="#schedule"
                className={`group flex items-center justify-center gap-2 rounded-xl px-5 py-3 sm:px-6 sm:py-3.5 font-bold text-xs sm:text-sm shadow-md transition-all duration-300 active:scale-95 cursor-pointer relative z-10 ${
                  isDark
                    ? "golden-obsidian-btn hover:-translate-y-0.5"
                    : "border border-neutral-300 hover:bg-neutral-100 text-neutral-900 bg-white"
                }`}
              >
                <span>Festival Schedule</span>
                <span className="text-amber-400 text-xs transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
              </Link>
            </motion.div>

            {/* Verified Pass Quota Pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.88 }}
              className="pt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300 font-mono"
            >
              <div className="flex items-center gap-1.5 bg-neutral-100/90 dark:bg-[#101015]/90 px-3 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 shadow-xs text-[11px]">
                <Award className="w-3.5 h-3.5 text-neutral-700 dark:text-amber-400" />
                <span>Physical Quota: 100 Passes</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 font-bold shadow-xs dark:shadow-[0_0_10px_rgba(251,191,36,0.15)] text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Serial # 1100–1200</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Step 7 - Enlarged & Re-animated VIP Pass Card */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center lg:justify-end">

            {/* VIP Card Container with Enhanced Levitation & 3D Tilt */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -6, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.82, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.6, delay: 0.82, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative group will-change-transform w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[470px] xl:max-w-[520px]"
            >
              {/* Dynamic breathing multi-layer ambient backlight */}
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/30 dark:from-amber-500/35 via-amber-400/25 dark:via-orange-500/30 to-yellow-500/20 rounded-[32px] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute -inset-0.5 bg-gradient-to-b from-amber-400/40 via-transparent to-amber-500/30 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />

              {/* VIP Card Body with Golden Border and Ambient Glow */}
              <div className="relative rounded-3xl bg-neutral-950 dark:bg-[#101015] text-white overflow-hidden shadow-2xl border border-neutral-800 dark:border-amber-400/50 flex flex-col transition-all duration-500 group-hover:border-amber-300 dark:group-hover:border-amber-300 dark:group-hover:shadow-[0_0_40px_rgba(251,191,36,0.35)]">

                {/* VIP Lanyard Header - Enlarged & Polished */}
                <div className="py-2.5 sm:py-3 px-4 sm:px-5 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 dark:from-[#14141a] dark:via-[#101015] dark:to-[#14141a] border-b border-neutral-800 dark:border-amber-400/30 flex items-center justify-between text-xs font-mono relative z-20">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                    </span>
                    <span className="tracking-widest uppercase font-black text-amber-300 text-[11px] sm:text-xs md:text-[13px] drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]">
                      STAR NIGHT VIP PASS
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold font-mono bg-neutral-800/90 dark:bg-amber-950/40 text-amber-300 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-neutral-700 dark:border-amber-500/40 shadow-xs">
                    SERIAL # 1100–1200
                  </div>
                </div>

                {/* Responsive Concert Stage Image Frame (16:9 / 16:10 scaled for Windows Screens) */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full min-h-[220px] sm:min-h-[250px] md:min-h-[275px] max-h-[310px] overflow-hidden bg-neutral-900">
                  <Image
                    src="/aagaaz_concert_2k26.jpg"
                    alt="Sunanda Sharma Live at Aagaz 2K26 Star Night"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 480px, 520px"
                    className="object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Atmospheric concert stage lighting gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 dark:from-[#101015] via-neutral-950/25 dark:via-[#101015]/25 to-transparent pointer-events-none" />
                  
                  {/* Live Stage Indicator Pill with Radar Waves */}
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 bg-red-600/90 backdrop-blur-md text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 shadow-lg border border-red-400/40 z-20">
                    <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                      <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-white" />
                    </span>
                    <Radio className="w-2.5 sm:w-3 h-2.5 sm:h-3 animate-pulse" />
                    <span>LIVE ON STAGE</span>
                  </div>

                  {/* Headliner Badge */}
                  <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 bg-neutral-950/85 backdrop-blur-md border border-amber-400/50 text-amber-300 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl text-[9px] sm:text-[11px] font-mono font-bold shadow-[0_0_12px_rgba(0,0,0,0.8)] flex items-center gap-1.5 z-20">
                    <span>GEETA UNIVERSITY</span>
                  </div>
                </div>

                {/* Card Body & Specs - Roomier & Enhanced Typography */}
                <div className="p-5 sm:p-6 space-y-4 bg-neutral-950 dark:bg-[#101015] relative z-20">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-between">
                      <span>SUNANDA SHARMA</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 dark:text-amber-400/90 font-mono mt-1 flex items-center gap-2">
                      <span>Live Headliner</span>
                      <span className="text-amber-500">•</span>
                      <span>Aagaz 2K26 Star Night</span>
                    </p>
                  </div>

                  {/* 3 Specs Cards with subtle glow */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/90 dark:bg-[#15151c] border border-neutral-800 dark:border-neutral-800/90 hover:border-amber-400/40 transition-colors text-left shadow-inner">
                      <div className="text-[9px] sm:text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Quota</div>
                      <div className="text-xs sm:text-sm font-black text-white mt-1">100 Passes</div>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/90 dark:bg-[#15151c] border border-neutral-800 dark:border-amber-400/30 hover:border-amber-400/60 transition-colors text-left shadow-inner">
                      <div className="text-[9px] sm:text-[10px] font-mono text-amber-400/80 uppercase tracking-wider">Serial</div>
                      <div className="text-xs sm:text-sm font-black text-amber-300 font-mono mt-1">1100–1200</div>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900/90 dark:bg-[#15151c] border border-neutral-800 dark:border-neutral-800/90 hover:border-emerald-400/40 transition-colors text-left shadow-inner">
                      <div className="text-[9px] sm:text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider">Entry</div>
                      <div className="text-xs sm:text-sm font-black text-emerald-400 mt-1 flex items-center gap-1">
                        <span>QR Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Barcode Tear-off Area with Interactive Laser Scanner */}
                  <div className="pt-3.5 border-t border-dashed border-neutral-800 dark:border-neutral-800/90 flex items-center justify-between text-xs text-neutral-400 relative">
                    
                    {/* Gate Barcode with Live Scanning Laser Line */}
                    <div className="space-y-1 relative overflow-hidden py-1 pr-2">
                      <div className="text-[9px] font-mono text-neutral-400 dark:text-neutral-400 uppercase tracking-widest font-semibold">
                        GATE AUTHENTICATION
                      </div>
                      
                      <div className="relative font-mono tracking-[0.25em] text-sm sm:text-base font-bold text-neutral-300 select-none">
                        ||| | |||| || ||||| || |||
                        
                        {/* High-tech Scanning Laser Beam */}
                        <div 
                          className="absolute inset-y-0 w-12 pointer-events-none bg-gradient-to-r from-transparent via-amber-400/80 to-transparent blur-[1px]"
                          style={{
                            animation: "laser-sweep 2.8s infinite ease-in-out",
                          }}
                        />
                      </div>
                    </div>

                    {/* Get Pass Pill Button - Larger & Ultra-Responsive */}
                    <Link
                      href="/register/guest"
                      className={`group px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-black font-mono text-xs sm:text-sm transition-all duration-300 shadow-md cursor-pointer relative z-10 flex items-center gap-2 active:scale-95 shrink-0 ${
                        isDark
                          ? "golden-obsidian-btn hover:-translate-y-0.5"
                          : "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:brightness-110 text-neutral-950 font-bold"
                      }`}
                    >
                      <span>Get Pass</span>
                      <ArrowRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5 ${isDark ? "text-amber-300" : "text-neutral-950"}`} />
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}

