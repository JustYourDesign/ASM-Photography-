"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AsmLogoThemed } from "@/components/ui/asm-logo";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 1700);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: EASE } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <AsmLogoThemed variant="full" height={190} priority className="h-[150px] w-auto md:h-[190px]" />
          </motion.div>
          <motion.div
            className="mt-10 h-px w-40 origin-left bg-beige"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
