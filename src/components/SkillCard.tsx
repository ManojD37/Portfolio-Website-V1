"use client";

import { motion } from "framer-motion";
import React from "react";
import { SkillItem } from "./SkillIcons";

interface SkillCardProps {
  skill: SkillItem;
  index: number;
}

export default function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.02, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        scale: 1.05,
        borderColor: skill.color,
        boxShadow: `0 0 20px ${skill.color}25`,
        backgroundColor: "var(--bg2)",
      }}
      className="border border-border-custom bg-bg p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 group select-none"
    >
      <div className="flex items-center justify-center w-8 h-8 transition-transform duration-300 group-hover:scale-110">
        {skill.icon}
      </div>
      <span className="font-mono text-[10px] text-text-custom3 tracking-wide text-center uppercase group-hover:text-text-custom2 transition-colors duration-300">
        {skill.name}
      </span>
    </motion.div>
  );
}
