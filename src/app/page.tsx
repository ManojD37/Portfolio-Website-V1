"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight, CheckCircle2, ChevronRight, Menu, X } from "lucide-react";
import LenisProvider from "@/components/LenisProvider";
import HeroCanvas from "@/components/HeroCanvas";
import { skillList } from "@/components/SkillIcons";
import SkillCard from "@/components/SkillCard";
import ProjectCard, { ProjectData } from "@/components/ProjectCard";
import PreviewModal from "@/components/PreviewModal";

const projects: ProjectData[] = [
  {
    num: "01",
    title: "Sentieal — Developer Intelligence Platform",
    desc: "AI-powered code visualization tool that helps developers understand architecture, trace failures, detect affected modules, and calculate the blast radius of pull requests. Born from the real frustration of losing mental context in large codebases.",
    tags: ["Next.js", "FastAPI", "Supabase", "AI Orchestration"],
    outcome: "Turns codebase archaeology from hours into seconds",
    link: "https://sentinel-teal-two.vercel.app/",
    type: "Dev Intelligence",
    isFeatured: true,
    canvasId: "pc1",
  },
  {
    num: "02",
    title: "Zen AI — Healthcare Automation System",
    desc: "Production AI system automating healthcare referral document processing. Handles OCR extraction, PHI classification, HIPAA-compliant storage — reducing manual review workflows significantly at enterprise scale.",
    tags: ["GPT-4o", "Tesseract OCR", "FastAPI", "Azure"],
    outcome: "Eliminated hours of manual document review per day at enterprise scale",
    link: "https://zenai-fax-referral-extractor.onrender.com/",
    type: "Healthcare AI",
    canvasId: "pc2",
  },
  {
    num: "03",
    title: "Your Rights — Civic Infrastructure Platform",
    desc: "A civic escalation platform bridging citizens and authorities — combining the openness of social platforms with anonymity for safe grievance reporting and intelligent issue escalation.",
    tags: ["Coordination Systems", "Public Infrastructure", "Civic Tech"],
    outcome: "Safe, anonymous escalation from citizen to authority — no friction",
    link: "https://your-rights.vercel.app/",
    type: "Civic Infrastructure",
    canvasId: "pc3",
  },
  {
    num: "04",
    title: "En Passant — Territory Chess Ecosystem",
    desc: "Chess meets geolocation. A territory domination ecosystem where players compete to own regions, climb rankings, and engage in real-time strategic battles — Pokémon Go mechanics applied to competitive chess.",
    tags: ["Game Systems", "Geolocation", "Multiplayer", "Real-time"],
    outcome: "Real-world territory battles powered by chess strategy",
    link: "https://github.com/ManojD37", // Default to GitHub profile as no site URL is present
    type: "Game Ecosystem",
    canvasId: "pc4",
  },
];

