"use client";

import { useState, useMemo, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
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
  Upload,
  FileCheck2,
  X,
  Building2,
  IdCard,
  CreditCard,
  AlertCircle,
  TicketX,
  HeartHandshake,
} from "lucide-react";
import {
  getAvailableStates,
  getCitiesForState,
  getSchoolsForCity,
} from "@/lib/schoolsData";
import { isPassRegistrationClosed, PASS_CLOSED_MESSAGE } from "@/lib/passConfig";
import Link from "next/link";
import { useEffect } from "react";

export default function GuestRegistration() {
  const router = useRouter();
  const [isClosed, setIsClosed] = useState(isPassRegistrationClosed());
  const [closedMessage, setClosedMessage] = useState(PASS_CLOSED_MESSAGE.description);

  useEffect(() => {
    fetch("/api/settings/registration-status")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isClosed === "boolean") {
          setIsClosed(data.isClosed);
          if (data.message) {
            setClosedMessage(data.message);
          }
        }
      })
      .catch((err) => console.error("Could not fetch registration status:", err));
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    city: "",
    schoolSelect: "",
    customSchool: "",
    studentClass: "12th",
    schoolIdCard: "",
    aadharCard: "",
  });

  const [schoolIdFileName, setSchoolIdFileName] = useState("");
  const [aadharFileName, setAadharFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressingId, setCompressingId] = useState(false);
  const [compressingAadhar, setCompressingAadhar] = useState(false);

  const schoolIdInputRef = useRef<HTMLInputElement>(null);
  const aadharInputRef = useRef<HTMLInputElement>(null);

  // Cascading dropdown lists
  const availableStates = useMemo(() => getAvailableStates(), []);
  const availableCities = useMemo(
    () => (formData.state ? getCitiesForState(formData.state) : []),
    [formData.state]
  );
  const availableSchools = useMemo(
    () =>
      formData.state && formData.city
        ? getSchoolsForCity(formData.state, formData.city)
        : [],
    [formData.state, formData.city]
  );

  const isOtherSelected = formData.schoolSelect === "__OTHER__";
  const finalSchoolName = isOtherSelected
    ? formData.customSchool
    : formData.schoolSelect;

  const handleStateChange = (state: string) => {
    setFormData((prev) => ({
      ...prev,
      state,
      city: "",
      schoolSelect: "",
      customSchool: "",
    }));
  };

  const handleCityChange = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      city,
      schoolSelect: "",
      customSchool: "",
    }));
  };

  const handleSchoolSelect = (school: string) => {
    setFormData((prev) => ({
      ...prev,
      schoolSelect: school,
      customSchool: school === "__OTHER__" ? prev.customSchool : "",
    }));
  };

  // Image compressor helper
  const compressImage = (
    file: File,
    maxDim = 1200,
    quality = 0.75
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileUpload = async (
    file: File,
    type: "schoolId" | "aadhar"
  ) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, or WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size is too large. Please upload an image under 10MB.");
      return;
    }

    if (type === "schoolId") {
      setCompressingId(true);
      try {
        const base64 = await compressImage(file);
        setFormData((prev) => ({ ...prev, schoolIdCard: base64 }));
        setSchoolIdFileName(file.name);
        toast.success("School ID Card uploaded successfully!");
      } catch {
        toast.error("Failed to process School ID image.");
      } finally {
        setCompressingId(false);
      }
    } else {
      setCompressingAadhar(true);
      try {
        const base64 = await compressImage(file);
        setFormData((prev) => ({ ...prev, aadharCard: base64 }));
        setAadharFileName(file.name);
        toast.success("Aadhar Card uploaded successfully!");
      } catch {
        toast.error("Failed to process Aadhar card image.");
      } finally {
        setCompressingAadhar(false);
      }
    }
  };

  const removeFile = (type: "schoolId" | "aadhar") => {
    if (type === "schoolId") {
      setFormData((prev) => ({ ...prev, schoolIdCard: "" }));
      setSchoolIdFileName("");
      if (schoolIdInputRef.current) schoolIdInputRef.current.value = "";
    } else {
      setFormData((prev) => ({ ...prev, aadharCard: "" }));
      setAadharFileName("");
      if (aadharInputRef.current) aadharInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.mobile.trim().length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.state) {
      toast.error("Please select your State / UT.");
      return;
    }

    if (!formData.city) {
      toast.error("Please select your City.");
      return;
    }

    if (!formData.schoolSelect) {
      toast.error("Please select your School.");
      return;
    }

    if (isOtherSelected && !formData.customSchool.trim()) {
      toast.error("Please write your School Name.");
      return;
    }

    if (!formData.schoolIdCard) {
      toast.error("Please upload your School ID Card.");
      return;
    }

    if (!formData.aadharCard) {
      toast.error("Please upload your Aadhar Card.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        state: formData.state,
        city: formData.city,
        schoolName: finalSchoolName.trim(),
        isOtherSchool: isOtherSelected,
        studentClass: formData.studentClass || "12th",
        schoolIdCard: formData.schoolIdCard,
        aadharCard: formData.aadharCard,
      };

      const res = await fetch("/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast.success("Registration submitted! Pending verification.");
      router.push(`/register/success?registrationId=${result.registrationId}`);
    } catch (err: any) {
      toast.error(
        err.message || "An error occurred while submitting registration."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isClosed) {
    return (
      <div className="min-h-screen bg-neutral-50/70 dark:bg-[#09090d] pt-[112px] sm:pt-[120px] md:pt-[130px] pb-16 px-4 sm:px-6 md:px-8 flex flex-col justify-center items-center relative overflow-hidden transition-colors duration-300">
        {/* Dynamic atmospheric glows */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/20 dark:from-amber-500/15 via-orange-100/15 dark:via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-rose-100/15 dark:from-rose-500/10 via-amber-100/10 dark:via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-amber-400/40 shadow-2xl text-center space-y-6 relative"
        >
          {/* Top Badge */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-neutral-950 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.35)]">
              <TicketX className="w-10 h-10 stroke-[2]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-neutral-700 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>GEETA UNIVERSITY • AAGHAZ 2K26</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
              {PASS_CLOSED_MESSAGE.title}
            </h1>

            <p className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
              {PASS_CLOSED_MESSAGE.subtitle} (12:30 PM Deadline)
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-amber-50/90 dark:from-amber-950/30 dark:via-neutral-900/80 dark:to-amber-950/20 border border-amber-200 dark:border-amber-500/30 shadow-sm">
            <p className="text-base sm:text-lg font-bold text-neutral-900 dark:text-amber-300 leading-snug">
              &ldquo;{PASS_CLOSED_MESSAGE.description}&rdquo;
            </p>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            All registered guests with approved passes may present their digital QR tickets at the turnstile entry gates during the event.
          </p>

          <div className="pt-2">
            <Button
              asChild
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 dark:golden-obsidian-btn text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Link href="/">
                <HeartHandshake className="w-4 h-4 mr-2 text-amber-400" />
                <span>Return to Event Homepage</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/70 dark:bg-[#09090d] pt-[112px] sm:pt-[120px] md:pt-[124px] pb-16 px-4 sm:px-6 md:px-8 flex flex-col justify-start relative overflow-hidden transition-colors duration-300">
      {/* Dynamic atmospheric glows */}
      <div className="absolute top-2 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/20 dark:from-amber-500/15 via-orange-100/15 dark:via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-2 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-rose-100/15 dark:from-rose-500/10 via-amber-100/10 dark:via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl xl:max-w-[1320px] mx-auto w-full space-y-6">
        {/* Page Header */}
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
                GEETA UNIVERSITY • AAGHAZ 2K26
              </span>
              <span className="text-orange-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wide">
                STAR NIGHT LIVE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
              Student Entry Pass Registration (11th & 12th Class)
            </h1>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800/80 text-xs font-mono text-amber-900 dark:text-amber-300 self-start sm:self-auto shrink-0 shadow-2xs">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-bold block text-xs sm:text-sm">
                11th & 12th Standard Passes
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400/90 font-medium">
                Mandatory ID Verification
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* Left Column: Student Details & Document Upload Form */}
          <div className="lg:col-span-7 space-y-4">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-6"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-amber-400 text-white dark:text-neutral-950 flex items-center justify-center font-mono text-xs sm:text-sm font-bold shadow-2xs">
                    01
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white block leading-tight">
                      Student Credentials & School Info
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      Official Verification & Pass Dispatch
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800/80">
                  Free Student Pass
                </span>
              </div>

              {/* Form Inputs Grid */}
              <div className="space-y-4.5">
                {/* 1. Full Name & Email Address */}
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
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
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
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="pl-10.5 text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="mobile"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>Contact / Mobile Number</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mobile: e.target.value,
                          }))
                        }
                        className="pl-10.5 text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Class Selection (11th & 12th Class) */}
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
                        onValueChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            studentClass: val,
                          }))
                        }
                      >
                        <SelectTrigger
                          id="studentClass"
                          className="w-full text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium px-3.5"
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                            <SelectValue placeholder="Select Class" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#101015] border-neutral-200 dark:border-neutral-800">
                          <SelectItem
                            value="11th"
                            className="cursor-pointer py-2.5 font-medium"
                          >
                            11th Class
                          </SelectItem>
                          <SelectItem
                            value="12th"
                            className="cursor-pointer py-2.5 font-medium"
                          >
                            12th Class
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 3. State / UT Dropdown & City Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="stateSelect"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>State / Union Territory</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        value={formData.state}
                        onValueChange={handleStateChange}
                      >
                        <SelectTrigger
                          id="stateSelect"
                          className="w-full text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium px-3.5"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                            <SelectValue placeholder="Select State / UT" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#101015] border-neutral-200 dark:border-neutral-800 max-h-60">
                          {availableStates.map((st) => (
                            <SelectItem
                              key={st}
                              value={st}
                              className="cursor-pointer py-2 font-medium"
                            >
                              {st}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="citySelect"
                      className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <span>City</span>
                      <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        value={formData.city}
                        onValueChange={handleCityChange}
                        disabled={!formData.state}
                      >
                        <SelectTrigger
                          id="citySelect"
                          className="w-full text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium px-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Building2 className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                            <SelectValue
                              placeholder={
                                formData.state
                                  ? "Select City"
                                  : "Select State first"
                              }
                            />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#101015] border-neutral-200 dark:border-neutral-800 max-h-60">
                          {availableCities.map((ct) => (
                            <SelectItem
                              key={ct}
                              value={ct}
                              className="cursor-pointer py-2 font-medium"
                            >
                              {ct}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 4. School Selection Dropdown */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="schoolSelect"
                    className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                  >
                    <span>School Name</span>
                    <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Select
                      value={formData.schoolSelect}
                      onValueChange={handleSchoolSelect}
                      disabled={!formData.city}
                    >
                      <SelectTrigger
                        id="schoolSelect"
                        className="w-full text-sm sm:text-base h-11.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium px-3.5 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <School className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                          <SelectValue
                            placeholder={
                              formData.city
                                ? "Select your School"
                                : "Select City first"
                            }
                          />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#101015] border-neutral-200 dark:border-neutral-800 max-h-72">
                        {availableSchools.map((sch) => (
                          <SelectItem
                            key={sch}
                            value={sch}
                            className="cursor-pointer py-2 font-medium text-xs sm:text-sm"
                          >
                            {sch}
                          </SelectItem>
                        ))}
                        <SelectItem
                          value="__OTHER__"
                          className="cursor-pointer py-2.5 font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 border-t border-neutral-200 dark:border-neutral-800 mt-1"
                        >
                          ➕ Other (School not in list)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 5. Custom School Name Input Area (appears if "Other" is chosen) */}
                <AnimatePresence>
                  {isOtherSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-1.5 overflow-hidden pt-1"
                    >
                      <Label
                        htmlFor="customSchool"
                        className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1"
                      >
                        <span>Write Your School Full Name</span>
                        <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <School className="w-4.5 h-4.5 text-amber-500 absolute left-3.5 top-3.5" />
                        <Input
                          id="customSchool"
                          placeholder="e.g. Swami Vivekanand Public Sr Sec School"
                          value={formData.customSchool}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customSchool: e.target.value,
                            }))
                          }
                          className="pl-10.5 text-sm sm:text-base h-11.5 rounded-xl bg-amber-50/30 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                          required
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SECTION 2: Mandatory ID Card & Aadhar Card Uploads */}
                <div className="pt-3 space-y-4 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IdCard className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                        Mandatory Document Verification
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-rose-500 font-semibold">
                      * Both Uploads Required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* School ID Card Upload Box */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                        <span>School ID Card</span>
                        <span className="text-rose-500">*</span>
                      </Label>

                      <input
                        ref={schoolIdInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "schoolId");
                        }}
                      />

                      {formData.schoolIdCard ? (
                        <div className="relative p-3 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3">
                          <img
                            src={formData.schoolIdCard}
                            alt="School ID Preview"
                            className="w-12 h-12 object-cover rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate">
                              {schoolIdFileName || "School_ID_Card.jpg"}
                            </div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <FileCheck2 className="w-3 h-3" /> Ready for verification
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile("schoolId")}
                            className="p-1 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-white dark:hover:bg-neutral-800 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => schoolIdInputRef.current?.click()}
                          className="cursor-pointer p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-500 bg-neutral-50/60 dark:bg-neutral-900/60 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all text-center space-y-1.5"
                        >
                          {compressingId ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-500" />
                          ) : (
                            <Upload className="w-5 h-5 mx-auto text-neutral-400" />
                          )}
                          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            {compressingId ? "Processing ID..." : "Upload School ID"}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            PNG, JPG or WebP (Max 10MB)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Aadhar Card Upload Box */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                        <span>Aadhar Card</span>
                        <span className="text-rose-500">*</span>
                      </Label>

                      <input
                        ref={aadharInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "aadhar");
                        }}
                      />

                      {formData.aadharCard ? (
                        <div className="relative p-3 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3">
                          <img
                            src={formData.aadharCard}
                            alt="Aadhar Preview"
                            className="w-12 h-12 object-cover rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate">
                              {aadharFileName || "Aadhar_Card.jpg"}
                            </div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <FileCheck2 className="w-3 h-3" /> Ready for verification
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile("aadhar")}
                            className="p-1 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-white dark:hover:bg-neutral-800 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => aadharInputRef.current?.click()}
                          className="cursor-pointer p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-500 bg-neutral-50/60 dark:bg-neutral-900/60 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all text-center space-y-1.5"
                        >
                          {compressingAadhar ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-500" />
                          ) : (
                            <CreditCard className="w-5 h-5 mx-auto text-neutral-400" />
                          )}
                          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            {compressingAadhar
                              ? "Processing Aadhar..."
                              : "Upload Aadhar Card"}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            Front/Photo side (PNG, JPG)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button for Mobile View */}
              <div className="pt-2 block lg:hidden">
                <Button
                  type="submit"
                  disabled={
                    loading || !formData.schoolIdCard || !formData.aadharCard
                  }
                  className="w-full bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white text-xs sm:text-sm font-bold h-12 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer dark:golden-obsidian-btn tracking-wider uppercase font-mono disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Submitting Pass Request...</span>
                    </>
                  ) : (
                    <>
                      <span>SUBMIT FOR PASS APPROVAL</span>
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
                    PASS REGISTRATION PREVIEW
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded border border-neutral-700">
                  CLASS {formData.studentClass ? formData.studentClass.toUpperCase() : "12TH"}
                </span>
              </div>

              {/* Ticket Visual Body */}
              <div className="p-4.5 sm:p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                      GEETA UNIVERSITY • AAGHAZ 2K26
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-white tracking-tight truncate max-w-[220px]">
                      {formData.name
                        ? formData.name.toUpperCase()
                        : "REGISTRANT NAME"}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-400 font-mono truncate max-w-[220px]">
                      {formData.email ? formData.email : "your-email@example.com"}
                    </p>
                    {finalSchoolName && (
                      <p className="text-[11px] text-amber-300/90 font-mono pt-1 line-clamp-2 max-w-[220px]">
                        🏫 {finalSchoolName}
                      </p>
                    )}
                    {formData.city && formData.state && (
                      <p className="text-[10px] text-neutral-400 font-mono">
                        📍 {formData.city}, {formData.state}
                      </p>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center p-2 shrink-0 shadow-inner">
                    <QrCode className="w-full h-full text-amber-400" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono">
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-left">
                    <div className="text-[8px] text-neutral-400 uppercase font-semibold">
                      HEADLINER
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">
                      Sunanda S.
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-left">
                    <div className="text-[8px] text-neutral-400 uppercase font-semibold">
                      DOCUMENT ID
                    </div>
                    <div className="text-xs font-bold text-amber-300 mt-0.5">
                      {formData.schoolIdCard && formData.aadharCard
                        ? "2/2 Uploaded"
                        : "Pending IDs"}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-left">
                    <div className="text-[8px] text-neutral-400 uppercase font-semibold">
                      APPROVAL
                    </div>
                    <div className="text-xs font-bold text-amber-400 mt-0.5">
                      Admin Review
                    </div>
                  </div>
                </div>

                {/* Perforated Stub Line */}
                <div className="pt-3 border-t border-dashed border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>OFFICIAL STUDENT PASS</span>
                  <span className="tracking-widest text-neutral-400 font-bold">
                    |||| ||| |||||
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Direct Action Card (Desktop view) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200/90 dark:border-neutral-800 shadow-md space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span>Verification & Pass Dispatch</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Both your School ID and Aadhar card will be reviewed by the event administrators. Once verified, your personalized QR pass will be emailed to you.
                </p>
              </div>

              {(!formData.schoolIdCard || !formData.aadharCard) && (
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/60 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Upload both School ID and Aadhar Card to enable submission.</span>
                </div>
              )}

              {/* Submit / Proceed Button */}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={
                  loading || !formData.schoolIdCard || !formData.aadharCard
                }
                className="group w-full bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white text-xs sm:text-sm font-bold h-12 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer dark:golden-obsidian-btn tracking-wider uppercase font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Submitting Pass Request...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT FOR PASS APPROVAL</span>
                    <ArrowRight className="w-4.5 h-4.5 text-amber-300 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 justify-center font-mono pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Encrypted Document Review • 100% Free Pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}