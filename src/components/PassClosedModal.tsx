"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, TicketX, CheckCircle, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PASS_CLOSED_MESSAGE } from "@/lib/passConfig";

interface PassClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PassClosedModal({ isOpen, onClose }: PassClosedModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-amber-400/40 shadow-2xl overflow-hidden z-10 text-center p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing Top Badge */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-neutral-950 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)]">
                <TicketX className="w-10 h-10 stroke-[2]" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 border-2 border-white dark:border-[#101015] text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Event Mini Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono font-bold text-neutral-600 dark:text-amber-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>GEETA UNIVERSITY • AAGHAZ 2K26</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            {PASS_CLOSED_MESSAGE.title}
          </h3>

          {/* Subtitle */}
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 mt-1">
            {PASS_CLOSED_MESSAGE.subtitle} (12:30 PM Deadline)
          </p>

          {/* Main Message Box */}
          <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-amber-50/80 dark:from-amber-950/30 dark:via-neutral-900/60 dark:to-amber-950/20 border border-amber-200/90 dark:border-amber-500/30 text-neutral-800 dark:text-neutral-200 shadow-sm">
            <p className="text-base sm:text-lg font-bold text-neutral-900 dark:text-amber-300 leading-snug">
              &ldquo;{PASS_CLOSED_MESSAGE.description}&rdquo;
            </p>
          </div>

          {/* Additional Guidance */}
          <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            All registered guests with approved digital passes can proceed directly to the turnstile check-in gate with their QR codes.
          </div>

          {/* Action button */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-center">
            <Button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 dark:golden-obsidian-btn text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 mr-2 text-amber-400" />
              <span>Okay, Got It</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
