"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, t = 0;
    let animationId: number;

    const GRID = 28;
    const DOT_R = 1.0;
    const DOT_A = 0.18;

    const STAR_COUNT = 42;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: 0,
      y: 0,
      size: 2 + Math.random() * 5.5,
      speed: 0.35 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      bright: 0.35 + Math.random() * 0.55,
    }));

    function placestars() {
      stars.forEach((s) => {
        s.x = Math.random() * W;
        s.y = Math.random() * H;
      });
    }

    const NODE_COUNT = 14;
    let nodes: any[] = [];
    let edges: any[] = [];
    let packets: any[] = [];

    function buildGraph() {
      const margin = 90;
      const dist = W * 0.3;
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: margin + Math.random() * (W - margin * 2),
        y: margin + Math.random() * (H - margin * 2),
        pulse: Math.random() * Math.PI * 2,
      }));
      edges = [];
      packets = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < dist) {
            edges.push({ a: i, b: j });
            if (Math.random() < 0.45) {
              packets.push({
                e: edges.length - 1,
                t: Math.random(),
                spd: 0.0009 + Math.random() * 0.0013,
                dir: Math.random() < 0.5 ? 1 : -1,
              });
            }
          }
        }
      }
    }

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      W = canvas.width = parent.offsetWidth;
      H = canvas.height = parent.offsetHeight;
      placestars();
      buildGraph();
    }

    window.addEventListener("resize", resize);
    resize();

    function drawGrid() {
      ctx!.fillStyle = `rgba(200, 196, 184, ${DOT_A})`;
      const ox = (W % GRID) / 2;
      const oy = (H % GRID) / 2;
      for (let x = ox; x < W; x += GRID) {
        for (let y = oy; y < H; y += GRID) {
          ctx!.beginPath();
          ctx!.arc(x, y, DOT_R, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function drawStar(x: number, y: number, arm: number, op: number) {
      ctx!.save();
      ctx!.globalAlpha = op;
      ctx!.strokeStyle = "#e8e6e0";
      ctx!.lineWidth = 0.7;
      ctx!.lineCap = "round";
      ctx!.beginPath(); ctx!.moveTo(x - arm, y); ctx!.lineTo(x + arm, y); ctx!.stroke();
      ctx!.beginPath(); ctx!.moveTo(x, y - arm); ctx!.lineTo(x, y + arm); ctx!.stroke();
      const d = arm * 0.42;
      ctx!.lineWidth = 0.35;
      ctx!.beginPath(); ctx!.moveTo(x - d, y - d); ctx!.lineTo(x + d, y + d); ctx!.stroke();
      ctx!.beginPath(); ctx!.moveTo(x + d, y - d); ctx!.lineTo(x - d, y + d); ctx!.stroke();
      const g = ctx!.createRadialGradient(x, y, 0, x, y, arm * 2);
      g.addColorStop(0, `rgba(232,230,224,${op * 0.45})`);
      g.addColorStop(1, "transparent");
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, arm * 2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawGraph() {
      ctx!.save();
      ctx!.globalAlpha = 0.05;
      ctx!.strokeStyle = "#6b8f71";
      ctx!.lineWidth = 0.8;
      for (const e of edges) {
        ctx!.beginPath();
        ctx!.moveTo(nodes[e.a].x, nodes[e.a].y);
        ctx!.lineTo(nodes[e.b].x, nodes[e.b].y);
        ctx!.stroke();
      }
      ctx!.restore();

      for (const n of nodes) {
        n.pulse += 0.007;
        const al = 0.07 + Math.sin(n.pulse) * 0.04;
        ctx!.save();
        ctx!.globalAlpha = al;
        ctx!.fillStyle = "#6b8f71";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      for (const p of packets) {
        p.t += p.spd * p.dir;
        if (p.t > 1) p.t = 0;
        if (p.t < 0) p.t = 1;
        const e = edges[p.e];
        const a = nodes[e.a];
        const b = nodes[e.b];
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;
        ctx!.save();
        ctx!.globalAlpha = 0.28;
        ctx!.fillStyle = "#6b8f71";
        ctx!.beginPath();
        ctx!.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    function render() {
      t += 0.011;
      ctx!.clearRect(0, 0, W, H);
      drawGrid();
      for (const s of stars) {
        const p = Math.sin(t * s.speed + s.phase);
        drawStar(s.x, s.y, s.size * (0.8 + ((p + 1) / 2) * 0.28), 0.12 + ((p + 1) / 2) * s.bright * 0.95);
      }
      drawGraph();
      animationId = requestAnimationFrame(render);
    }

    render();

    const handleScroll = () => {
      if (canvas) {
        canvas.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 will-change-transform"
    />
  );
}
