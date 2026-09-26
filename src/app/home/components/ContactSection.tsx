"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Loader2, Send, Clock, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const MapEmbed = dynamic(() => import("@/components/ui/MapEmbed"), { ssr: false });

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const formData = {
      name: (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value,
      email: (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value,
      subject: (e.currentTarget.elements.namedItem("subject") as HTMLInputElement).value,
      message: (e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setAlert({ type: "success", msg: "Your message has been sent successfully. Team DSW will get back to you shortly." });
      formRef.current?.reset();
    } catch {
      setAlert({ type: "error", msg: "Failed to send message. Please reach out to the helpdesk phone directly." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-[#09090d] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Header with Motion */}
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
              06 — Support & Inquiries
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Get in Touch
            </h2>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
            Have questions regarding pass issuance, UTR verification, or campus directions? Reach out to the organizing team.
          </p>
        </motion.div>

        {/* 2-Column Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 items-start">
          
          {/* Left: Functional Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 p-8 rounded-2xl bg-neutral-50/70 dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neutral-700 dark:text-amber-400" />
                Send a Direct Message
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Inquiries are monitored by Team DSW and student coordinators.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Your Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus-visible:ring-neutral-900 dark:focus-visible:ring-amber-400 text-neutral-900 dark:text-white text-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus-visible:ring-neutral-900 dark:focus-visible:ring-amber-400 text-neutral-900 dark:text-white text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Subject / Query Topic
                </label>
                <Input
                  id="subject"
                  placeholder="e.g. Pass Verification / Entry Gate Query"
                  className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus-visible:ring-neutral-900 dark:focus-visible:ring-amber-400 text-neutral-900 dark:text-white text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Message Description
                </label>
                <Textarea
                  id="message"
                  placeholder="Please describe your question or requirement..."
                  className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus-visible:ring-neutral-900 dark:focus-visible:ring-amber-400 text-neutral-900 dark:text-white min-h-[120px] text-xs leading-relaxed"
                  required
                />
              </div>

              {alert && (
                <div
                  className={`text-xs rounded-lg px-3.5 py-2.5 font-medium ${
                    alert.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  }`}
                >
                  {alert.msg}
                </div>
              )}

              <Button
                type="submit"
                className="group w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium py-3 rounded-lg shadow-sm transition active:scale-98 dark:golden-obsidian-btn cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Sending Message...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="relative z-10">Send Message</span>
                    <Send className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 relative z-10" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Right: Venue & Helpdesk Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="p-8 rounded-2xl bg-neutral-50/70 dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Helpdesk & Venue Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 text-neutral-800 dark:text-amber-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">Phone Support</div>
                    <div className="text-neutral-500 dark:text-neutral-400 mt-0.5">+91 99960 26756</div>
                    <div className="text-neutral-500 dark:text-neutral-400">+91 81689 06211</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 text-neutral-800 dark:text-amber-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">Official Email</div>
                    <div className="text-neutral-500 dark:text-neutral-400 mt-0.5">rajat@geetauniversity.edu.in</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 text-neutral-800 dark:text-amber-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">Campus Address</div>
                    <div className="text-neutral-500 dark:text-neutral-400 mt-0.5">Geeta University, NH-71A, Naultha, Panipat, Haryana 132145</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map wrapper */}
            <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
              <MapEmbed />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
