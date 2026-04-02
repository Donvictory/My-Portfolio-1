import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Zap,
  Briefcase,
  User,
  Mail,
  Github,
  Linkedin,
  Twitter,
  X,
  FileDown,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, activeSection }) => {
  const navItems = [
    { id: "intro", label: "Home", icon: Home },
    { id: "expertise", label: "Expertise", icon: Zap },
    { id: "approach", label: "Method", icon: Briefcase },
    { id: "experience", label: "Experience", icon: FileDown },
    { id: "works", label: "Projects", icon: Briefcase },
    { id: "about", label: "About Me", icon: User },
    { id: "connect", label: "Contact", icon: Mail },
  ];

  const socialItems = [
    { icon: Github, href: "https://github.com/Donvictory", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/oluwasegun-donvictory-b27a87221?trk=contact-info",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/don_of_victory",
      label: "Twitter",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-portfolio-bg/80 backdrop-blur-3xl"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-glass-border p-10 lg:p-14 flex flex-col justify-between overflow-y-auto"
          >
            <div className="absolute inset-0 grain-overlay opacity-[0.02] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-16">
                <div className="text-xl font-black font-display text-accent tracking-tighter">
                  DA.
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-glass-bg text-dim hover:text-cream hover:bg-glass-border transition-all border border-glass-border"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-12">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase opacity-50 pl-2">
                    Navigation
                  </span>
                  <nav className="flex flex-col gap-3">
                    {navItems.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={onClose}
                          className={`group text-3xl lg:text-4xl font-bold font-display transition-all duration-300 flex items-center gap-6 p-2 rounded-2xl ${
                            isActive
                              ? "text-accent"
                              : "text-dim/60 hover:text-cream hover:bg-glass-bg"
                          }`}
                        >
                          <span className="text-[10px] font-mono text-dim/40">
                            0{navItems.indexOf(item) + 1}
                          </span>
                          {item.label}
                        </a>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-8 border-t border-glass-border">
                  <a
                    href="/cv.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-dim hover:text-accent transition-colors font-bold tracking-[0.1em] uppercase text-[10px] border border-glass-border p-3 rounded-2xl align-center justify-center"
                  >
                    <FileDown size={16} /> Download Curriculum Vitae
                  </a>
                </div>
              </div>

              <div className="pt-12 border-t border-glass-border space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold tracking-[0.4em] text-dim uppercase">
                    Connection
                  </p>
                  <div className="flex gap-4">
                    {socialItems.map((social, idx) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={idx}
                          href={social.href}
                          className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center text-dim hover:text-accent hover:bg-glass-border transition-all duration-300 border border-glass-border"
                          aria-label={social.label}
                        >
                          <Icon size={18} />
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-accent/10 border border-accent/10 flex items-center justify-center font-black text-accent text-lg">
                    DA
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] text-cream font-bold uppercase tracking-widest leading-loose">
                      Donvictory Adewumi
                    </p>
                    <span className="text-[9px] font-medium text-dim/60 capitalize tracking-normal italic">
                      Lagos, Nigeria
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
