"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const roles = [
  "AI Engineer",
  "Full Stack Developer",
  "Curious Techie",
];

export default function RoleCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        return next >= roles.length ? 0 : next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Safe fallback if index is ever out of bounds
  const currentRole = roles[index] !== undefined ? roles[index] : (roles[0] || "");

  return (
    <span
      className="inline-flex items-center overflow-hidden"
      style={{ height: "1.2em", verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentRole}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="text-mono font-mono text-[11px] tracking-[0.18em] uppercase whitespace-nowrap"
        >
          {currentRole}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
