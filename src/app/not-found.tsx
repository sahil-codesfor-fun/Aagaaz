import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50/70 dark:bg-[#09090d] pt-28 pb-20 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      <div className="max-w-md w-full mx-auto px-6 text-center space-y-6">
        <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl font-black font-mono">
            404
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>

          <div className="pt-2">
            <Button
              asChild
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:golden-obsidian-btn text-xs font-bold h-11 rounded-xl shadow-sm transition-all"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" /> Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
