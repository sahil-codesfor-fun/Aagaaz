"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Ticket, ArrowLeft, Mail, ShieldCheck, Home } from "lucide-react";
import Loading from "@/components/layout/Loading";
import Link from "next/link";

const SuccessPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registrationId") || "PENDING";

  return (
    <div className="min-h-screen bg-neutral-50/70 pt-28 pb-20 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-6">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200 shadow-xl text-center space-y-6">
          
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Registration Recorded
            </span>
            <h1 className="text-2xl font-bold text-neutral-900 pt-2">
              Pass Registration Successful
            </h1>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Thank you for registering for <strong>Freshers 2K26 – Star Night</strong> featuring Sunanda Sharma.
            </p>
          </div>

          {/* Registration Code Stub */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/90 space-y-1 text-center">
            <span className="text-[10px] font-mono uppercase text-neutral-400">
              Unique Registration ID
            </span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-neutral-900 tracking-wider">
              {registrationId}
            </div>
          </div>

          {/* What happens next advisory */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-left space-y-2 text-xs text-neutral-600">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-700" />
              What Happens Next?
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-500">
              <li>Our team will verify your submitted details.</li>
              <li>Once verified, your official entry pass with an encrypted QR code will be dispatched to your email.</li>
              <li>Present the QR code at the event turnstile along with a valid government-issued photo ID & School ID Card.</li>
            </ol>
          </div>

          {/* Return Home Button */}
          <div className="pt-2">
            <Button
              asChild
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium py-2.5 rounded-lg shadow-sm"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-3.5 h-3.5" /> Return to Home Platform
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Geeta University Pass System</span>
          </div>

        </div>
      </div>
    </div>
  );
};

const SuccessPage = () => (
  <Suspense fallback={<Loading />}>
    <SuccessPageContent />
  </Suspense>
);

export default SuccessPage;