"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Award,
  QrCode,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function GuestRegistration() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    schoolName: "",
    studentClass: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.schoolName.trim() ||
      !formData.studentClass ||
      !formData.city.trim()
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.mobile.trim().length < 10) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast.success("Registration successful! Your pass has been recorded.");
      router.push(`/register/success?registrationId=${result.registrationId}`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while submitting registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 dark:bg-[#09090d] pt-[112px] sm:pt-[120px] md:pt-[124px] pb-12 px-4 sm:px-6 md:px-8 flex flex-col justify-start relative overflow-hidden transition-colors duration-300">
      {/* Background dynamic festival atmospheric glows */}
      <div className="absolute top-2 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/20 dark:from-amber-500/15 via-orange-100/15 dark:via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-2 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-rose-100/15 dark:from-rose-500/10 via-amber-100/10 dark:via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl xl:max-w-[1320px] mx-auto w-full space-y-6">
        {/* Page Header Title & Event Identity */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800"
        >
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                GEETA UNIVERSITY • AAGAZ 2K26
              </span>
              <span className="text-orange-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wide">
                STAR NIGHT LIVE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
              Student Entry Pass Registration
            </h1>
          </div>

          {/* Quota Badge */}
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800/80 text-xs font-mono text-amber-900 dark:text-amber-300 self-start sm:self-auto shrink-0 shadow-2xs">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-bold block text-xs sm:text-sm">100 Passes Quota</span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400/90 font-medium">Serial # 1100–1200</span>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* Left Column: Student Details Form */}
          <div className="lg:col-span-7 space-y-4">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-950 flex items-center justify-center font-mono text-xs sm:text-sm font-bold shadow-2xs">
                    01
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white block leading-tight">
                      Student Details
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      Official Entry Pass Contact
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800/80">
                  Free Registration
                </span>
              </div>

              {/* Form Inputs Grid */}
              <div className="space-y-4">
                {/* Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>Full Name</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                      <Input
                        id="name"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="pl-10.5 text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>Email Address</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="pl-10.5 text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Number & School Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="mobile"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>Mobile Number</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        className="pl-10.5 text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="schoolName"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>School Name</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <School className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                      <Input
                        id="schoolName"
                        placeholder="e.g. Delhi Public School"
                        value={formData.schoolName}
                        onChange={(e) => handleChange("schoolName", e.target.value)}
                        className="pl-10.5 text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Class Dropdown & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="studentClass"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>Class</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        value={formData.studentClass}
                        onValueChange={(val) => handleChange("studentClass", val)}
                      >
                        <SelectTrigger
                          id="studentClass"
                          className="w-full text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium px-3.5"
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                            <SelectValue placeholder="Select Class (11th or 12th)" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#101015] border-neutral-200 dark:border-neutral-800">
                          <SelectItem value="11th" className="cursor-pointer py-2.5 font-medium">
                            11th Class
                          </SelectItem>
                          <SelectItem value="12th" className="cursor-pointer py-2.5 font-medium">
                            12th Class
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="city"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>City</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                      <Input
                        id="city"
                        placeholder="e.g. Panipat, Haryana"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className="pl-10.5 text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button for Mobile View */}
              <div className="pt-2 block lg:hidden">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white text-xs sm:text-sm font-bold h-12 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer dark:golden-obsidian-btn tracking-wider uppercase font-mono"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>REGISTER FOR ENTRY PASS</span>
                      <ArrowRight className="w-4.5 h-4.5 text-amber-300" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          </div>

          {/* Right Column: Live Pass Preview + Action Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Interactive VIP Pass Ticket Visualizer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="relative rounded-2xl bg-neutral-950 text-white overflow-hidden shadow-lg border border-neutral-800 dark:border-amber-400/40"
            >
              {/* Ticket Top Ribbon */}
              <div className="py-2.5 px-4.5 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800 dark:border-amber-400/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-bold text-amber-300 text-xs tracking-wider uppercase">
                    DIGITAL ENTRY PASS PREVIEW
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded border border-neutral-700">
                  1 TICKET
                </span>
              </div>

              {/* Ticket Visual Body */}
              <div className="p-4.5 sm:p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                      GEETA UNIVERSITY • AAGAZ 2K26
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {formData.name ? formData.name.toUpperCase() : "REGISTRANT NAME"}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-400 font-mono">
                      {formData.email ? formData.email : "your-email@example.com"}
                    </p>
                    {formData.schoolName && (
                      <p className="text-[11px] text-amber-300/90 font-mono pt-1 truncate max-w-[220px]">
                        🏫 {formData.schoolName} {formData.studentClass ? `(${formData.studentClass})` : ""}
                      </p>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center p-2 shrink-0 shadow-inner">
                    <QrCode className="w-full h-full text-amber-400" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 font-mono">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-left">
                    <div className="text-[8.5px] text-neutral-400 uppercase font-semibold">HEADLINER</div>
                    <div className="text-xs sm:text-[13px] font-bold text-white mt-0.5 truncate">Sunanda S.</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-left">
                    <div className="text-[8.5px] text-neutral-400 uppercase font-semibold">PASS SERIAL</div>
                    <div className="text-xs sm:text-[13px] font-bold text-amber-300 mt-0.5">1100–1200</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-left">
                    <div className="text-[8.5px] text-neutral-400 uppercase font-semibold">ACCESS</div>
                    <div className="text-xs sm:text-[13px] font-bold text-emerald-400 mt-0.5">Verified</div>
                  </div>
                </div>

                {/* Perforated Stub Line */}
                <div className="pt-3 border-t border-dashed border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>SECURE TURNSTILE BARCODE</span>
                  <span className="tracking-widest text-neutral-400 font-bold">|||| ||| |||||</span>
                </div>
              </div>
            </motion.div>

            {/* Direct Action Card (Desktop view) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200/90 dark:border-neutral-800 shadow-md space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  Confirm & Apply for Pass
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Pass issuance is 100% complimentary for school students. Once verified, your entry QR ticket will be sent to your email.
                </p>
              </div>

              {/* Submit / Proceed Button */}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="group w-full bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white text-xs sm:text-sm font-bold h-12 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer dark:golden-obsidian-btn tracking-wider uppercase font-mono"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <span>REGISTER FOR ENTRY PASS</span>
                    <ArrowRight className="w-4.5 h-4.5 text-amber-300 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 justify-center font-mono pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Instant Turnstile Pass Dispatch • Direct Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}