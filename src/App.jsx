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
import RollText from "./components/RollText";
import ProjectModal from "./components/ProjectModal";
import useHeroReveal, { getHeroRevealMode } from "./hero/useHeroReveal";
import { dockCards } from "./motion/magneticDock";

gsap.registerPlugin(ScrollTrigger);

const SceneCanvas = lazy(() => import("./scene/SceneCanvas"));

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("intro");
  const [copied, setCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const containerRef = useRef(null);
  const introRef = useRef(null);
  const [heroRevealMode] = useState(getHeroRevealMode);
  useHeroReveal(introRef, heroRevealMode);

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

  useEffect(() => {
    const dockCleanups = [];
    const ctx = gsap.context(() => {
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

      dockCleanups.push(dockCards(gsap.utils.toArray(".capability-card")));

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

      dockCleanups.push(
        dockCards(gsap.utils.toArray(".contact-anim"), { start: "top 90%", end: "bottom 5%" }),
        dockCards(gsap.utils.toArray(".ethos-card"), { start: "top 90%" })
      );

      ScrollTrigger.refresh();
    }, containerRef);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);

      if (isManualNavigating.current) return;

      const sections = containerRef.current?.querySelectorAll("section[id]");
      if (!sections || sections.length === 0) return;

      const scrollPosition = window.scrollY + 140;

      let currentSectionId = "";
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.id;
        }
      });

      if (window.scrollY < 200) {
        currentSectionId = "intro";
      }
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
      <Suspense fallback={null}>
        <SceneCanvas />
      </Suspense>

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
              <RollText text="CV" /> <ArrowUpRight size={13} className="text-text-tertiary" />
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

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
        onNavigate={(id) => handleNavClick(null, id)}
      />

      <main className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 divide-y divide-border border-x border-border/40">

        <section
          id="intro"
          ref={introRef}
          className={`relative pt-14 pb-20 sm:pt-20 sm:pb-24 space-y-10 scroll-mt-20 ${heroRevealMode === "animate" ? "hero-await" : ""}`}
        >
          <div className="space-y-6 max-w-4xl">
            <div className="hero-anim flex items-center gap-2">
              <span className="mono-label text-emerald-600 dark:text-emerald-400 font-semibold">Available for Work</span>
            </div>

            <h1 className="hero-anim font-display font-normal text-5xl sm:text-7xl lg:text-8xl tracking-[-0.015em] text-text-primary leading-[1.02] [text-wrap:balance]">
              {["Hi", "there,"].map((w) => (
                <span key={w} className="hero-word inline-block mr-[0.22em]">{w}</span>
              ))}
              <span className="hero-word inline-block mr-[0.22em] italic">welcome</span>
              {["to", "my", "page!"].map((w, i, arr) => (
                <span key={w} className={`hero-word inline-block ${i < arr.length - 1 ? "mr-[0.22em]" : ""}`}>{w}</span>
              ))}
            </h1>

            <p className="hero-anim hero-support text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl font-normal">
              I'm <span className="font-semibold text-text-primary">Donvictory</span>, a software developer building user-first products that are fast, secure, and precise in both logic and design. I work with JavaScript, React, and Next.js on the frontend, and build automated workflows that power reliable backend systems.
            </p>
          </div>

          <div className="hero-anim hero-support flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#works"
              onClick={(e) => handleNavClick(e, "works")}
              className="btn-minimal-primary"
            >
              <RollText text="View Projects" mode="letters" /> <ArrowDown size={14} />
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-minimal-secondary"
            >
              <RollText text="Read Resume / CV" mode="letters" /> <ArrowUpRight size={14} />
            </a>
            <button
              onClick={copyEmail}
              className="btn-minimal-secondary"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" /> <RollText text="Copied Email" />
                </>
              ) : (
                <>
                  <Copy size={14} /> <RollText text="Copy Email" />
                </>
              )}
            </button>
          </div>
        </section>

        <SelectedWorks
          projects={projects}
          onSelectProject={setSelectedProject}
        />

        <section id="expertise" className="py-10 sm:py-16 space-y-12 scroll-mt-20">
          <div className="expertise-header-anim space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Engineering Disciplines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                idx: "01",
                title: "System Design & Architecture",
                desc: "Planning how software systems should be structured, how their different parts work together, and how they can grow without becoming difficult to maintain.",
                label: "Areas of focus",
                stack: ["System Design", "Software Architecture", "Scalability", "Modular Design", "Data Modelling"],
              },
              {
                idx: "02",
                title: "Frontend Development",
                desc: "Building responsive and accessible interfaces with reusable components, smooth interactions, and a focus on performance and user experience.",
                label: "Technologies",
                stack: ["React 19", "Next.js", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Zustand", "Component Design", "WCAG AA"],
              },
              {
                idx: "03",
                title: "Backend Development",
                desc: "Building APIs, server-side applications, and databases that handle application data, business logic, authentication, and communication between systems.",
                label: "Technologies",
                stack: ["Node.js", "Express.js", "PostgreSQL", "REST APIs", "Database Design", "API Security"],
              },
              {
                idx: "04",
                title: "AI-Assisted Backend Development",
                desc: "Using AI tools to plan and build backend systems, set up databases, create APIs, fix bugs, and test implementations while understanding how everything works behind the scenes.",
                label: "Areas of focus",
                stack: ["AI-Assisted Development", "Backend Setup", "API Development", "Database Configuration", "AI Pair Programming", "Debugging & Testing"],
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

                <div className="space-y-2 pt-2">
                  <span className="mono-label text-[10px]">{item.label}</span>
                  <div className="flex flex-wrap gap-1.5">
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
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="py-16 sm:py-24 space-y-12 scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="about-anim md:col-span-4 space-y-3">
              <div className="aspect-square w-full max-w-[280px] mx-auto md:mx-0 rounded-full overflow-hidden bg-surface-subtle shadow-sm">
                <img
                  src="/projects/about-pic.jpeg"
                  alt="Donvictory Adewumi"
                  className="w-full h-full object-cover grayscale contrast-105"
                />
              </div>
            </div>

            <div className="about-anim md:col-span-8 space-y-6">
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  A Little About Me
                </h2>
              </div>

              <div className="space-y-4 text-text-secondary text-sm sm:text-base leading-relaxed">
                <p>
                  I got into programming through a passion for decentralized technology and digital infrastructure. The deeper I went into software, the more I realized that the best products are the ones that truly understand the people using them.
                </p>
                <p>
                  Before building software full-time, I worked as a customer experience agent. Being on the other side of the product, hearing what frustrated users and what made them stay, shaped how I build today. I approach every product from a user-first perspective.
                </p>
                <p>
                  I design thoughtful, intuitive interfaces that never leave users wondering what to do next, and I make sure everything behind them is fully optimized for performance. To me, a great product feels effortless to use and is fast and reliable under the hood.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text-primary">Beyond the code</h3>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  When I'm not writing code or building products, you'll find me playing the bass guitar, playing sports, or at the gym.
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

        <section id="connect" className="py-16 sm:py-24 space-y-12 scroll-mt-20">
          <div className="connect-header-anim space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Let's Build Something Together
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Available for full-time frontend/full-stack engineering positions, contract builds, and technical collaborations. Reach out directly via email, WhatsApp, or socials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
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
                      <Check size={13} className="text-emerald-400" /> <RollText text="Copied!" />
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> <RollText text="Copy Email" />
                    </>
                  )}
                </button>
                <a
                  href="mailto:donvictoryadewumi4@gmail.com"
                  className="btn-minimal-secondary !text-xs !py-2 !rounded-[4px] flex-1 justify-center"
                >
                  <RollText text="Send Email" mode="letters" /> <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

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
                  <MessageCircle size={13} /> <RollText text="Chat on WhatsApp" mode="letters" />
                </a>
                <button
                  onClick={copyPhone}
                  className="btn-minimal-secondary !text-xs !py-2 !rounded-[4px] flex-1 justify-center"
                >
                  {phoneCopied ? (
                    <>
                      <Check size={13} className="text-emerald-400" /> <RollText text="Copied" />
                    </>
                  ) : (
                    <>
                      <Phone size={13} /> <RollText text="Copy Number" />
                    </>
                  )}
                </button>
              </div>
            </div>

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

        <footer className="py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-tertiary">
          <div>
            © {new Date().getFullYear()} Donvictory Adewumi. All rights reserved.
          </div>
        </footer>
      </main>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

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
