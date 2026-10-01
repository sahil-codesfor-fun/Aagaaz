"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, Music, Star, Trophy, Users, Flame, ShieldCheck } from "lucide-react";

interface ScheduleItem {
  time: string;
  title: string;
  venue: string;
  tag: string;
  desc: string;
  featured?: boolean;
}

export default function ScheduleSection() {
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day2");

  const scheduleData: Record<"day1" | "day2", ScheduleItem[]> = {
    day1: [
      {
        time: "Morning Slot",
        title: "Inauguration & Cultural Pageant",
        venue: "University Auditorium",
        tag: "Opening Ceremony",
        desc: "Traditional welcome, cultural exhibitions, and opening address by Geeta University leadership.",
        featured: false,
      },
      {
        time: "Afternoon Slot",
        title: "Inter-Department Talent Competitions",
        venue: "University Arena",
        tag: "Cultural Showcase",
        desc: "Live student talent showcases, music performances, and creative arts events.",
        featured: false,
      },
      {
        time: "Evening Slot",
        title: "Electronic DJ Night & Stage Beats",
        venue: "Main Grounds",
        tag: "Aaghaz Beats",
        desc: "High-energy music and visual stage lighting to inaugurate the Aaghaz 2K26 fest.",
        featured: false,
      },
    ],
    day2: [
      {
        time: "Day Session",
        title: "Aaghaz 2K26 Carnival, Stalls & Exhibitions",
        venue: "Boulevard & Arena",
        tag: "Festival Grounds",
        desc: "Student innovation stalls, cultural displays, and interactive festival activities.",
        featured: false,
      },
      {
        time: "Gate Entry Window",
        title: "Turnstile Gate Open & VIP Pass Validation",
        venue: "Main Turnstiles",
        tag: "Gate Check-In",
        desc: "Fast QR code scanning and instant digital pass validation at the entry gates.",
        featured: false,
      },
      {
        time: "06:00 PM Onwards • Sat, 3rd Oct",
        title: "STAR NIGHT LIVE: SUNANDA SHARMA IN CONCERT",
        venue: "Geeta University Main Arena (Panipat)",
        tag: "OFFICIAL HEADLINER",
        featured: true,
        desc: "The blockbuster live headline performance by Sunanda Sharma featuring top hit anthems, full production sound, and visual stage show.",
      },
    ],
  };

  return (
    <section id="schedule" className="py-24 bg-neutral-50/70 dark:bg-[#09090d] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-neutral-200 dark:border-neutral-800"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-500 dark:text-amber-400/90 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-amber-400" />
              02 — Event Timeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Festival Itinerary & Schedule
            </h2>
          </div>

          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 bg-neutral-200/70 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-300/60 dark:border-neutral-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveDay("day1")}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                activeDay === "day1"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              DAY 01 • CULTURAL FEST
            </button>
            <button
              onClick={() => setActiveDay("day2")}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeDay === "day2"
                  ? "bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-950 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 dark:fill-neutral-950 text-amber-400 dark:text-neutral-950" />
              <span>DAY 02 • STAR NIGHT</span>
            </button>
          </div>
        </motion.div>

        {/* Timeline Items */}
        <div className="pt-12 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {scheduleData[activeDay].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className={`group relative p-6 sm:p-7 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    item.featured
                      ? "bg-neutral-950 text-white border-neutral-900 dark:border-amber-400/60 shadow-xl hover:shadow-2xl dark:hover:shadow-[0_15px_35px_rgba(251,191,36,0.25)] hover:border-amber-400"
                      : "bg-white dark:bg-[#101015] text-neutral-900 dark:text-white border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:border-neutral-900 dark:hover:border-amber-400/80 dark:hover:shadow-[0_12px_30px_rgba(251,191,36,0.15)]"
                  }`}
                >
                  {/* Subtle Golden Hover Accent Light Stream on Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-amber-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Left Highlight Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
                    item.featured
                      ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                      : "bg-transparent group-hover:bg-orange-500 dark:group-hover:bg-amber-400 group-hover:shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                  }`} />

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-neutral-100 dark:border-neutral-800/80">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <Clock className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${item.featured ? "text-amber-400" : "text-neutral-500 group-hover:text-orange-600 dark:text-amber-400"}`} />
                        <span className={`transition-colors duration-200 ${item.featured ? "text-amber-300 font-bold" : "text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-amber-300 font-semibold"}`}>
                          {item.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase font-bold tracking-wider transition-all duration-200 ${
                          item.featured
                            ? "bg-amber-400 text-neutral-950 shadow-xs"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 group-hover:bg-orange-500 group-hover:text-white dark:group-hover:bg-amber-400 dark:group-hover:text-neutral-950 group-hover:border-transparent"
                        }`}>
                          {item.tag}
                        </span>
                        <span className={`text-xs flex items-center gap-1 font-mono transition-colors duration-200 ${
                          item.featured ? "text-neutral-400" : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
                        }`}>
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 group-hover:text-orange-500 dark:group-hover:text-amber-400 transition-colors duration-200" /> {item.venue}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-1.5">
                      <h3 className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-200 ${
                        item.featured
                          ? "text-white"
                          : "text-neutral-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-amber-300"
                      }`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${
                        item.featured ? "text-neutral-300" : "text-neutral-500 dark:text-neutral-400"
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
