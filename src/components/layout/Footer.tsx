import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck, Ticket, Calendar } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 dark:bg-[#09090d] border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center p-1 shadow-2xs">
                <img
                  src="/geeta_logo.png"
                  alt="Geeta University"
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-neutral-900 dark:text-white text-base leading-tight">
                  Aagaz 2K26
                </span>
                <span className="text-[11px] font-mono text-neutral-400 dark:text-amber-400/80 font-semibold uppercase">
                  Star Night • Geeta University
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              The flagship annual university cultural celebration and Star Night featuring Sunanda Sharma at Geeta University.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-300 font-mono bg-neutral-200/60 dark:bg-neutral-900 px-2.5 py-1 rounded border border-transparent dark:border-neutral-800">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 dark:text-amber-400" />
              <span>Verified Pass System</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-900 dark:text-white font-semibold">
              Event Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#about" className="hover:text-neutral-900 dark:hover:text-amber-400 transition">
                  About Star Night
                </Link>
              </li>
              <li>
                <Link href="#artist" className="hover:text-neutral-900 dark:hover:text-amber-400 transition">
                  Artist Spotlight (Sunanda Sharma)
                </Link>
              </li>
              <li>
                <Link href="#schedule" className="hover:text-neutral-900 dark:hover:text-amber-400 transition">
                  Event Schedule & Itinerary
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-neutral-900 dark:hover:text-amber-400 transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/register/guest" className="hover:text-neutral-900 dark:hover:text-amber-300 transition font-medium text-neutral-900 dark:text-amber-400">
                  Guest Pass Registration →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-900 dark:text-white font-semibold">
              Entry Guidelines
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <Ticket className="w-3.5 h-3.5 mt-0.5 text-neutral-700 dark:text-amber-400 shrink-0" />
                <span>QR ticket & Govt ID required at gate.</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 mt-0.5 text-neutral-700 dark:text-amber-400 shrink-0" />
                <span>Event Date: 2nd – 3rd October, 2026.</span>
              </li>
              <li>Strictly non-transferable passes.</li>
            </ul>
          </div>

          {/* Col 4: Contact & Venue */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-900 dark:text-white font-semibold">
              Venue & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>Geeta University, Naultha, Panipat, Haryana</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-neutral-500 dark:text-amber-400 shrink-0" />
                <span>+91 99960 26756</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-500 dark:text-amber-400 shrink-0" />
                <span>rajat@geetauniversity.edu.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {currentYear} Geeta University • Aagaz 2K26 Star Night. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-neutral-700 dark:hover:text-white transition">
              Staff Portal
            </Link>
            <Link href="/gate-scanner" className="hover:text-neutral-700 dark:hover:text-white transition">
              Gate Scanner
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
