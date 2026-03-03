import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Menu,
  ChevronRight,
  FileDown,
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  Send,
  MapPin,
  Twitter,
  MessageCircle,
  Terminal,
} from "lucide-react";
import "./index.css";
import { projects } from "./data";
import Sidebar from "./components/Sidebar";
import ProjectCard from "./components/ProjectCard";
import ProjectModal from "./components/ProjectModal";

const TypewriterText = ({ text, delay = 0, onComplete, className }) => {
  const words = text.split(" ");

  let globalCharIndex = 0;
  const wordData = words.map((word, i) => {
    const letters = Array.from(word).map((char) => ({
      char,
      index: globalCharIndex++,
    }));
    const spaceIndex = i < words.length - 1 ? globalCharIndex++ : null;
    return { letters, spaceIndex };
  });

  const totalChars = globalCharIndex;

  const child = {
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        delay: delay + i * 0.03,
      },
    }),
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <span className={className}>
      {wordData.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.letters.map((l, letterIdx) => (
            <motion.span
              key={letterIdx}
              custom={l.index}
              variants={child}
              initial="hidden"
              animate="visible"
              onAnimationComplete={
                l.index === totalChars - 1 ? onComplete : undefined
              }
              className="inline-block"
            >
              {l.char}
            </motion.span>
          ))}
          {word.spaceIndex !== null && (
            <motion.span
              key="space"
              custom={word.spaceIndex}
              variants={child}
              initial="hidden"
              animate="visible"
              onAnimationComplete={
                word.spaceIndex === totalChars - 1 ? onComplete : undefined
              }
              className="inline-block"
            >
              {"\u00A0"}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("intro");
  const [showHeroButtons, setShowHeroButtons] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const filteredProjects = projects.filter((p) =>
    filter === "all" ? true : p.tags.includes(filter),
  );

  const sectionRefs = {
    intro: useRef(null),
    expertise: useRef(null),
    works: useRef(null),
    about: useRef(null),
    connect: useRef(null),
  };

  const navItems = [
    { id: "intro", label: "Home" },
    { id: "expertise", label: "Expertise" },
    { id: "works", label: "Projects" },
    { id: "about", label: "About Me" },
    { id: "connect", label: "Contact" },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -30% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 20 },
    },
  };

  return (
    <div className="bg-portfolio-bg min-h-screen selection:bg-accent/30 selection:text-white relative font-sans">
      <div className="fixed inset-0 grain-overlay z-[100]" />
      <div className="cinematic-glow" />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[110] origin-left"
        style={{ scaleX }}
      />

      {/* Modern Top Nav */}
      <nav className="fixed top-0 w-full p-6 lg:px-12 lg:py-8 flex justify-between items-center z-50">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black font-display tracking-tighter text-accent"
        >
          DA.
        </motion.h2>

        {/* Desktop Nav Contents */}
        <div className="hidden lg:flex items-center gap-10 bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:text-accent ${
                activeSection === item.id ? "text-accent" : "text-stone-500"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/resume.pdf"
            download
            className="hidden lg:flex btn-human btn-human-secondary py-2 px-6 !text-[9px]"
          >
            CV <FileDown size={14} className="ml-2" />
          </a>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden group flex items-center gap-3 py-2.5 px-5 rounded-2xl bg-white/5 border border-white/10 text-stone-400 hover:text-white transition-all backdrop-blur-md"
          >
            <Menu size={20} />
          </motion.button>
        </div>
      </nav>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
      />

      <main className="max-w-6xl mx-auto px-6 lg:px-0">
        {/* HERO SECTION */}
        <section
          id="intro"
          ref={sectionRefs.intro}
          className="min-h-screen flex flex-col justify-center items-center text-center relative pt-24 lg:pt-0"
        >
          <div className="space-y-8 max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent font-bold text-[9px] uppercase tracking-[0.3em] backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
              </span>
              Frontend Engineer & Designer
            </motion.div>

            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black font-display leading-[1.1] text-cream">
              <TypewriterText text="Hello, I'm" className="block" delay={0.2} />
              <TypewriterText
                text="Donvictory Adewumi."
                delay={0.8}
                className="gradient-text italic block mt-4"
              />
            </h1>

            <div className="max-w-lg mx-auto pb-6">
              <TypewriterText
                text="I build scalable web products that solve real problems, transforming ideas into systems people can rely on."
                delay={2.0}
                onComplete={() => setShowHeroButtons(true)}
                className="block text-base lg:text-lg text-stone-400 font-medium leading-relaxed italic opacity-80"
              />
            </div>

            <div className="min-h-[80px]">
              <AnimatePresence>
                {showHeroButtons && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="flex flex-wrap justify-center gap-4 pt-4"
                  >
                    <a
                      href="#works"
                      className="btn-human btn-human-primary min-w-[170px]"
                    >
                      Projects <ChevronRight size={16} />
                    </a>
                    <a
                      href="/resume.pdf"
                      download
                      className="btn-human btn-human-secondary min-w-[170px]"
                    >
                      Resume <FileDown size={16} />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showHeroButtons ? 1 : 0 }}
            className="absolute bottom-10 flex flex-col items-center gap-3 text-stone-700 pointer-events-none"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold">
              Begin Journey
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <ArrowDown size={16} />
            </motion.div>
          </motion.div>
        </section>

        {/* EXPERTISE */}
        <section id="expertise" ref={sectionRefs.expertise} className="py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-20"
          >
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase opacity-60">
                The Toolkit
              </h2>
              <h3 className="text-4xl lg:text-6xl font-bold font-display text-cream">
                Expertise.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Frontend Development",
                  desc: "• React & modern UI architecture\n• Scalable, reusable components\n• Clean, responsive interfaces",
                  icon: "🖥",
                },
                {
                  title: "API Integration",
                  desc: "• Connecting UI to real data\n• REST APIs, fetch & Axios\n• Structured data flow handling",
                  icon: "🔗",
                },
                {
                  title: "Deployment & Workflow",
                  desc: "• Vercel & production builds\n• Git-based version control\n• Debugging beyond localhost",
                  icon: "🚀",
                },
                {
                  title: "Product & System Thinking",
                  desc: "• User-focused system design\n• Clear workflows & structure\n• Built for real-world impact",
                  icon: "🧠",
                },
              ].map((box, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass-card group p-10"
                >
                  <div
                    className="text-4xl mb-6 opacity-30 group-hover:opacity-100 transition-all duration-500 animate-float-subtle"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    {box.icon}
                  </div>
                  <h4 className="text-xl font-bold font-display text-cream mb-4">
                    {box.title}
                  </h4>
                  <div className="text-stone-500 text-sm leading-relaxed whitespace-pre-line group-hover:text-stone-400 transition-colors">
                    {box.desc}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                "React",
                "JavaScript",
                "Tailwind",
                "Motion",
                "TypeScript",
                "Node.js",
                "Git",
                "Figma",
              ].map((skill, i) => (
                <motion.span
                  key={skill}
                  variants={itemVariants}
                  className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-stone-500 font-bold text-xs hover:border-accent/40 hover:text-accent transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PROJECTS */}
        <section id="works" ref={sectionRefs.works} className="py-32">
          <div className="space-y-20">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase opacity-60">
                  Curated Work
                </h2>
                <h3 className="text-4xl lg:text-6xl font-bold font-display text-cream">
                  Projects.
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                {["all", "react", "javascript"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${
                      filter === f
                        ? "bg-accent text-portfolio-bg shadow-lg"
                        : "text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    {f === "javascript" ? "JS" : f}
                  </button>
                ))}
              </div>
            </div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={setSelectedProject}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" ref={sectionRefs.about} className="py-20 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl">
                <div className="absolute inset-0 bg-accent/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img
                  src="/profile.jpg"
                  alt="Donvictory Adewumi"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-portfolio-bg/80 via-transparent to-transparent z-20" />
              </div>
            </motion.div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase opacity-60">
                    The Journey
                  </h2>
                  <h3 className="text-5xl lg:text-7xl font-bold font-display text-cream leading-[0.9] tracking-tighter">
                    Behind the <br />{" "}
                    <span className="italic gradient-text">Builder.</span>
                  </h3>
                </div>

                {/* Academic Context - Integrated */}
                <div className="flex items-center gap-6 p-1">
                  <div className="h-px w-12 bg-accent/30" />
                  <div className="flex flex-col">
                    <span className="text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Background
                    </span>
                    <span className="text-cream font-display font-medium">
                      Mathematics Graduate, University of Lagos '25
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8 text-lg lg:text-xl text-stone-400 font-medium leading-[1.8]"
              >
                <div className="space-y-6 relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 to-transparent" />
                  <p>
                    I dove into the tech space aiming to become a blockchain
                    developer, driven by my passion for crypto. I wanted to be
                    more than just a node operator – I wanted to be a builder.
                  </p>
                  <p>
                    Along the way, I picked up front-end development, and it's
                    been a great journey! I started with the basics –{" "}
                    <span className="text-cream">
                      HTML, CSS, and JavaScript
                    </span>{" "}
                    – then moved on to{" "}
                    <span className="text-accent underline underline-offset-8 decoration-accent/30 font-display italic">
                      React and Tailwind CSS.
                    </span>
                  </p>
                  <p className="text-stone-300">
                    The learning never stops, and I'm excited to keep improving.
                    My goal is to create innovative, scalable solutions that
                    solve real problems.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-stone-500 font-bold text-[10px] uppercase tracking-widest">
                  Blockchain Enthusiast
                </div>
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-stone-500 font-bold text-[10px] uppercase tracking-widest">
                  Frontend Engineer
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="connect"
          ref={sectionRefs.connect}
          className="py-40 relative"
        >
          <div className="glass-card !p-12 lg:!p-24 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase opacity-60">
                    Get in Touch
                  </h2>
                  <h3 className="text-5xl lg:text-8xl font-black font-display text-cream leading-[0.85] tracking-tight">
                    Let's Build <br />
                    <span className="gradient-text italic">Together.</span>
                  </h3>
                </div>

                <p className="text-stone-500 text-lg lg:text-xl font-medium leading-relaxed max-w-md">
                  I'm currently available for new projects and collaborations.
                  If you have any idea, let's make it a reality.
                </p>

                <div className="flex flex-col gap-4">
                  <a
                    href="mailto:donvictoryadewumi4@gmail.com"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-500 group-hover:text-accent group-hover:border-accent/30 transition-all">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-700 font-bold">
                        Email Me
                      </p>
                      <p className="text-cream font-bold group-hover:text-accent transition-colors">
                        donvictoryadewumi4@gmail.com
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-700 font-bold">
                        Location
                      </p>
                      <p className="text-cream font-bold">Lagos, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 lg:pl-12 lg:border-l border-white/5">
                <p className="text-stone-400 font-medium italic">
                  Available for collaborations that prioritize quality, empathy,
                  and structural clarity.
                </p>

                <div className="flex flex-col gap-4">
                  <a
                    href="https://twitter.com/yourhandle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 rounded-[2rem] bg-accent/10 border border-accent/20 hover:bg-accent hover:text-portfolio-bg transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Twitter
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="font-black uppercase tracking-widest text-[11px]">
                        Connect on X
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="opacity-40 group-hover:opacity-100"
                    />
                  </a>

                  <a
                    href="https://wa.me/2348136344061"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <MessageCircle
                        size={20}
                        className="text-[#25D366] group-hover:scale-110 transition-transform"
                      />
                      <span className="font-bold uppercase tracking-widest text-[11px] text-stone-300 group-hover:text-cream transition-colors">
                        Message WhatsApp
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="opacity-40 group-hover:opacity-100"
                    />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <a
                    href="https://linkedin.com/in/donvictoryadewumi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
                  >
                    <Linkedin
                      size={18}
                      className="text-stone-500 group-hover:text-[#0077B5] transition-colors"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
                      LinkedIn
                    </span>
                  </a>
                  <a
                    href="https://github.com/Donvictory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
                  >
                    <Github
                      size={18}
                      className="text-stone-500 group-hover:text-white transition-colors"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
                      GitHub
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-24 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="text-3xl font-black font-display tracking-tighter text-accent">
                DA.
              </div>
              <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
                Engineering digital products with mathematical precision and
                human empathy. Based in Lagos, available worldwide.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com/in/donvictoryadewumi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-500 hover:text-accent hover:border-accent/30 transition-all"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://github.com/Donvictory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-500 hover:text-white hover:border-white/20 transition-all"
                >
                  <Github size={18} />
                </a>
                <a
                  href="mailto:donvictoryadewumi4@gmail.com"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-500 hover:text-accent hover:border-accent/30 transition-all"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-700">
                Platform
              </h4>
              <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-xs font-medium text-stone-500 hover:text-accent transition-colors w-fit"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-700">
                Status
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="text-xs font-bold text-cream uppercase tracking-widest">
                    Available for Hire
                  </span>
                </div>
                <p className="text-stone-600 text-[10px] leading-relaxed uppercase tracking-wider font-bold">
                  Currently accepting new <br /> collaborations for 2025.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[9px] font-bold tracking-[0.4em] text-stone-800 uppercase">
              © 2025 Donvictory Adewumi • All Rights Reserved
            </div>
            <div className="text-[9px] font-bold tracking-[0.4em] text-stone-800 uppercase flex gap-6">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Lagos, NG</span>
            </div>
          </div>
        </footer>
      </main>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export default App;
