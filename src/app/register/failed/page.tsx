"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const FailedPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50/70 pt-28 pb-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-neutral-900">
              Registration Encountered an Issue
            </h1>
            <p className="text-xs text-neutral-500">
              We were unable to record your registration details. Please verify your internet connection and try again.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Button asChild className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs">
              <Link href="/register/guest" className="flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Try Registering Again
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full text-xs border-neutral-200">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-3.5 h-3.5" /> Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailedPage;