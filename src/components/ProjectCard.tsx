"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Monitor } from "lucide-react";

export interface ProjectData {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  outcome: string;
  link: string;
  type: string;
  isFeatured?: boolean;
  canvasId: string;
}

interface ProjectCardProps {
  project: ProjectData;
  onPreview: (url: string, title: string) => void;
}

export function ProjectCanvas({ canvasId }: { canvasId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const c = el.getContext("2d");
    if (!c) return;

    let w = 0, h = 0, frame = 0;
    let animationId: number;

    function resize() {
      if (!el || !el.parentElement) return;
      w = el.width = el.parentElement.offsetWidth;
      h = el.height = el.parentElement.offsetHeight;
    }

    const observer = new ResizeObserver(resize);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }
    resize();

    const drawP1 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0e1210";
      c.fillRect(0, 0, w, h);
      const cols = 8, rows = 4, nodes: any[] = [];
      const gx = w / cols, gy = h / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          nodes.push({
            x: (i + 0.5) * gx + Math.sin(f * 0.008 + i * 1.3 + j) * 4,
            y: (j + 0.5) * gy + Math.cos(f * 0.006 + j * 1.7 + i) * 3,
            a: 0.08 + 0.04 * Math.sin(f * 0.02 + i + j * 2),
          });
        }
      }
      c.strokeStyle = "rgba(107,143,113,0.08)";
      c.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < gx * 1.6) {
            c.globalAlpha = 0.06 * (1 - d / (gx * 1.6));
            c.beginPath(); c.moveTo(nodes[i].x, nodes[i].y); c.lineTo(nodes[j].x, nodes[j].y); c.stroke();
          }
        }
      }
      const cx = w * 0.55, cy = h * 0.45, r = 30 + 5 * Math.sin(f * 0.03);
      const gr = c.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
      gr.addColorStop(0, "rgba(107,143,113,0.12)");
      gr.addColorStop(1, "transparent");
      c.globalAlpha = 1; c.fillStyle = gr; c.beginPath(); c.arc(cx, cy, r * 3, 0, Math.PI * 2); c.fill();
      nodes.forEach((n, i) => {
        const highlighted = Math.sqrt((n.x - cx) ** 2 + (n.y - cy) ** 2) < 80;
        c.globalAlpha = highlighted ? 0.5 + 0.2 * Math.sin(f * 0.05 + i) : 0.1 + n.a;
        c.fillStyle = highlighted ? "#6b8f71" : "#c8c4b8";
        c.beginPath(); c.arc(n.x, n.y, highlighted ? 2.5 : 1.2, 0, Math.PI * 2); c.fill();
      });
      c.globalAlpha = 1;
    };

    const drawP2 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0e100e";
      c.fillRect(0, 0, w, h);
      const lineCount = 14;
      const lineH = h / (lineCount + 2);
      for (let i = 0; i < lineCount; i++) {
        const y = (i + 1.5) * lineH;
        const progress = (f * 0.6 + i * 18) % w;
        const lineW = 60 + 40 * Math.sin(i * 0.7);
        const alpha = 0.06 + 0.03 * Math.sin(f * 0.015 + i * 0.4);
        c.fillStyle = `rgba(200,196,184,${alpha})`;
        c.fillRect(40, y - 1, lineW + Math.sin(f * 0.01 + i) * 20, 1.5);
        c.fillRect(40 + lineW + 30, y - 1, lineW * 0.6, 1.5);
        const beam = ((f * 1.2 + i * 5) % (w + 60)) - 30;
        const beamAlpha = Math.max(0, 0.6 - Math.abs(beam - progress) / 60) * 0.35;
        c.fillStyle = `rgba(107,143,113,${beamAlpha})`;
        c.fillRect(beam, y - 6, 3, 12);
      }
      const scanY = (f * 0.8) % h;
      const sGrad = c.createLinearGradient(0, scanY - 4, 0, scanY + 4);
      sGrad.addColorStop(0, "transparent");
      sGrad.addColorStop(0.5, "rgba(107,143,113,0.2)");
      sGrad.addColorStop(1, "transparent");
      c.fillStyle = sGrad; c.fillRect(0, scanY - 4, w, 8);
      const labels = ["PHI", "DOC", "REF", "OCR"];
      labels.forEach((l, i) => {
        const lx = w - 80, ly = 30 + i * 40;
        const pulse = 0.3 + 0.2 * Math.sin(f * 0.04 + i * 1.1);
        c.globalAlpha = pulse; c.strokeStyle = "#6b8f71"; c.lineWidth = 0.8;
        c.strokeRect(lx, ly, 56, 18);
        c.fillStyle = "rgba(107,143,113,0.08)"; c.fillRect(lx, ly, 56, 18);
        c.fillStyle = "#6b8f71"; c.font = "9px DM Mono,monospace"; c.textAlign = "center";
        c.fillText(l, lx + 28, ly + 12);
      });
      c.globalAlpha = 1;
    };

    const drawP3 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0e0e10";
      c.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const numCit = 12;
      const radius = Math.min(w, h) * 0.34;
      for (let r = 0; r < 3; r++) {
        const pr = radius * 0.3 + radius * 0.7 * ((f * 0.012 + r * 0.33) % 1);
        const pa = 0.15 * (1 - pr / radius);
        c.globalAlpha = Math.max(0, pa); c.strokeStyle = "rgba(107,143,113,0.4)"; c.lineWidth = 0.6;
        c.beginPath(); c.arc(cx, cy, pr, 0, Math.PI * 2); c.stroke();
      }
      for (let i = 0; i < numCit; i++) {
        const angle = i * (Math.PI * 2 / numCit) + f * 0.003;
        const nx = cx + radius * Math.cos(angle), ny = cy + radius * Math.sin(angle);
        const lineProgress = (f * 0.02 + i * 0.7) % 1;
        c.globalAlpha = 0.07; c.strokeStyle = "#c8c4b8"; c.lineWidth = 0.5;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(nx, ny); c.stroke();
        const px = cx + (nx - cx) * lineProgress, py = cy + (ny - cy) * lineProgress;
        c.globalAlpha = 0.5 * (1 - Math.abs(lineProgress - 0.5) * 2); c.fillStyle = "#6b8f71";
        c.beginPath(); c.arc(px, py, 1.5, 0, Math.PI * 2); c.fill();
        c.globalAlpha = 0.2 + 0.08 * Math.sin(f * 0.04 + i); c.fillStyle = "#c8c4b8";
        c.beginPath(); c.arc(nx, ny, 2, 0, Math.PI * 2); c.fill();
      }
      const ar = 8 + 2 * Math.sin(f * 0.05);
      const ag = c.createRadialGradient(cx, cy, 0, cx, cy, ar * 2);
      ag.addColorStop(0, "rgba(107,143,113,0.5)"); ag.addColorStop(1, "transparent");
      c.globalAlpha = 1; c.fillStyle = ag; c.beginPath(); c.arc(cx, cy, ar * 2, 0, Math.PI * 2); c.fill();
      c.fillStyle = "rgba(107,143,113,0.8)"; c.beginPath(); c.arc(cx, cy, ar * 0.6, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
    };

    const drawP4 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0e0e0e";
      c.fillRect(0, 0, w, h);
      const size = Math.min(w, h) * 0.85;
      const sq = size / 8;
      const ox = (w - size) / 2, oy = (h - size) / 2;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const light = (i + j) % 2 === 0;
          c.globalAlpha = light ? 0.05 : 0.02;
          c.fillStyle = "#c8c4b8"; c.fillRect(ox + i * sq, oy + j * sq, sq, sq);
        }
      }
      const territories = [{ x: 2, y: 1, color: "rgba(107,143,113", a: 0.15 }, { x: 5, y: 5, color: "rgba(200,100,60", a: 0.1 }, { x: 1, y: 5, color: "rgba(107,143,113", a: 0.1 }];
      territories.forEach(t => {
        const tx = ox + t.x * sq + sq / 2, ty = oy + t.y * sq + sq / 2, tr = sq * 1.4 + sq * 0.3 * Math.sin(f * 0.04);
        const tg = c.createRadialGradient(tx, ty, 0, tx, ty, tr);
        tg.addColorStop(0, `${t.color},${t.a + 0.05 * Math.sin(f * 0.03)})`); tg.addColorStop(1, "transparent");
        c.globalAlpha = 1; c.fillStyle = tg; c.beginPath(); c.arc(tx, ty, tr, 0, Math.PI * 2); c.fill();
      });
      c.globalAlpha = 0.12; c.strokeStyle = "#c8c4b8"; c.lineWidth = 0.4;
      for (let i = 0; i <= 8; i++) {
        c.beginPath(); c.moveTo(ox + i * sq, oy); c.lineTo(ox + i * sq, oy + size); c.stroke();
        c.beginPath(); c.moveTo(ox, oy + i * sq); c.lineTo(ox + size, oy + i * sq); c.stroke();
      }
      const pieces = [{ x: 2, y: 1 }, { x: 5, y: 5 }, { x: 3, y: 3 }, { x: 6, y: 2 }, { x: 1, y: 5 }];
      pieces.forEach((p, i) => {
        const px = ox + p.x * sq + sq / 2, py = oy + p.y * sq + sq / 2;
        const pulse = 0.5 + 0.3 * Math.sin(f * 0.05 + i * 1.2);
        c.globalAlpha = pulse; c.strokeStyle = "#c8c4b8"; c.lineWidth = 0.8;
        c.beginPath(); c.arc(px, py, sq * 0.28, 0, Math.PI * 2); c.stroke();
        c.globalAlpha = pulse * 0.4; c.fillStyle = "#c8c4b8";
        c.beginPath(); c.arc(px, py, sq * 0.12, 0, Math.PI * 2); c.fill();
      });
      const pinX = ox + 4 * sq + sq / 2, pinY = oy + 6 * sq + sq / 2;
      c.globalAlpha = 0.6 + 0.2 * Math.sin(f * 0.08); c.fillStyle = "#6b8f71";
      c.beginPath(); c.arc(pinX, pinY - 2, 4, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.moveTo(pinX - 4, pinY - 2); c.lineTo(pinX, pinY+6); c.lineTo(pinX+4, pinY - 2); c.closePath(); c.fill();
      c.globalAlpha = 1;
    };

    function loop() {
      frame++;
      if (canvasId === "pc1") drawP1(c!, w, h, frame);
      else if (canvasId === "pc2") drawP2(c!, w, h, frame);
      else if (canvasId === "pc3") drawP3(c!, w, h, frame);
      else if (canvasId === "pc4") drawP4(c!, w, h, frame);
      animationId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [canvasId]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

export default function ProjectCard({ project, onPreview }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="project-card border border-border-custom bg-bg hover:border-border-custom2 transition-colors duration-300 group overflow-hidden select-none mb-0 flex flex-col"
    >
      {/* Visual Header */}
      <div className="proj-hero w-full h-[200px] relative overflow-hidden flex items-end justify-between p-6">
        <ProjectCanvas canvasId={project.canvasId} />
        <div className="proj-hero-overlay absolute inset-0 bg-gradient-to-tr from-bg/95 via-bg/40 to-transparent z-1" />
        <div className="proj-hero-bottom absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-bg to-transparent z-1" />

        {project.isFeatured && (
          <span className="proj-hero-badge absolute top-5 left-8 z-2 font-mono text-[9px] text-mono tracking-[0.18em] uppercase border border-mono/30 bg-bg/85 px-3 py-1">
            Featured
          </span>
        )}

        <span
          className="proj-hero-num font-mono text-7xl md:text-8xl font-light text-transparent select-none relative z-2 tracking-tighter"
          style={{ WebkitTextStroke: "1px rgba(232, 230, 224, 0.12)", lineHeight: 1 }}
        >
          {project.num}
        </span>
        <span className="proj-hero-type font-mono text-[10px] text-mono tracking-[0.18em] uppercase relative z-2 mb-2">
          {project.type}
        </span>
      </div>

      {/* Card Info and triggers */}
      <div className="proj-body p-8 md:p-10 pt-4 flex-grow grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start relative z-10">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="proj-title font-sans text-xl md:text-2xl font-light tracking-tight text-text-custom mb-3">
              {project.title}
            </h3>
            <p className="proj-desc text-text-custom2 font-light text-[14px] leading-relaxed max-w-[550px] mb-5">
              {project.desc}
            </p>
            <div className="proj-tags flex flex-wrap gap-2 mb-4">
              {project.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="tag font-mono text-[10px] font-light text-text-custom3 border border-border-custom px-3 py-1 uppercase tracking-wider group-hover:text-text-custom2 group-hover:border-border-custom2 transition-all duration-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          {/* Outcome with arrow */}
          <div className="proj-outcome font-mono text-[10px] text-mono tracking-wider pt-4 border-t border-border-custom flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            {project.outcome}
          </div>
        </div>

        {/* Hover buttons */}
        <div className="flex md:flex-col gap-4 self-end md:self-start md:mt-2">
          {/* Live Preview Button */}
          {project.link !== "#" && (
            <button
              onClick={() => onPreview(project.link, project.title)}
              className="flex items-center justify-center p-3 rounded-full border border-border-custom bg-bg hover:bg-bg2 hover:border-mono text-text-custom2 hover:text-mono transition-all duration-300 group/btn"
              title="Interactive Live Preview"
            >
              <Monitor size={18} className="transition-transform duration-300 group-hover/btn:scale-110" />
            </button>
          )}

          {/* Direct Link Arrow Button */}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-arrow flex items-center justify-center p-3 rounded-full border border-border-custom bg-bg hover:bg-bg2 hover:border-text-custom text-text-custom2 hover:text-text-custom transition-all duration-300"
            title="Open Site in New Tab"
          >
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
