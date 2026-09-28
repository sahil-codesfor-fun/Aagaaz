"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Ticket,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
  Loader2,
  Award,
  Star,
  Flame,
  Radio,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";

const registrationOptions = [
  {
    id: "guest",
    title: "Official Golden Pass",
    subtitle: "Authenticated digital QR & physical turnstile admission for Aagaaz 2K26 Star Night.",
    features: [
      "Access to Main Arena & Star Night Concert",
      "Live Headline Performance by Sunanda Sharma",
      "Encrypted Digital QR Check-in Pass",
      "Sequential Turnstile Access (Serial # 1100–1200)",
      "Instant UTR payment verification & email receipt",
    ],
    link: "/register/guest",
    badge: "VIP GOLDEN PASS",
  },
];

export function RegisterSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const go = (link: string, id: string) => {
    setLoading(id);
    router.push(link);
  };

  return (
    <section id="register" className="py-24 bg-neutral-50/80 dark:bg-[#09090d] border-b border-neutral-200/80 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic golden ambient light behind the ticket */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-amber-300/30 via-orange-300/20 to-amber-200/30 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

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
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              03 — Pass Reservation
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
              Claim Your Golden Ticket
            </h2>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
            Reserve your official golden admission pass for Aagaaz 2K26 Star Night featuring Sunanda Sharma at Geeta University.
          </p>
        </motion.div>

        {/* Golden Ticket Showcase Card */}
        <div className="pt-12 max-w-3xl mx-auto">
          {registrationOptions.map((opt) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="relative rounded-3xl bg-gradient-to-br from-amber-100/90 via-amber-50/95 to-orange-100/90 dark:from-neutral-900 dark:via-[#101015] dark:to-neutral-900 border-2 border-amber-300/90 dark:border-amber-400/60 shadow-[0_20px_50px_rgba(245,158,11,0.18)] hover:shadow-[0_25px_60px_rgba(245,158,11,0.28)] transition-all duration-300 overflow-hidden"
            >
              {/* Golden metallic sheen banner across top */}
              <div className="p-4 px-6 sm:px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-neutral-950 flex items-center justify-between border-b border-amber-400/80 shadow-xs">
                <div className="flex items-center gap-2.5 font-mono text-xs font-black tracking-wider uppercase">
                  <span>OFFICIAL VIP GOLDEN TICKET</span>
                  <span className="text-amber-900">•</span>
                  <span className="text-neutral-900 font-bold hidden sm:inline">AAGAAZ 2K26</span>
                </div>
                <div className="text-[11px] font-mono bg-neutral-950 text-amber-300 px-3 py-1 rounded-full font-bold shadow-xs">
                  100 PASSES QUOTA
                </div>
              </div>

              {/* Main Ticket Interior */}
              <div className="p-6 sm:p-10 space-y-8 relative">
                
                {/* Subtle Guilloche / Gold Grid pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#d97706_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                {/* Ticket Brand & Headliner Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-200/80 dark:bg-amber-950/80 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      <span>STAR NIGHT ADMISSION PASS</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white tracking-tight pt-1">
                      Aagaaz 2K26 Star Night Pass
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium max-w-md">
                      Official turnstile admittance for <strong>Sunanda Sharma Live Concert</strong> at Geeta University.
                    </p>
                  </div>

                  {/* Golden Seal Emblem */}
                  <div className="flex flex-col items-start sm:items-end justify-center shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-200 shadow-md flex flex-col items-center justify-center text-neutral-950 p-1 text-center">
                      <Award className="w-6 h-6 text-neutral-950 fill-neutral-950/20" />
                      <span className="text-[8px] font-mono font-black uppercase tracking-tighter mt-0.5">
                        OFFICIAL SEAL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ticket Inclusions Grid */}
                <div className="space-y-3 pt-4 border-t border-amber-300/60 dark:border-neutral-800 relative z-10">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-600 dark:text-amber-400" />
                    <span>Verified Pass Privileges & Access Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opt.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2.5 text-xs text-neutral-800 dark:text-neutral-200 font-medium">
                        <div className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perforated Stub Section & CTA with Realistic Cutout Notches */}
                <div className="relative pt-6 border-t-2 border-dashed border-amber-400/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-5 z-10 -mx-6 sm:-mx-10 px-6 sm:px-10">
                  
                  {/* Left Physical Ticket Cutout Notch */}
                  <div className="absolute -left-3.5 -top-3.5 w-7 h-7 rounded-full bg-neutral-50 dark:bg-[#09090d] border-2 border-amber-400/90 dark:border-amber-400/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] z-20 hidden sm:block" />
                  
                  {/* Right Physical Ticket Cutout Notch */}
                  <div className="absolute -right-3.5 -top-3.5 w-7 h-7 rounded-full bg-neutral-50 dark:bg-[#09090d] border-2 border-amber-400/90 dark:border-amber-400/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)] z-20 hidden sm:block" />
                  
                  {/* Left: Barcode & Serial Allocation */}
                  <div className="space-y-1 text-left self-start sm:self-auto">
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-900 dark:text-white font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>ALLOCATED SERIAL: # 1100–1200</span>
                    </div>
                    <div className="text-xs font-mono tracking-widest text-neutral-700 dark:text-neutral-400 font-bold">
                      |||| | |||| || ||||| |||| |||
                    </div>
                  </div>

                  {/* Right: Golden Glowing Action Button */}
                  <Button
                    onClick={() => go(opt.link, opt.id)}
                    disabled={loading !== null}
                    className="group w-full sm:w-auto bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 hover:from-neutral-900 hover:to-neutral-800 text-amber-300 border border-amber-400/50 hover:border-amber-400 px-8 py-6 text-sm font-black font-mono rounded-2xl transition-all duration-300 active:scale-95 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 hover:-translate-y-0.5 cursor-pointer dark:golden-obsidian-btn"
                  >
                    {loading === opt.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Redirecting to Booking...</span>
                      </>
                    ) : (
                      <>
                        <span className="tracking-wide relative z-10">REGISTER FOR GOLDEN PASS</span>
                        <ArrowRight className="w-4 h-4 text-amber-400 transition-transform duration-200 group-hover:translate-x-1.5 relative z-10" />
                      </>
                    )}
                  </Button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
