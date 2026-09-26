"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Sparkles, Music, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  const highlights = [
    {
      icon: Music,
      title: "Star Night Live Concert",
      desc: "Live performance by Sunanda Sharma featuring top Punjabi pop hits, acoustic sets, and an electrifying campus atmosphere.",
      badge: "Headline Set",
    },
    {
      icon: Users,
      title: "7000+ Students & Guests",
      desc: "A massive gathering of students, faculty, alumni, and registered guests coming together for the grand annual welcome.",
      badge: "Campus Wide",
    },
    {
      icon: ShieldAlert,
      title: "Verified Entry Access",
      desc: "Strict QR-authenticated access and unique serial distribution ensures streamlined, hassle-free gate entries.",
      badge: "Secured Turnstiles",
    },
  ];

  return (
    <section id="about" className="py-24 bg-neutral-50/70 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Section Header with Staggered Motion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-neutral-200"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              01 — The Celebration
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Welcome to Freshers 2K26
            </h2>
          </div>
          <p className="text-sm text-neutral-600 max-w-md leading-relaxed">
            Geeta University's flagship annual cultural fest, uniting talent, music, and energy across two unforgettable days on campus.
          </p>
        </motion.div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-start">
          
          {/* Left Column: Event Context & Specifications */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              An Unforgettable Night of Rhythm, Energy & Memories
            </h3>
            
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Freshers 2K26 is more than a concert — it is a milestone festival commemorating new beginnings for the incoming batch while bringing together the entire campus community in high spirits.
            </p>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-4 hover:border-neutral-300 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Official Event Blueprint
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Confirmed Schedule
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-neutral-900">Date & Timing</div>
                  <div className="text-neutral-500 text-xs mt-0.5">2nd – 3rd October, 2026 • 5:00 PM Onwards</div>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Venue Location</div>
                  <div className="text-neutral-500 text-xs mt-0.5">Main Arena, Geeta University Campus, Panipat</div>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Pass Entry Quota</div>
                  <div className="text-neutral-500 text-xs mt-0.5 font-mono">100 Physical Passes • Serial No. 1100–1200</div>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Host Committee</div>
                  <div className="text-neutral-500 text-xs mt-0.5">Team DSW & Student Cultural Council</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3 Feature Cards with Staggered Scroll Motion */}
          <div className="lg:col-span-6 space-y-4">
            {highlights.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: idx * 0.12 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 transition-all duration-200 shadow-2xs hover:shadow-md flex items-start justify-between gap-4 cursor-default group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-900 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-neutral-900">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 shrink-0 hidden sm:inline-block">
                  {item.badge}
                </span>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
