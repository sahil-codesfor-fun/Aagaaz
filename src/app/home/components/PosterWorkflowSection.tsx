"use client";

import { motion } from "framer-motion";
import { FileEdit, Eye, CheckCircle2, Share2, AlertCircle, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function PosterWorkflowSection() {
  const stages = [
    {
      step: "01",
      title: "Preparation & Draft",
      icon: FileEdit,
      status: "Completed",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "Event creatives, artist typography (Sunanda Sharma), dates, and university branding assembled according to Festify guidelines.",
    },
    {
      step: "02",
      title: "DSW & Committee Review",
      icon: Eye,
      status: "Completed",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "Verification of event details, venue safety protocols, sponsor positioning, and pass distribution workflows.",
    },
    {
      step: "03",
      title: "Administrative Approval",
      icon: CheckCircle2,
      status: "Approved",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "Formal sign-off by Geeta University administration authorizing official digital dissemination.",
    },
    {
      step: "04",
      title: "Social Media Publishing",
      icon: Share2,
      status: "Ready to Publish",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      desc: "Authorized broadcast across Instagram, WhatsApp channels, and the Festify event network.",
    },
  ];

  return (
    <section id="workflow" className="py-24 bg-white border-b border-neutral-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Header with Motion */}
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
              04 — Media & Governance
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Poster Preparation & Approval Workflow
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-neutral-100 px-3.5 py-1.5 rounded-full border border-neutral-200">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-800" />
            <span>Festify Standard Protocol</span>
          </div>
        </motion.div>

        {/* 4 Pipeline Stages with Animated Connecting Line */}
        <div className="relative pt-12">
          
          {/* Animated horizontal connecting bar for desktop */}
          <div className="hidden lg:block absolute top-[68px] left-12 right-12 h-0.5 bg-neutral-200 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeInOut" }}
              className="h-full bg-neutral-900 origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {stages.map((stage, idx) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.12 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-neutral-50/80 border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all shadow-2xs hover:shadow-md space-y-4 flex flex-col justify-between group cursor-default"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 shadow-2xs group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      <stage.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-neutral-400 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      STAGE {stage.step}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-neutral-900">
                      {stage.title}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    State
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-medium ${stage.badgeClass}`}>
                    {stage.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Advisory Banner with subtle fade */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 p-4 rounded-xl bg-neutral-100/70 border border-neutral-200 flex items-center gap-3 text-xs text-neutral-600"
        >
          <AlertCircle className="w-4 h-4 text-neutral-700 shrink-0" />
          <span>
            <strong>Governance Note:</strong> All official event promotional collateral must complete the multi-tier review cycle and obtain formal administrative sign-off prior to public distribution on social media.
          </span>
        </motion.div>

      </div>
    </section>
  );
}
