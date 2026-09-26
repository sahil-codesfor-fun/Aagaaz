"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6 text-neutral-800">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
        Access Restricted
      </h1>
      <p className="mt-2 text-sm text-neutral-500 max-w-md">
        You do not have the required permissions to access this administrative portal. Please log in with authorized credentials.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="outline" className="border-neutral-300">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
        </Button>
        <Button asChild className="bg-neutral-900 hover:bg-neutral-800 text-white">
          <Link href="/login">Portal Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default AccessDenied;