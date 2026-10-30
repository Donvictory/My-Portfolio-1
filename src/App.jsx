import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
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
import HeroIntro from "./hero/HeroIntro";
import HeroWords from "./hero/HeroWords";
import { getHeroIntroMode, hidesHeadline } from "./hero/introTimeline";
import { dockCards } from "./motion/magneticDock";

gsap.registerPlugin(ScrollTrigger);

// Loaded after the page content so three.js never delays the first paint
const SceneCanvas = lazy(() => import("./scene/SceneCanvas"));

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
  // Decided once, before first paint, so the headline never flashes before its intro
  const [heroIntroMode] = useState(getHeroIntroMode);

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
    { id: "works", label: "Projects" },
    { id: "expertise", label: "Discipline" },
    { id: "about", label: "About" },
    { id: "connect", label: "Contact" },
  ];

  // GSAP Animations with ScrollTrigger
  useEffect(() => {
    const dockCleanups = [];
    const ctx = gsap.context(() => {
      // 1. Hero Reveal (Initial mount and scroll in/out)
      const heroElements = gsap.utils.toArray(".hero-anim");
      if (heroElements.length > 0) {
        gsap.set(heroElements, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: "#intro",
          start: "top 80%",
          end: "bottom 5%",
          onEnter: () =>
            gsap.to(heroElements, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeave: () =>
            gsap.to(heroElements, {
              opacity: 0,
              y: -20,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
          onEnterBack: () =>
            gsap.to(heroElements, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeaveBack: () =>
            gsap.to(heroElements, {
              opacity: 0,
              y: 20,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
        });
      }

      // 2. Capabilities Section Reveal
      const expHeader = gsap.utils.toArray(".expertise-header-anim");
      if (expHeader.length > 0) {
        gsap.set(expHeader, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: "#expertise",
          start: "top 88%",
          end: "bottom 5%",
          onEnter: () =>
            gsap.to(expHeader, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeave: () =>
            gsap.to(expHeader, {
              opacity: 0,
              y: -20,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
          onEnterBack: () =>
            gsap.to(expHeader, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeaveBack: () =>
            gsap.to(expHeader, {
              opacity: 0,
              y: 20,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
        });
      }

      // Discipline cards dock magnetically
      dockCleanups.push(dockCards(gsap.utils.toArray(".capability-card")));

      // 3. About Section Reveal
      const aboutElements = gsap.utils.toArray(".about-anim");
      if (aboutElements.length > 0) {
        gsap.set(aboutElements, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: "#about",
          start: "top 85%",
          end: "bottom 8%",
          onEnter: () =>
            gsap.to(aboutElements, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeave: () =>
            gsap.to(aboutElements, {
              opacity: 0,
              y: -20,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
          onEnterBack: () =>
            gsap.to(aboutElements, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeaveBack: () =>
            gsap.to(aboutElements, {
              opacity: 0,
              y: 24,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
        });
      }

      // 4. Contact Section Reveal
      const connectHeader = gsap.utils.toArray(".connect-header-anim");
      if (connectHeader.length > 0) {
        gsap.set(connectHeader, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: "#connect",
          start: "top 90%",
          end: "bottom 5%",
          onEnter: () =>
            gsap.to(connectHeader, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeave: () =>
            gsap.to(connectHeader, {
              opacity: 0,
              y: -20,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
          onEnterBack: () =>
            gsap.to(connectHeader, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeaveBack: () =>
            gsap.to(connectHeader, {
              opacity: 0,
              y: 20,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
        });
      }

      // Contact cards and the About ethos card dock magnetically
      dockCleanups.push(
        dockCards(gsap.utils.toArray(".contact-anim"), { start: "top 90%", end: "bottom 5%" }),
        dockCards(gsap.utils.toArray(".ethos-card"), { start: "top 90%" })
      );

      // Force calculate accurate scroll triggers after DOM render
      ScrollTrigger.refresh();
    }, containerRef);

    // Watch for document layout & height shifts to keep all section triggers calibrated
    let resizeRaf = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
      dockCleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  const isManualNavigating = useRef(false);

  const handleNavClick = (e, id) => {
    if (e) e.preventDefault();
    setActiveSection(id);
    isManualNavigating.current = true;

    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${id}`);
    }

    setTimeout(() => {
      isManualNavigating.current = false;
    }, 800);
  };

  // Scroll Position Observer for Active Navigation Highlight & Back-to-Top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);

      if (isManualNavigating.current) return;

      const sections = containerRef.current?.querySelectorAll("section[id]");
      if (!sections || sections.length === 0) return;

      const scrollPosition = window.scrollY + 140; // Reference reading line below header

      let currentSectionId = "";
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.id;
        }
      });

      // Edge case: near absolute top of the page
      if (window.scrollY < 200) {
        currentSectionId = "intro";
      }
      // Edge case: scrolled to bottom of the page
      else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        currentSectionId = "connect";
      }

      if (currentSectionId) {
        setActiveSection(currentSectionId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

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
    <div ref={containerRef} className="min-h-screen font-sans text-text-primary antialiased selection:bg-accent selection:text-accent-contrast">
      {/* Persistent 3D backdrop, fixed behind all content */}
      <Suspense fallback={null}>
        <SceneCanvas />
      </Suspense>

      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <a
            href="#intro"
            onClick={(e) => handleNavClick(e, "intro")}
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-text-primary hover:opacity-80 transition-opacity"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
            <span>Donvictory Adewumi</span>
            <span className="hidden sm:inline-block text-text-tertiary font-mono text-xs font-normal">
              / Frontend Engineer
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all ${isActive
                    ? "bg-surface-subtle text-text-primary font-semibold shadow-xs border border-border/80"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle/50"
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-[4px] text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors border border-border"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium bg-surface-subtle hover:bg-surface-hover border border-border text-text-primary transition-colors"
            >
              CV <ArrowUpRight size={13} className="text-text-tertiary" />
            </a>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-[4px] text-text-secondary hover:text-text-primary border border-border"
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
        onNavigate={(id) => handleNavClick(null, id)}
      />

      {/* Main Container */}
      <main className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 divide-y divide-border border-x border-border/40">

        {/* ========================================================== */}
        {/* 1. HERO SECTION */}
        {/* ========================================================== */}
        <section
          id="intro"
          className={`relative pt-14 pb-20 sm:pt-20 sm:pb-24 space-y-10 scroll-mt-20 ${hidesHeadline(heroIntroMode) ? "hero-await" : ""}`}
        >
          {/* Companion intro overlay (first child so the section's spacing is unchanged) */}
          {heroIntroMode !== "none" && <HeroIntro mode={heroIntroMode} />}

          <div className="space-y-6 max-w-4xl">
            <div className="hero-anim flex items-center gap-2">
              <span className="mono-label">Lagos, Nigeria</span>
              <span className="text-text-tertiary font-mono text-xs">•</span>
              <span className="mono-label text-emerald-600 dark:text-emerald-400 font-semibold">Available for Work</span>
            </div>

            <h1 className="hero-anim text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12]">
              <HeroWords text="Building reliable, high-performance web systems with mathematical precision and thoughtful design." />
            </h1>

            <p className="hero-anim hero-support text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl font-normal">
              Frontend Developer specializing in React and Next.js, combining analytical thinking with a user-focused approach to build scalable, pixel-accurate web applications. Experienced in translating product requirements and designs into clean interfaces, maintainable architecture, and reliable user experiences.
            </p>
          </div>

          <div className="hero-anim hero-support flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#works"
              onClick={(e) => handleNavClick(e, "works")}
              className="btn-minimal-primary"
            >
              View Projects <ArrowDown size={14} />
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
        <section id="expertise" className="py-10 sm:py-16 space-y-12 scroll-mt-20">
          <div className="expertise-header-anim space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Discipline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
                  <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.stack.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-[4px] bg-surface-subtle text-text-secondary"
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


        {/* ========================================================== */}
        {/* 5. ABOUT */}
        {/* ========================================================== */}
        <section id="about" className="py-16 sm:py-24 space-y-12 scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Portrait */}
            <div className="about-anim md:col-span-4 space-y-3">
              <div className="aspect-[4/5] rounded-[4px] overflow-hidden bg-surface-subtle shadow-sm">
                <img
                  src="/projects/about-pic.jpeg"
                  alt="Donvictory Adewumi"
                  className="w-full h-full object-cover grayscale contrast-105"
                />
              </div>
            </div>

            {/* Narrative */}
            <div className="about-anim md:col-span-8 space-y-6">
              <div className="space-y-1.5">
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

              <div className="ethos-card p-5 rounded-[4px] bg-surface-subtle space-y-2">
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
        <section id="connect" className="py-16 sm:py-24 space-y-12 scroll-mt-20">
          {/* Section Header */}
          <div className="connect-header-anim space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Let's Build Something Together
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Available for full-time frontend/full-stack engineering positions, contract builds, and technical collaborations. Reach out directly via email, WhatsApp, or socials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Direct Email Card */}
            <div className="contact-anim minimal-card p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-surface-subtle flex items-center justify-center text-text-primary">
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
                  className="btn-minimal-primary !text-xs !py-2 !rounded-[4px] flex-1 justify-center"
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
                  className="btn-minimal-secondary !text-xs !py-2 !rounded-[4px] flex-1 justify-center"
                >
                  Send Email <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="contact-anim minimal-card p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
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
                  className="btn-minimal-primary !text-xs !py-2 !rounded-[4px] flex-1 justify-center bg-emerald-700 hover:bg-emerald-800 text-white border-none"
                >
                  <MessageCircle size={13} /> Chat on WhatsApp
                </a>
                <button
                  onClick={copyPhone}
                  className="btn-minimal-secondary !text-xs !py-2 !rounded-[4px] flex-1 justify-center"
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
                <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-[4px] bg-surface-subtle text-text-secondary">
                  Remote Worldwide
                </span>
                <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-[4px] bg-surface-subtle text-text-secondary">
                  Fast Response (&lt; 24h)
                </span>
              </div>
            </div>

            {/* Social Profiles */}
            <div className="contact-anim minimal-card p-6 flex flex-col justify-between space-y-3">
              <div>
                <span className="mono-label text-[10px]">Social Profiles</span>
                <p className="text-xs text-text-secondary pt-1">
                  Connect or follow across platforms.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://github.com/Donvictory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-[4px] bg-surface-subtle hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-xs font-mono"
                  title="GitHub"
                  aria-label="GitHub"
                >
                  <Github size={15} /> GitHub
                </a>
                <a
                  href="https://linkedin.com/in/oluwasegun-donvictory-b27a87221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-[4px] bg-surface-subtle hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-xs font-mono"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={15} /> LinkedIn
                </a>
                <a
                  href="https://twitter.com/don_of_victory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-[4px] bg-surface-subtle hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-xs font-mono"
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
          className="fixed bottom-6 right-6 w-9 h-9 rounded-[4px] bg-surface border border-border text-text-secondary hover:text-text-primary flex items-center justify-center shadow-md z-40 transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp size={15} />
        </button>
      )}
    </div>
  );
}

export default App;
