import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Menu,
  ArrowUpRight,
  ArrowDown,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Copy,
  Check,
  Sun,
  Moon,
  ArrowUp,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";
import "./index.css";
import { projects } from "./data";
import Sidebar from "./components/Sidebar";
import SelectedWorks from "./components/SelectedWorks";
import ProjectModal from "./components/ProjectModal";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("intro");
  const [copied, setCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Default theme is explicitly 'light'
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const containerRef = useRef(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const navItems = [
    { id: "intro", label: "Home" },
    { id: "works", label: "Selected Works" },
    { id: "expertise", label: "Capabilities" },
    { id: "experience", label: "Experience" },
    { id: "about", label: "About" },
    { id: "connect", label: "Contact" },
  ];

  // GSAP Animations with ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Initial Mount Reveal
      gsap.from(".hero-anim", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      });

      // 2. Selected Works Cards Scroll Reveal
      gsap.from(".project-card", {
        scrollTrigger: {
          trigger: "#works",
          start: "top 80%",
        },
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all",
      });

      // 3. Capabilities Bento Matrix Reveal
      gsap.from(".capability-card", {
        scrollTrigger: {
          trigger: "#expertise",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all",
      });

      // 4. Experience Ledger Rows Reveal
      gsap.from(".experience-row", {
        scrollTrigger: {
          trigger: "#experience",
          start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "all",
      });

      // 5. About Section Reveal
      gsap.from(".about-anim", {
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
        },
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: "power2.out",
        clearProps: "all",
      });

      // 6. Contact Cards Reveal
      gsap.from(".contact-anim", {
        scrollTrigger: {
          trigger: "#connect",
          start: "top 95%",
          once: true,
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "all",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Section Observer for Active Navigation Highlight
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = containerRef.current?.querySelectorAll("section[id]");
    if (sections) {
      sections.forEach((section) => observer.observe(section));
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("donvictoryadewumi4@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText("+2349091735644");
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
  };

  return (
    <div ref={containerRef} className="bg-bg min-h-screen font-sans text-text-primary antialiased selection:bg-accent selection:text-accent-contrast">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#intro"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-text-primary hover:opacity-80 transition-opacity"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
            <span>Donvictory Adewumi</span>
            <span className="hidden sm:inline-block text-text-tertiary font-mono text-xs font-normal">
              / Frontend Engineer
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? "text-text-primary font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors border border-border"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-subtle hover:bg-surface-hover border border-border text-text-primary transition-colors"
            >
              CV <ArrowUpRight size={13} className="text-text-tertiary" />
            </a>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary border border-border"
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 divide-y divide-border">
        
        {/* ========================================================== */}
        {/* 1. HERO SECTION */}
        {/* ========================================================== */}
        <section
          id="intro"
          className="pt-20 pb-24 sm:pt-28 sm:pb-32 space-y-10"
        >
          <div className="space-y-6 max-w-3xl">
            <div className="hero-anim flex items-center gap-2">
              <span className="mono-label">Lagos, Nigeria</span>
              <span className="text-text-tertiary font-mono text-xs">•</span>
              <span className="mono-label text-emerald-600 dark:text-emerald-400 font-semibold">Available for Work</span>
            </div>

            <h1 className="hero-anim text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12]">
              Building reliable, high-performance web systems with mathematical precision and thoughtful design.
            </h1>

            <p className="hero-anim text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl font-normal">
              Frontend Developer specializing in React and Next.js, combining analytical thinking with a user-focused approach to build scalable, pixel-accurate web applications. Experienced in translating product requirements and designs into clean interfaces, maintainable architecture, and reliable user experiences.
            </p>
          </div>

          <div className="hero-anim flex flex-wrap items-center gap-4 pt-2">
            <a href="#works" className="btn-minimal-primary">
              View Selected Works <ArrowDown size={14} />
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-minimal-secondary"
            >
              Read Resume / CV <ArrowUpRight size={14} />
            </a>
            <button
              onClick={copyEmail}
              className="btn-minimal-secondary"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" /> Copied Email
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Email
                </>
              )}
            </button>
          </div>
        </section>

        {/* ========================================================== */}
        {/* 2. SELECTED WORKS (REVAMPED SHOWCASE + INDEX TABLE) */}
        {/* ========================================================== */}
        <SelectedWorks
          projects={projects}
          onSelectProject={setSelectedProject}
        />

        {/* ========================================================== */}
        {/* 3. CAPABILITIES / TECHNICAL EXPERTISE */}
        {/* ========================================================== */}
        <section id="expertise" className="py-20 sm:py-28 space-y-12">
          <div className="space-y-1.5">
            <span className="mono-label">Discipline</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Engineering Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                idx: "01",
                title: "Frontend Architecture",
                desc: "Modular, component-driven design in React and Next.js. Focus on strict typing, efficient state hierarchies, and predictable data mutation.",
                stack: ["React 19", "Next.js", "TypeScript", "Vite", "Component Systems"],
              },
              {
                idx: "02",
                title: "Interaction & UI Engineering",
                desc: "Responsive web styling using modern CSS and Tailwind, enhanced with intentional micro-interactions and strict accessibility standards.",
                stack: ["Tailwind CSS", "Framer Motion", "Vanilla CSS", "WCAG AA"],
              },
              {
                idx: "03",
                title: "Data Flow & API Integration",
                desc: "Connecting user interfaces with backend RESTful services, WebExtensions APIs, caching patterns, and optimistic UI updates.",
                stack: ["REST APIs", "Async Patterns", "WebExtensions", "Browser Storage"],
              },
            ].map((item) => (
              <div
                key={item.idx}
                className="capability-card minimal-card p-6 sm:p-8 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="mono-label text-text-tertiary">{item.idx}</span>
                  <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                  {item.stack.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-subtle border border-border text-text-tertiary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/* 4. EXPERIENCE & EDUCATION (EDITORIAL LEDGER) */}
        {/* ========================================================== */}
        <section id="experience" className="py-20 sm:py-28 space-y-12">
          <div className="space-y-1.5">
            <span className="mono-label">History</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Experience & Education
            </h2>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {[
              {
                year: "May 2026 — Present",
                role: "Software Developer",
                org: "PropertyJar Realty",
                summary:
                  "Developed the responsive web application frontend and integrated Backend-as-a-Service (BaaS) for property listings, dynamic query filters, campaign showcases, and automated lead inquiry management.",
              },
              {
                year: "2025 — 2026",
                role: "Software Developer",
                org: "iMart Devices",
                summary:
                  "Engineered the frontend application and implemented BaaS (Supabase) database architecture for automated gadget trade-in valuation, real-time inventory synchronization, and commerce flows.",
              },
              {
                year: "2021 — 2025",
                role: "B.Sc. Mathematics",
                org: "University of Lagos (UNILAG)",
                summary:
                  "Comprehensive study of computational logic, discrete mathematics, and numerical algorithms, establishing a strong foundation for software design and system architecture.",
              },
            ].map((entry, idx) => (
              <div
                key={idx}
                className="experience-row py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
              >
                <div className="md:col-span-3 font-mono text-xs text-text-tertiary uppercase">
                  {entry.year}
                </div>
                <div className="md:col-span-4 space-y-0.5">
                  <h3 className="text-base font-semibold text-text-primary">
                    {entry.role}
                  </h3>
                  <p className="text-xs font-medium text-text-secondary">
                    {entry.org}
                  </p>
                </div>
                <div className="md:col-span-5 text-sm text-text-secondary leading-relaxed">
                  {entry.summary}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/* 5. ABOUT */}
        {/* ========================================================== */}
        <section id="about" className="py-20 sm:py-28 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Portrait */}
            <div className="about-anim md:col-span-4 space-y-3">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-subtle border border-border">
                <img
                  src="/projects/about-pic.jpeg"
                  alt="Donvictory Adewumi"
                  className="w-full h-full object-cover grayscale contrast-105"
                />
              </div>
              <div className="text-xs text-text-tertiary font-mono">
                Donvictory Adewumi // Lagos, NG
              </div>
            </div>

            {/* Narrative */}
            <div className="about-anim md:col-span-8 space-y-6">
              <div className="space-y-1.5">
                <span className="mono-label">Background</span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  Engineering with Purpose
                </h2>
              </div>

              <div className="space-y-4 text-text-secondary text-sm sm:text-base leading-relaxed">
                <p>
                  I began programming driven by a passion for decentralized technology and digital infrastructure. As I built deeper into software, I discovered that the frontend is where engineering logic meets human behavior.
                </p>
                <p>
                  My goal on every project is simple: create web software that is fast, resilient, accessible, and structured to scale seamlessly over time.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface-subtle border border-border space-y-2">
                <span className="mono-label text-[10px]">Guiding Ethos</span>
                <p className="text-xs text-text-primary italic leading-relaxed">
                  "Every visual element should have an architectural rationale. When code is clean and interfaces are clear, user trust follows naturally."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* 6. CONTACT / GET IN TOUCH */}
        {/* ========================================================== */}
        <section id="connect" className="py-20 sm:py-28 space-y-10">
          {/* Section Header */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="mono-label">Get in Touch</span>
              <span className="text-text-tertiary font-mono text-xs">•</span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open for Opportunities
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Let's Build Something Exceptional
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Available for full-time frontend/full-stack engineering positions, contract builds, and technical collaborations. Reach out directly via email, WhatsApp, or socials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Direct Email Card */}
            <div className="contact-anim minimal-card p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center text-text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="mono-label text-[10px]">Email Address</span>
                  <p className="text-sm font-semibold text-text-primary font-mono select-all">
                    donvictoryadewumi4@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={copyEmail}
                  className="btn-minimal-primary !text-xs !py-2 flex-1 justify-center"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy Email
                    </>
                  )}
                </button>
                <a
                  href="mailto:donvictoryadewumi4@gmail.com"
                  className="btn-minimal-secondary !text-xs !py-2 flex-1 justify-center"
                >
                  Send Email <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="contact-anim minimal-card p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <span className="mono-label text-[10px]">Phone & WhatsApp</span>
                  <p className="text-sm font-semibold text-text-primary font-mono select-all">
                    +234 909 173 5644
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://wa.me/2349091735644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-minimal-primary !text-xs !py-2 flex-1 justify-center bg-emerald-700 hover:bg-emerald-800 text-white border-none"
                >
                  <MessageCircle size={13} /> Chat on WhatsApp
                </a>
                <button
                  onClick={copyPhone}
                  className="btn-minimal-secondary !text-xs !py-2 flex-1 justify-center"
                >
                  {phoneCopied ? (
                    <>
                      <Check size={13} className="text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Phone size={13} /> Copy Number
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Location & Timezone Info */}
            <div className="contact-anim minimal-card p-6 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="mono-label text-[10px]">Location & Timezone</span>
                <div className="flex items-center gap-2.5 pt-1">
                  <MapPin size={16} className="text-text-tertiary" />
                  <span className="text-xs font-semibold text-text-primary">
                    Lagos, Nigeria
                  </span>
                  <span className="text-text-tertiary font-mono text-xs">•</span>
                  <span className="text-xs text-text-secondary font-mono">
                    WAT (UTC+1)
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-md bg-surface-subtle border border-border text-text-secondary">
                  Remote Worldwide
                </span>
                <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-md bg-surface-subtle border border-border text-text-secondary">
                  Fast Response (&lt; 24h)
                </span>
              </div>
            </div>

            {/* Social Profiles */}
            <div className="contact-anim minimal-card p-6 flex flex-col justify-between space-y-3">
              <div>
                <span className="mono-label text-[10px]">Social & Professional Profiles</span>
                <p className="text-xs text-text-secondary pt-1">
                  Connect or follow my engineering updates across platforms.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://github.com/Donvictory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-xs font-mono"
                  title="GitHub"
                  aria-label="GitHub"
                >
                  <Github size={15} /> GitHub
                </a>
                <a
                  href="https://linkedin.com/in/oluwasegun-donvictory-b27a87221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-xs font-mono"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={15} /> LinkedIn
                </a>
                <a
                  href="https://twitter.com/don_of_victory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-xs font-mono"
                  title="Twitter / X"
                  aria-label="Twitter / X"
                >
                  <Twitter size={15} /> Twitter
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* 7. FOOTER */}
        {/* ========================================================== */}
        <footer className="py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-tertiary">
          <div>
            © {new Date().getFullYear()} Donvictory Adewumi. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built with React 19, Tailwind & GSAP</span>
            <span>•</span>
            <a
              href="#intro"
              className="text-text-secondary hover:text-text-primary"
            >
              Back to top ↑
            </a>
          </div>
        </footer>
      </main>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Minimal Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-9 h-9 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary flex items-center justify-center shadow-md z-40 transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp size={15} />
        </button>
      )}
    </div>
  );
}

export default App;
