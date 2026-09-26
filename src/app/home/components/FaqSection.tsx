"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, ShieldCheck, Ticket, Calendar } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How will I receive my check-in ticket after payment?",
      a: "Once you complete registration and enter your valid 12-digit transaction UTR number, our university accounts department confirms payment in the ledger. Your encrypted check-in QR code entry ticket is then automatically emailed to your registered address.",
    },
    {
      q: "What is the physical pass serial number range (1100–1200)?",
      a: "Freshers 2K26 has an allocated physical badge quota of 100 passes with serial numbers strictly ranging from 1100 to 1200. These serial numbers are logged into the database and mapped to your registration ID for turnstile verification.",
    },
    {
      q: "Can I register multiple attendees in one transaction?",
      a: "Yes! You can click 'Add Another Guest' on the registration page to add companions under your booking. The ledger dynamically updates the subtotal and applies any valid promo coupon discount across the entire group.",
    },
    {
      q: "What credentials do I need to present at the gate scanner?",
      a: "Attendees must present the digital QR code (received via email) on their phone along with a government-issued photo ID (Aadhaar/Driving License/College ID) and your physical badge if collected in advance.",
    },
    {
      q: "What is the poster approval policy before social media sharing?",
      a: "According to Festify and university governance guidelines, official event posters and marketing creatives must complete the 4-stage review pipeline (Draft → DSW Review → Administrative Approval → Ready to Publish) before being broadcast on official social channels.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-[#09090d] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 pb-12"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-500 dark:text-amber-400/90 uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-700 dark:text-amber-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            Everything you need to know about passes, gate check-in, UTR verification, and event rules.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-neutral-50/90 dark:bg-[#101015] border-neutral-300 dark:border-amber-400/50 shadow-2xs"
                    : "bg-white dark:bg-[#101015]/60 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? "bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-950" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-200/50 dark:border-neutral-800">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