const marqueeItems = skillList.map((skill) => skill.name);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Custom Preview Modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Custom Cursor states
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Page Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Handle client-side mounts
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 800);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle custom cursor tracking
  useEffect(() => {
    if (!mounted) return;
    const updateMousePos = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePos);
    return () => window.removeEventListener("mousemove", updateMousePos);
  }, [mounted]);

  // Interpolate cursor ring with inertia
  useEffect(() => {
    if (!mounted) return;
    let active = true;
    const anim = () => {
      if (!active) return;
      setRingPos((prev) => {
        const rx = prev.x + (mousePos.x - prev.x) * 0.12;
        const ry = prev.y + (mousePos.y - prev.y) * 0.12;
        return { x: rx, y: ry };
      });
      requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
    return () => {
      active = false;
    };
  }, [mousePos, mounted]);

  // Hook cursor hover classes
  useEffect(() => {
    if (!mounted || loading) return;
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const elements = document.querySelectorAll("a, button, [role='button'], .project-card");
    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [mounted, loading, previewOpen]);

  const triggerPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  if (!mounted) return null;

  return (
    <LenisProvider>
      {/* ── Page Loader ── */}
      <div
        className={`page-loader fixed inset-0 z-[10000] bg-bg flex items-center justify-center transition-all duration-700 ease-in-out ${!loading ? "opacity-0 invisible pointer-events-none" : ""
          }`}
      >
        <span className="font-mono text-[11px] text-text-custom3 tracking-[0.3em] uppercase animate-loader-pulse">
          Loading Portfolio…
        </span>
      </div>

      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="scroll-progress fixed top-0 left-0 right-0 h-[2px] bg-mono z-[1000] origin-left"
        style={{ scaleX }}
      />

      {/* ── Custom Cursor (Desktop only) ── */}
      <div className="hidden lg:block">
        <div
          className="cursor fixed w-2.5 h-2.5 bg-text-custom rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        />
        <div
          className={`cursor-ring fixed rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out border ${isHovered
              ? "w-14 h-14 border-mono/65 bg-mono/5 scale-110"
              : "w-8 h-8 border-text-custom/25 bg-transparent"
            }`}
          style={{ left: `${ringPos.x}px`, top: `${ringPos.y}px` }}
        />
      </div>

      {/* ── Header / Navigation ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 md:py-6 flex justify-between items-center border-b transition-all duration-500 ${scrolled
            ? "border-border-custom bg-bg/85 backdrop-blur-xl shadow-lg"
            : "border-transparent bg-transparent"
          }`}
      >
        <a href="#home" className="nav-logo font-mono text-[13px] text-text-custom2 hover:text-text-custom tracking-wider font-light transition-colors duration-200">
          MD_
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-10 list-none">
          {["work", "about", "experience", "stack", "contact"].map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className="font-mono text-[12px] text-text-custom2 hover:text-text-custom capitalize tracking-wide font-light transition-colors duration-200"
              >
                {section}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-text-custom2 hover:text-text-custom transition-colors duration-200 z-50"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 bg-bg/97 backdrop-blur-2xl z-40 flex flex-col justify-center items-center gap-8 transition-all duration-500 ease-in-out md:hidden ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
      >
        {["work", "about", "experience", "stack", "contact"].map((section) => (
          <a
            key={section}
            href={`#${section}`}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-light text-text-custom2 hover:text-text-custom tracking-wide capitalize transition-colors duration-200"
          >
            {section}
          </a>
        ))}
      </div>

      <main className="relative z-10 flex-grow">
        {/* ══════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════ */}
        <section
          id="home"
          className="hero min-h-screen flex flex-col justify-center px-6 md:px-12 pb-20 relative overflow-hidden pt-36 md:pt-40"
        >
          <HeroCanvas />
          <div className="hero-gradient absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_88%_4%,rgba(52,52,52,0.4)_0%,transparent_60%),radial-gradient(ellipse_55%_50%_at_4%_96%,rgba(107,143,113,0.09)_0%,transparent_55%),radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(10,10,10,0.55)_0%,transparent_100%)]" />
          <div className="hero-vignette absolute inset-0 z-2 pointer-events-none bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_35%,rgba(10,10,10,0.75)_100%)]" />
          <div className="hero-bottom-fade absolute bottom-0 left-0 right-0 h-[45%] z-2 pointer-events-none bg-gradient-to-t from-bg via-bg/92 to-transparent" />

          {/* Brighter background "MANOJ" text */}
          <div
            className="hero-bg-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-transparent whitespace-nowrap pointer-events-none select-none tracking-tight z-1"
            style={{
              fontSize: "clamp(80px, 16vw, 240px)",
              WebkitTextStroke: "1px rgba(232, 230, 224, 0.16)",
              color: "rgba(232, 230, 224, 0.02)",
              textShadow: "0 0 80px rgba(107,143,113,0.12), 0 0 160px rgba(107,143,113,0.06)",
            }}
          >
            MANOJ
          </div>

          {/* Column structure with layout adjustments to avoid sitting too high */}
          <div className="max-w-4xl relative z-10 flex flex-col gap-6 md:gap-8 mt-12 md:mt-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hero-eyebrow font-mono text-[11px] text-mono tracking-[0.18em] uppercase"
            >
              AI Engineer & Systems Builder — Chennai, India
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="hero-headline text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight text-text-custom"
            >
              Building
              <br />
              <em className="font-serif italic font-normal text-text-custom2 block md:inline md:mr-4">intelligent</em>
              systems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="hero-sub text-[15px] text-text-custom2 leading-relaxed max-w-[520px]"
            >
              I engineer AI infrastructure, developer tools, and intelligent workflows. Systems-first thinker. Open for Job.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="hero-actions flex gap-6 items-center flex-wrap"
            >
              <a href="#work" className="btn-primary bg-text-custom text-bg px-8 py-3.5 text-[13px] font-medium tracking-wide uppercase transition-all duration-200 hover:opacity-85 hover:-translate-y-[1px]">
                View Work
              </a>
              <a
                href="#contact"
                className="btn-ghost font-mono text-[13px] text-text-custom2 hover:text-text-custom tracking-wide flex items-center gap-2 group/btn transition-colors duration-200"
              >
                Get in touch
                <span className="text-lg transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
              </a>
            </motion.div>
          </div>

          {/* Availability and Scroll Tickers */}
          <div className="absolute bottom-16 left-8 md:left-12 z-10 hidden md:flex items-center gap-3 select-none">
            <div className="ticker-dot w-2 h-2 bg-mono rounded-full animate-ping" />
            <span className="font-mono text-[10px] text-text-custom3 uppercase tracking-wider">
              Available for new projects & collaborations
            </span>
          </div>

          <div className="absolute bottom-16 right-8 md:right-12 z-10 hidden md:flex flex-col items-center gap-3 select-none">
            <div className="scroll-line w-[1px] h-[55px] bg-gradient-to-b from-transparent to-border-custom2 relative overflow-hidden animate-scroll-drop" />
            <span className="font-mono text-[9px] text-text-custom3 uppercase tracking-[0.25em] rotate-90 origin-bottom whitespace-nowrap mt-8">
              Scroll
            </span>
          </div>
        </section>

        {/* ── Marquee band ── */}
        <div className="marquee-band border-t border-b border-border-custom bg-bg2 overflow-hidden py-4 flex select-none">
          <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] gap-10">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <span
                key={idx}
                className="marquee-item font-mono text-[12px] text-text-custom3 tracking-widest uppercase flex items-center gap-10"
              >
                {item}
                <span className="text-mono text-base font-normal">·</span>
              </span>
            ))}
          </div>
        </div>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            ABOUT SECTION
        ══════════════════════════════════════════ */}
        <section id="about" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            001 — About <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="about-grid grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="flex flex-col gap-6">
              <h2 className="about-headline text-3xl md:text-5xl font-light leading-[1.2] tracking-tight text-text-custom">
                I think in <em className="font-serif italic font-normal text-text-custom2">systems,</em> not features.
              </h2>
              <div className="about-body text-text-custom2 text-[15px] leading-relaxed flex flex-col gap-5">
                <p>
                  As an Associate Software Engineer at Infinite Computer Solutions, I build production-level healthcare automation systems. My exposure to OCR extraction engines, LLM-powered classification workflows, and HIPAA-secure data pipelines has shaped how I design resilient, observable, and compliant AI architectures at scale.
                </p>
                <p>
                  I focus on the intersection of LLM orchestration, developer cognitive tooling, and backend infrastructure. Whether building code visualization graphs like Sentieal, real-time multiplayer geo-chess platforms like En Passant, or setting up secure Docker container workflows, my goal is to design systems that reduce complexity and run with high reliability.
                </p>
                <p>
                  Long-term goal: build AI systems and startup ecosystems that help builders, engineers, and founders move faster.
                </p>
              </div>
              <div className="stack-row flex flex-wrap gap-2 mt-4">
                {["Python", "FastAPI", "Next.js", "LangChain", "GPT-4o", "Azure", "Supabase", "Tesseract"].map((chip) => (
                  <span
                    key={chip}
                    className="stack-chip font-mono text-[10px] text-text-custom3 border border-border-custom px-3 py-1 tracking-wider uppercase hover:text-text-custom2 hover:border-border-custom2 transition-colors duration-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8 w-full lg:max-w-md">
              <div className="philosophy-block bg-bg2 border border-border-custom border-l-2 border-l-mono p-8 rounded-sm">
                <p className="text-[17px] text-accent2 leading-relaxed font-light italic">
                  &ldquo;Technology should reduce complexity, not add to it. Every system I build starts from that premise.&rdquo;
                </p>
                <div className="attr font-mono text-[10px] text-text-custom3 tracking-wider uppercase mt-6">
                  — Engineering philosophy
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 gap-6">
                {[
                  { num: "2+", label: "Years in production AI systems" },
                  { num: "4", label: "Projects shipped across AI & infrastructure" },
                  { num: "∞", label: "Systems still left to build" },
                ].map((stat, idx) => (
                  <div key={idx} className="about-stat border-t border-border-custom pt-6 flex flex-col gap-1">
                    <div className="stat-number text-4xl md:text-5xl font-light text-text-custom tracking-tight leading-none">
                      {stat.num}
                    </div>
                    <div className="stat-label font-mono text-[10px] text-text-custom2 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            WORK (PROJECTS) SECTION
        ══════════════════════════════════════════ */}
        <section id="work" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            002 — Selected Work <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="work-intro max-w-2xl mb-16">
            <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-tight mb-4">
              Projects that <em className="font-serif italic font-normal text-text-custom2">matter.</em>
            </h2>
            <p className="text-text-custom2 font-light text-[15px] leading-relaxed">
              Each project started from a real frustration, a genuine problem, or a system I wished existed.
            </p>
          </div>

          {/* Responsive Grid of Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((proj) => (
              <ProjectCard key={proj.num} project={proj} onPreview={triggerPreview} />
            ))}
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            EXPERIENCE SECTION
        ══════════════════════════════════════════ */}
        <section id="experience" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            003 — Experience <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="exp-layout grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
                Where I&apos;ve <em className="font-serif italic font-normal text-text-custom2">worked.</em>
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed">
                Exposure to regulated healthcare environments taught me the importance of reliability, security, and production-grade AI deployment — things you can&apos;t learn from tutorials.
              </p>
            </div>

            <div className="exp-items flex flex-col w-full">
              {[
                {
                  role: "Associate Software Engineer",
                  period: "2023 — Present",
                  company: "Infinite Computer Solutions",
                  desc: "Enterprise healthcare AI systems — OCR pipelines, LLM-powered workflows, secure PHI handling, Azure-based architectures, CI/CD, and production AI deployment across regulated environments.",
                  bullets: [
                    "Built and deployed OCR + LLM pipelines for referral document automation",
                    "HIPAA-compliant PHI classification at production scale",
                    "Azure-based cloud infrastructure, CI/CD, and observability",
                  ],
                },
                {
                  role: "Builder in Public",
                  period: "Ongoing",
                  company: "Independent",
                  desc: "Building AI systems, developer tools, and startup ideas. Documenting the process, sharing systems thinking, and exploring how AI will reshape software engineering over the next decade.",
                  bullets: [
                    "Sentieal — AI developer intelligence platform",
                    "En Passant — real-time multiplayer geolocation chess",
                    "Your Rights — civic tech for anonymous grievance escalation",
                  ],
                },
              ].map((item, idx) => (
                <div key={idx} className="exp-item border-t border-border-custom py-8 flex flex-col gap-4">
                  <div className="exp-header flex justify-between items-start flex-wrap gap-2">
                    <h3 className="exp-role text-lg font-normal text-text-custom tracking-tight">
                      {item.role}
                    </h3>
                    <span className="exp-period font-mono text-[10px] text-text-custom3 tracking-wider uppercase">
                      {item.period}
                    </span>
                  </div>
                  <div className="exp-company font-mono text-[12px] text-mono tracking-wider uppercase">
                    {item.company}
                  </div>
                  <p className="exp-desc text-text-custom2 font-light text-[14px] leading-relaxed">
                    {item.desc}
                  </p>
                  <ul className="exp-bullets flex flex-col gap-2 list-none p-0">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="text-text-custom3 font-light text-[13px] leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-border-custom2">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="border-b border-border-custom w-full" />
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            NOW SECTION
        ══════════════════════════════════════════ */}
        <section id="now" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            004 — Now <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="now-grid grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
                What I&apos;m <em className="font-serif italic font-normal text-text-custom2">doing</em> right now.
              </h2>
              <p className="text-text-custom2 font-light text-[14px] leading-relaxed">
                A live snapshot. Updated whenever something meaningful shifts.
              </p>
            </div>

            <div className="now-cards grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border-custom border border-border-custom">
              {[
                { label: "Building", val: "Sentieal", sub: "AI code intelligence platform — making large codebases navigable for developers" },
                { label: "Thinking About", val: "LLM Orchestration Patterns", sub: "How multi-agent systems fail in production and what actually makes them reliable" },
                { label: "Exploring", val: "Startup Ecosystems", sub: "Builder communities, founder networks, how to create environments where makers move fast" },
              ].map((card, idx) => (
                <div key={idx} className="now-card bg-bg p-8 hover:bg-bg2 transition-colors duration-300 flex flex-col gap-4">
                  <span className="now-label font-mono text-[9px] text-mono uppercase tracking-[0.2em]">
                    {card.label}
                  </span>
                  <div>
                    <div className="now-value text-[16px] font-normal text-text-custom mb-1">
                      {card.val}
                    </div>
                    <div className="now-sub text-text-custom2 font-light text-[13px] leading-relaxed">
                      {card.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            STACK (SKILLS GRID) SECTION
        ══════════════════════════════════════════ */}
        <section id="stack" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            005 — Tech Stack <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="stack-section-grid grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
                Tools I <em className="font-serif italic font-normal text-text-custom2">actually</em> use.
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed mb-6">
                No buzzword bingo. Optimized brand SVGs for all requested technology profiles.
              </p>
              <p className="text-text-custom3 font-mono text-[11px] tracking-wide leading-relaxed">
                Leaning heavily on TypeScript + Next.js for product layers, Python + FastAPI for backend intelligence, and Supabase + Docker for system services.
              </p>
            </div>

            {/* Custom SVG grid showing all 22 logos */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 w-full">
              {skillList.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            CONTACT SECTION
        ══════════════════════════════════════════ */}
        <section id="contact" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            006 — Contact <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="contact-inner grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-tight">
                Let&apos;s <em className="font-serif italic font-normal text-text-custom2">build</em><br />something.
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed mb-6">
                Open to interesting conversations — AI systems, startup ideas, developer tooling, collaborations, or just a good technical discussion.
              </p>

              {/* Verified links from links.txt */}
              <div className="contact-links flex flex-col w-full">
                {[
                  { name: "GitHub", url: "https://github.com/ManojD37" },
                  { name: "LinkedIn", url: "https://www.linkedin.com/in/manojd7/" },
                  { name: "Twitter / X", url: "https://x.com/ManojDevarajulu" },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link border-t border-border-custom py-5 px-1 flex justify-between items-center text-text-custom2 hover:text-text-custom hover:pl-3 font-mono text-[13px] tracking-wide transition-all duration-300 group"
                  >
                    {item.name}
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
                <div className="border-b border-border-custom w-full" />
              </div>
            </div>

            <div className="flex flex-col gap-6 max-w-sm lg:self-start lg:mt-8">
              <a href="mailto:manoj@example.com" className="big-email text-2xl font-light text-text-custom hover:text-text-custom2 tracking-tight pb-6 border-b border-border-custom transition-colors duration-200">
                manoj@example.com
              </a>
              <div className="availability flex items-center gap-2 select-none">
                <div className="avail-dot w-2 h-2 bg-mono rounded-full animate-ping" />
                <span className="font-mono text-[10px] text-mono uppercase tracking-wider">
                  Available for new projects
                </span>
              </div>
              <p className="contact-note text-text-custom3 font-mono text-[11px] leading-relaxed mt-2 select-none">
                Based in Chennai, India · Usually responds within 24 hours
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="px-8 py-8 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border-custom bg-bg select-none relative z-10">
        <span className="footer-copy font-mono text-[10px] text-text-custom3 uppercase tracking-wider">
          © 2026 Manoj D
        </span>
        <span className="footer-made font-mono text-[10px] text-text-custom3 uppercase tracking-wider">
          Chennai, India — Built with intention.
        </span>
        <a href="#home" className="footer-back font-mono text-[10px] text-text-custom3 hover:text-text-custom2 uppercase tracking-wider transition-colors duration-200">
          Back to top ↑
        </a>
      </footer>

      {/* ── Website Preview Modal ── */}
      <PreviewModal
        isOpen={previewOpen}
        url={previewUrl}
        title={previewTitle}
        onClose={() => setPreviewOpen(false)}
      />
    </LenisProvider>
  );
}
