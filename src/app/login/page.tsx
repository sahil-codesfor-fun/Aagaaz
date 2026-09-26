"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        router.push("/admin");
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
    <div className="min-h-screen bg-neutral-50/70 pt-28 pb-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 space-y-6">
        
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border border-neutral-200 flex items-center justify-center mx-auto p-1.5 shadow-sm">
              <img
                src="/geeta_logo.png"
                alt="Geeta University Logo"
                className="object-contain w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Staff & Admin Portal
            </h1>
            <p className="text-xs text-neutral-500">
              Sign in to manage registrations, verify UTR payments, or operate the gate scanner.
            </p>
          </div>

          {error && (
            <div className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-neutral-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs focus-visible:ring-neutral-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-neutral-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs focus-visible:ring-neutral-900"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium py-2.5 rounded-lg shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
