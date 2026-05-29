"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: -200, y: -200 });
  const ringPosRef = useRef({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);

  // Dot: sync to mouse instantly
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Ring: snappy lerp at 0.28 (was 0.18 — too laggy)
  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      const { x: mx, y: my } = mousePosRef.current;
      const { x: rx, y: ry } = ringPosRef.current;
      const nx = rx + (mx - rx) * 0.28;
      const ny = ry + (my - ry) * 0.28;
      ringPosRef.current = { x: nx, y: ny };
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${nx}px, ${ny}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { active = false; };
  }, []);

  // Hover expand on interactive elements
  useEffect(() => {
    const enter = () => setIsHovered(true);
    const leave = () => setIsHovered(false);
    const els = document.querySelectorAll("a, button, [role='button'], .project-card");
    els.forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    return () => els.forEach(el => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
  }, []);

  return (
    <div className="hidden lg:block">
      {/* Dot — snaps to cursor */}
      <div
        ref={cursorRef}
        style={{ left: 0, top: 0, transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)", willChange: "transform" }}
        className="cursor fixed w-2.5 h-2.5 bg-text-custom rounded-full pointer-events-none z-[9999]"
      />
      {/* Ring — laggy trail */}
      <div
        ref={cursorRingRef}
        style={{ left: 0, top: 0, transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)", willChange: "transform" }}
        className={`cursor-ring fixed rounded-full pointer-events-none z-[9998] border transition-[width,height,background-color,border-color] duration-200 ease-out ${
          isHovered
            ? "w-14 h-14 border-mono/65 bg-mono/5"
            : "w-8 h-8 border-text-custom/25 bg-transparent"
        }`}
      />
    </div>
  );
}
