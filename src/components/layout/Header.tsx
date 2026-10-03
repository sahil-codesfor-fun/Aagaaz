'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X, Sparkles, Sun, Moon, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { isPassRegistrationClosed } from "@/lib/passConfig";
import PassClosedModal from "@/components/PassClosedModal";

export const Header = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: isHomePage ? "#about" : "/#about" },
    { label: "Artist", href: isHomePage ? "#artist" : "/#artist" },
    { label: "Schedule", href: isHomePage ? "#schedule" : "/#schedule" },
    { label: "FAQ", href: isHomePage ? "#faq" : "/#faq" },
    { label: "Contact", href: isHomePage ? "#contact" : "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#09090d]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] py-3"
          : "bg-white/80 dark:bg-[#09090d]/80 backdrop-blur-sm border-b border-neutral-100 dark:border-neutral-900 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand with Geeta University Official Logo (Prominent & Big) */}
        <Link href="/" className="group flex items-center gap-3.5 py-1">
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="relative w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm flex items-center justify-center shrink-0 p-1 group-hover:border-neutral-400 dark:group-hover:border-amber-400/50 group-hover:shadow-md transition"
          >
            <Image
              src="/geeta_logo.png"
              alt="Geeta University Logo"
              width={64}
              height={64}
              className="object-contain w-full h-full"
              priority
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg tracking-tight text-neutral-950 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-amber-300 transition leading-tight">
              Aaghaz 2K26
            </span>
            <span className="text-[11px] sm:text-xs font-mono tracking-wider uppercase text-neutral-500 dark:text-amber-400/90 font-bold">
              Star Night • Geeta University
            </span>
          </div>
        </Link>

        {/* Desktop Navigation with Animated Hover Pill */}
        <nav
          onMouseLeave={() => setHoveredTab(null)}
          className="hidden md:flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-900/90 p-1 rounded-full border border-neutral-200/70 dark:border-neutral-800"
        >
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredTab(item.label)}
              className="relative px-4 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors duration-150 rounded-full"
            >
              {hoveredTab === item.label && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-full shadow-2xs"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Dark / Light Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/90 text-neutral-700 dark:text-amber-400 hover:scale-105 transition-all cursor-pointer shadow-2xs"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>
          )}

          {session?.user ? (
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-xs font-mono border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/90 text-neutral-800 dark:text-amber-300 rounded-full"
              >
                <Link href={session.user.role === "admin" ? "/admin/dashboard" : "/accounts/dashboard"}>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  {session.user.role === "admin" ? "Admin" : "Accounts"}
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full px-2.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
              </Button>
            </div>
          ) : isPassRegistrationClosed() ? (
            <Button
              size="sm"
              onClick={() => setShowClosedModal(true)}
              className="group bg-gradient-to-r from-neutral-900 to-neutral-800 dark:golden-obsidian-btn hover:from-neutral-800 hover:to-neutral-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span>Get Pass</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="group bg-gradient-to-r from-neutral-900 to-neutral-800 dark:golden-obsidian-btn hover:from-neutral-800 hover:to-neutral-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <Link href="/register/guest" className="flex items-center gap-1.5">
                <span>Get Pass</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/98 dark:bg-[#09090d]/98 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 px-6 py-5 shadow-lg"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
                {/* Theme Toggle Button */}
                {mounted && (
                  <Button
                    variant="outline"
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="w-full text-xs justify-center gap-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl py-2.5"
                  >
                    {resolvedTheme === "dark" ? (
                      <>
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>Switch to Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-neutral-700" />
                        <span>Switch to Dark Mode</span>
                      </>
                    )}
                  </Button>
                )}

                {session?.user ? (
                  <>
                    <Button asChild className="w-full bg-neutral-900 text-white text-xs justify-center dark:golden-obsidian-btn">
                      <Link
                        href={session.user.role === "admin" ? "/admin/dashboard" : "/accounts/dashboard"}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Go to {session.user.role === "admin" ? "Admin" : "Accounts"} Portal →
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="w-full text-xs justify-center gap-2 border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </Button>
                  </>
                ) : isPassRegistrationClosed() ? (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowClosedModal(true);
                    }}
                    className="w-full bg-neutral-900 text-white text-xs justify-center dark:golden-obsidian-btn cursor-pointer"
                  >
                    Get Entry Pass →
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-neutral-900 text-white text-xs justify-center dark:golden-obsidian-btn">
                    <Link href="/register/guest" onClick={() => setMobileMenuOpen(false)}>
                      Get Entry Pass →
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Passes Closed Modal */}
      <PassClosedModal isOpen={showClosedModal} onClose={() => setShowClosedModal(false)} />
    </header>
  );
};

export default Header;
