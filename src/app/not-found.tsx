import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50/70 dark:bg-[#09090d] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#101015] border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4">
        <h2 className="text-4xl font-black text-neutral-900 dark:text-white">404</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">The requested page could not be found.</p>
        <div className="pt-2">
          <Button asChild className="bg-neutral-900 dark:golden-obsidian-btn text-white rounded-full px-6 text-xs">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
