"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Ticket, Sparkles, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { isPassRegistrationClosed } from "@/lib/passConfig";
import PassClosedModal from "@/components/PassClosedModal";

const EVENT_TARGET_DATE = new Date("2026-10-02T17:00:00+05:30").getTime();

const calculateTimeLeft = () => {
  const now = Date.now();
  const difference = EVENT_TARGET_DATE - now;

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const displayTime = mounted ? timeLeft : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const units = [
    { label: "DAYS", value: displayTime.days },
    { label: "HOURS", value: displayTime.hours },
    { label: "MINS", value: displayTime.minutes },
    { label: "SECS", value: displayTime.seconds },
  ];

  return (
    <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white border-y border-neutral-800 py-6 px-6 relative overflow-hidden shadow-lg">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">

        {/* Left: Event status indicator */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-neutral-800 border border-neutral-700/80 flex items-center justify-center shrink-0 shadow-inner">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                LIVE COUNTDOWN TO STAR NIGHT
              </span>
            </div>
            <div className="text-sm font-semibold text-neutral-200 mt-0.5">
              2nd – 3rd October, 2026 • 5:00 PM • Geeta University Main Ground
            </div>
          </div>
        </div>

        {/* Center: Live Digital Flip Counter */}
        <div className="flex items-center gap-2.5 font-mono">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-2.5">
              <div className="flex flex-col items-center bg-neutral-800/95 border border-neutral-700/90 px-4 py-2.5 rounded-xl min-w-[68px] shadow-md">
                <span
                  suppressHydrationWarning
                  className="text-xl sm:text-2xl font-black text-white tracking-wider"
                >
                  {mounted ? String(unit.value).padStart(2, "0") : "--"}
                </span>
                <span className="text-[9px] text-amber-400/80 font-bold tracking-widest mt-0.5">
                  {unit.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className="text-neutral-500 font-bold text-lg animate-pulse">:</span>
              )}
            </div>
          ))}
        </div>

        {/* Right: Quick Pass CTA */}
        <div className="flex items-center gap-3">
          {isPassRegistrationClosed() ? (
            <button
              type="button"
              onClick={() => setShowClosedModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-neutral-950 text-xs font-black font-mono tracking-wider uppercase hover:brightness-110 transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-neutral-950" />
              <span>Passes Distributed</span>
            </button>
          ) : (
            <Link
              href="/register/guest"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-neutral-950 text-xs font-black font-mono tracking-wider uppercase hover:brightness-110 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-neutral-950" />
              <span>Claim Entry Pass</span>
            </Link>
          )}
        </div>

      </div>

      {/* Passes Closed Modal */}
      <PassClosedModal isOpen={showClosedModal} onClose={() => setShowClosedModal(false)} />
    </div>
  );
}
