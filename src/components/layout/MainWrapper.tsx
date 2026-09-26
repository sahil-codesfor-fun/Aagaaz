"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface MainWrapperProps {
  children: ReactNode;
}

const MainWrapper = ({ children }: MainWrapperProps) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#09090d] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white transition-colors duration-300">
      {/* Sticky Header */}
      <Header />

      {/* Main Content with Route Transition */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainWrapper;
