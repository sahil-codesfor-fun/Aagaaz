"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative flex items-center justify-center">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border border-neutral-200 flex items-center justify-center p-1 shadow-md">
            <img
              src="/geeta_logo.png"
              alt="Geeta University Logo"
              className="object-contain w-full h-full"
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-2xl border-2 border-dashed border-neutral-300 border-t-neutral-900"
          />
        </div>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs font-mono tracking-widest text-neutral-500 uppercase"
        >
          Loading Freshers 2K26...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;