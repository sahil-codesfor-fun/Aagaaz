"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your email and password.");
        setLoading(false);
        return;
      }

      // Fetch session to check user role
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else if (session?.user?.role === "accountant") {
        router.push("/accounts");
      } else {
        setError("Unauthorized user role.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 dark:bg-[#09090d] pt-28 pb-20 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Dynamic atmospheric glows */}
      <div className="absolute top-10 right-1/3 w-[450px] h-[450px] bg-gradient-to-br from-amber-200/20 dark:from-amber-500/15 via-orange-100/15 dark:via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-rose-100/15 dark:from-rose-500/10 via-amber-100/10 dark:via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full mx-auto px-6 space-y-6"
      >
        <div className="p-8 sm:p-9 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200/90 dark:border-neutral-800 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto p-2 shadow-sm">
              <img
                src="/geeta_logo.png"
                alt="Geeta University Logo"
                className="object-contain w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Staff & Admin Portal
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Sign in to manage registrations, verify student passes, or operate gate access.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@geeta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10.5 text-sm h-11 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10.5 pr-10 text-sm h-11 rounded-xl bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 focus:bg-white dark:focus:bg-neutral-900 font-medium tracking-wide"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white dark:golden-obsidian-btn text-xs font-bold h-11 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer font-mono uppercase tracking-wider"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4 text-amber-300" /> Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </span>
              )}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 font-mono pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Authorized Personnel Access Only</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
