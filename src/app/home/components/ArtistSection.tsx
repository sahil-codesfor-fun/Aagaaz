"use client";

import { motion } from "framer-motion";
import { Mic, Music2, Sparkles, Award, Radio, Play, Volume2, Flame, Disc, TrendingUp, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ArtistSection() {
  const [activeTrack, setActiveTrack] = useState<string>("Jaani Tera Naa");

  const hitTracks = [
    { title: "Jaani Tera Naa", tag: "Blockbuster", plays: "500M+ Streams", year: "Hit Single" },
    { title: "Patake", tag: "Trending Hit", plays: "350M+ Streams", year: "Dance Anthem" },
    { title: "Mummy Nu Pasand", tag: "Party Anthem", plays: "420M+ Streams", year: "Chart Topper" },
    { title: "Duji Vaar Pyar", tag: "Romantic Single", plays: "280M+ Streams", year: "Viral Hit" },
    { title: "Koke", tag: "Crowd Favorite", plays: "210M+ Streams", year: "Fan Special" },
  ];

  return (
    <section id="artist" className="py-24 bg-white border-b border-neutral-200/80 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-neutral-200"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
              02 — Live Performance Headliner
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900">
              Sunanda Sharma Live in Concert
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-neutral-100 px-4 py-2 rounded-full border border-neutral-200 shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="text-neutral-800 font-bold">Star Night Main Stage • 3rd October</span>
          </div>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 items-center">
          
          {/* Left Column: Visual Concert Poster Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 relative group"
          >
            <div className="relative rounded-3xl overflow-hidden bg-neutral-950 shadow-2xl border border-neutral-800">
              
              {/* Image Container with Concert Photography */}
              <div className="relative aspect-[2/3] w-full bg-neutral-950 overflow-hidden">
                <Image
                  src="/poster.jpeg"
                  alt="Sunanda Sharma Star Night Concert Poster"
                  fill
                  className="object-contain sm:object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              {/* Streamlined Pass Booking & Quota Action Bar */}
              <div className="p-5 bg-neutral-950 text-white space-y-3.5 relative z-10 border-t border-neutral-800">
                <div className="grid grid-cols-3 gap-2 text-left font-mono">
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="text-[9px] text-neutral-400 uppercase">Quota</div>
                    <div className="text-xs font-bold text-white mt-0.5">100 Passes</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="text-[9px] text-neutral-400 uppercase">Serial</div>
                    <div className="text-xs font-bold text-amber-300 mt-0.5"># 1100–1200</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="text-[9px] text-neutral-400 uppercase">Entry</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">QR Verified</div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Interactive Setlist Player & Stream Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <Disc className="w-5 h-5 text-neutral-800 animate-spin-slow" />
                Featured Concert Setlist & Blockbusters
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500">
                Click any track to view streaming highlights and concert anthem stats:
              </p>
            </div>

            {/* Setlist track list */}
            <div className="space-y-2.5">
              {hitTracks.map((track, i) => {
                const isSelected = activeTrack === track.title;

                return (
                  <motion.div
                    key={track.title}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTrack(track.title)}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-neutral-950 text-white border-neutral-900 shadow-lg scale-[1.01]"
                        : "bg-neutral-50/90 border-neutral-200/90 hover:bg-neutral-100/90 text-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? "bg-amber-400 text-neutral-950" : "bg-neutral-200/80 text-neutral-700"
                      }`}>
                        0{i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                          <span>{track.title}</span>
                          {isSelected && (
                            <span className="text-[10px] font-mono bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-full font-bold">
                              NOW PLAYING
                            </span>
                          )}
                        </div>
                        <div className={`text-[11px] font-mono mt-0.5 ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>
                          {track.plays} • {track.year}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono px-3 py-1 rounded-full border font-semibold ${
                        isSelected
                          ? "bg-neutral-800 border-neutral-700 text-amber-300"
                          : "bg-white border-neutral-200 text-neutral-700"
                      }`}>
                        {track.tag}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                        isSelected ? "bg-amber-400 text-neutral-950" : "bg-neutral-200 text-neutral-700"
                      }`}>
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Advisory Info Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-2xs">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong>Main Stage Pavilion Access:</strong> Admission into the concert enclosure is strictly restricted to valid pass holders (Serial Numbers 1100–1200) verified at the turnstile gate.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
