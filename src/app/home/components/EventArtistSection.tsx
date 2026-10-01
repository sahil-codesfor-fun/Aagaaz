"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Music2,
  Users,
  ShieldCheck,
  Flame,
  Radio,
  Play,
  Disc,
  ArrowRight,
  Ticket,
  Award,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventArtistSection() {
  const [activeTrack, setActiveTrack] = useState<string>("Jaani Tera Naa");

  const hitTracks = [
    { title: "Jaani Tera Naa", tag: "Blockbuster", type: "Hit Single" },
    { title: "Patake", tag: "Trending Hit", type: "Dance Anthem" },
    { title: "Mummy Nu Pasand", tag: "Party Anthem", type: "Chart Topper" },
    { title: "Duji Vaar Pyar", tag: "Romantic Single", type: "Viral Hit" },
    { title: "Koke", tag: "Crowd Favorite", type: "Fan Special" },
  ];

  const festivalHighlights = [
    {
      icon: Music2,
      title: "Star Night Live Performance",
      desc: "Sunanda Sharma performing live on the main stage with full band production and high-voltage Punjabi pop music.",
      badge: "Main Stage",
    },
    {
      icon: Users,
      title: "Aaghaz 2K26 Cultural Fest",
      desc: "The flagship annual cultural celebration welcoming incoming students and uniting the Geeta University community.",
      badge: "Aaghaz 2K26",
    },
    {
      icon: ShieldCheck,
      title: "Verified Pass Protocol",
      desc: "Instant QR ticket authentication and turnstile verification at gate entry.",
      badge: "Verified Entry",
    },
  ];

  return (
    <section id="about" className="py-6 sm:py-8 lg:py-10 bg-white dark:bg-[#09090d] border-b border-neutral-200/80 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* Anchor for #artist */}
      <div id="artist" className="absolute -top-16" />

      {/* Subtle warm ambient illumination */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-100/30 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-orange-100/20 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 w-full">
        
        {/* Editorial Section Intro - Compact Height */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-neutral-200 dark:border-neutral-800"
        >
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-neutral-500 dark:text-amber-400/90 uppercase">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              01 — The Headliner & Celebration
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
              Sunanda Sharma Live in Concert
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-neutral-100 dark:bg-neutral-900 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-2xs self-start sm:self-auto">
            <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
            <span className="text-neutral-800 dark:text-neutral-200 font-bold text-xs">Aaghaz 2K26 Star Night • Geeta University</span>
          </div>
        </motion.div>

        {/* Main Grid: Fits on Single Page */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 pt-4 sm:pt-5 items-stretch">
          
          {/* Left Column: Clean Scaled Official Festival Poster (Enlarged) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative group flex flex-col"
          >
            {/* Ambient golden festival backlight */}
            <div className="absolute -inset-2.5 bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-yellow-500/20 rounded-3xl blur-2xl opacity-65 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none" />

            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 text-white shadow-2xl border border-neutral-800 dark:border-amber-400/40 flex flex-col justify-between h-full transition-all duration-300 group-hover:border-amber-400/70 group-hover:shadow-[0_20px_50px_rgba(251,191,36,0.25)]">
              
              {/* Sleek Top Lanyard Bar */}
              <div className="py-2.5 px-4 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800 dark:border-amber-400/30 flex items-center justify-between text-xs font-mono relative z-10 shrink-0">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold tracking-wider text-[11px] sm:text-xs">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                  <span>OFFICIAL EVENT POSTER</span>
                </div>
                <div className="text-[10.5px] font-mono font-bold bg-amber-400/15 text-amber-300 px-2.5 py-0.5 rounded border border-amber-400/30">
                  GEETA UNIVERSITY
                </div>
              </div>

              {/* Pristine Enlarged Poster Container */}
              <div className="relative w-full h-[430px] sm:h-[470px] lg:h-[490px] xl:h-[520px] bg-neutral-950 overflow-hidden flex items-center justify-center p-1.5">
                <Image
                  src="/poster2.jpeg"
                  alt="Sunanda Sharma Live Concert Official Poster - Aaghaz 2K26 Geeta University"
                  fill
                  sizes="(max-width: 768px) 100vw, 550px"
                  className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
              </div>

              {/* Streamlined Pass Booking Action Bar */}
              <div className="p-3.5 sm:p-4 bg-neutral-950 border-t border-neutral-800/80 dark:border-neutral-800 space-y-3 shrink-0">
                {/* 3 Quick Specs */}
                <div className="grid grid-cols-3 gap-2.5 text-left font-mono">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                    <div className="text-[8.5px] sm:text-[9px] text-neutral-400 uppercase font-semibold">Access</div>
                    <div className="text-xs sm:text-[13px] font-bold text-white leading-tight mt-0.5">All Students</div>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                    <div className="text-[8.5px] sm:text-[9px] text-neutral-400 uppercase font-semibold">Pass Type</div>
                    <div className="text-xs sm:text-[13px] font-bold text-amber-300 leading-tight mt-0.5">Digital QR</div>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                    <div className="text-[8.5px] sm:text-[9px] text-neutral-400 uppercase font-semibold">Entry</div>
                    <div className="text-xs sm:text-[13px] font-bold text-emerald-400 leading-tight mt-0.5">QR Verified</div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-neutral-950 font-bold text-xs sm:text-sm py-3.5 sm:py-4 rounded-xl shadow-md transition-all dark:golden-obsidian-btn cursor-pointer"
                >
                  <Link href="/register/guest" className="flex items-center justify-center gap-2 relative z-10">
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span>Book Pass for Star Night →</span>
                  </Link>
                </Button>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Festival Highlights + Interactive Track Showcase */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* 3 Festival Pillars - Compact 3-Col Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {festivalHighlights.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  whileHover={{ y: -2 }}
                  className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50/90 dark:bg-[#101015] border border-neutral-200/90 dark:border-neutral-800 shadow-2xs hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-amber-400 group-hover:bg-neutral-900 dark:group-hover:bg-amber-400 group-hover:text-white dark:group-hover:text-neutral-950 transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9.5px] font-mono uppercase tracking-wider text-neutral-600 dark:text-amber-300 bg-white dark:bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 font-semibold">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-neutral-900 dark:text-white leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Interactive Concert Setlist & Popular Hits */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/90 dark:bg-[#101015] border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="space-y-0.5">
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Disc className="w-4 h-4 text-orange-600 dark:text-amber-400 animate-spin-slow" />
                    Featured Concert Setlist & Popular Anthems
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Popular hits performed by Sunanda Sharma:
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-900 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                  <Volume2 className="w-3.5 h-3.5 text-neutral-800 dark:text-amber-400" />
                  <span>Top Hits</span>
                </div>
              </div>

              {/* Tracks List */}
              <div className="space-y-2">
                {hitTracks.map((track, i) => {
                  const isSelected = activeTrack === track.title;

                  return (
                    <motion.div
                      key={track.title}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      whileHover={{ x: 2 }}
                      onClick={() => setActiveTrack(track.title)}
                      className={`py-2 px-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-neutral-950 dark:bg-neutral-900 text-white border-neutral-900 dark:border-amber-400/50 shadow-xs scale-[1.005]"
                          : "bg-white dark:bg-[#14141c] border-neutral-200 dark:border-neutral-800/80 hover:bg-neutral-100/90 dark:hover:bg-neutral-800/60 text-neutral-900 dark:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                            isSelected ? "bg-amber-400 text-neutral-950" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          0{i + 1}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm flex items-center gap-2 leading-tight">
                            <span>{track.title}</span>
                            {isSelected && (
                              <span className="text-[9px] font-mono bg-amber-400 text-neutral-950 px-2 py-0.2 rounded-full font-bold">
                                PLAYING
                              </span>
                            )}
                          </div>
                          <div className={`text-[10.5px] font-mono ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>
                            {track.type}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold hidden sm:inline-block ${
                            isSelected
                              ? "bg-neutral-800 border-neutral-700 text-amber-300"
                              : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {track.tag}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition shrink-0 ${
                            isSelected ? "bg-amber-400 text-neutral-950" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Compact Pass Issuance & Verification Protocol Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="p-3 px-4.5 rounded-xl bg-neutral-50/90 dark:bg-[#101015] border border-neutral-200/90 dark:border-neutral-800 shadow-2xs flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 shrink-0">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-900 dark:text-amber-300 font-bold">
                  Turnstile Protocol:
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                Fast turnstile verification for all registered attendee <strong className="text-neutral-900 dark:text-white">QR passes</strong>.
              </p>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
