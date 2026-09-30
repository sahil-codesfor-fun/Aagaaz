"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Ticket, QrCode, ShieldCheck, Hash, Layers, CheckCircle2, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PassDistributionSection() {
  const steps = [
    {
      num: "01",
      title: "Online Pass Registration",
      desc: "Register primary and companion guest details, submit required credentials, and calculate subtotal.",
    },
    {
      num: "02",
      title: "Direct UPI & UTR Verification",
      desc: "Transfer registration amount to the university account and submit your 12-digit transaction UTR number.",
    },
    {
      num: "03",
      title: "Encrypted QR Pass Issuance",
      desc: "Following accounts confirmation, your digital QR pass ticket is immediately dispatched to your email inbox.",
    },
    {
      num: "04",
      title: "Gate Turnstile Fast-Track",
      desc: "Present your encrypted QR code pass at the venue turnstile gate for instant scan-and-go admission.",
    },
  ];

  return (
    <section id="passes" className="py-24 bg-neutral-50/70 border-b border-neutral-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Header */}
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
              03 — Pass Management System
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900">
              Freshers 2K26 Pass Distribution
            </h2>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs font-mono text-neutral-500 uppercase font-semibold">Pass Verification</div>
            <div className="text-xl font-bold font-mono text-neutral-900 flex items-center md:justify-end gap-2 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>DIGITAL QR PASS SYSTEM</span>
            </div>
          </div>
        </motion.div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-default group"
          >
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 transition-colors group-hover:bg-neutral-950 group-hover:text-white">
              <Ticket className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
              Registration Status
            </div>
            <div className="text-3xl sm:text-4xl font-black text-neutral-900">
              Open Passes
            </div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-neutral-900 h-full rounded-full"
              />
            </div>
            <p className="text-xs text-neutral-500">
              Direct digital pass reservation open for all eligible students.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-default group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <Hash className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
              Pass Validation
            </div>
            <div className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono">
              Digital QR
            </div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-amber-500 h-full rounded-full"
              />
            </div>
            <p className="text-xs text-neutral-500">
              Unique encrypted QR passes mapped directly with database records.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-default group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
              Security Protocol
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">
              Instant Scan
            </div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
            <p className="text-xs text-neutral-500">
              Encrypted QR ticket scan at turnstile gate with instant check-in.
            </p>
          </motion.div>

        </div>

        {/* Realistic Physical Pass Showcase Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200 shadow-lg space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <span className="text-xs font-mono uppercase text-orange-600 font-bold tracking-widest">
                VERIFIED PASS SYSTEM
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1">
                Pass Lifecycle & Turnstile Issuance Pipeline
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-neutral-100 px-3 py-1 rounded-md text-neutral-700 font-bold">
                Open Registration
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
                className="space-y-3 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 hover:bg-neutral-100/80 transition shadow-2xs"
              >
                <div className="text-xs font-mono font-bold text-neutral-900 px-3 py-1 bg-white rounded-lg inline-block border border-neutral-200 shadow-2xs">
                  STAGE {s.num}
                </div>
                <h4 className="text-sm font-bold text-neutral-900">
                  {s.title}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-500 font-medium">
              Need assistance with your pass registration or UTR verification? Contact team DSW.
            </div>
            <Button
              asChild
              size="lg"
              className="group bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-7 rounded-xl shadow-md active:scale-98 transition-all"
            >
              <Link href="/register/guest" className="flex items-center gap-2">
                <span>Book Guest Pass Now</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
