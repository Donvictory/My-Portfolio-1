import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Linkedin, Twitter, FileDown } from "lucide-react";

const Sidebar = ({ isOpen, onClose, activeSection, onNavigate }) => {
  const navItems = [
    { id: "intro", label: "Home" },
    { id: "works", label: "Projects" },
    { id: "expertise", label: "Discipline" },
    { id: "about", label: "About" },
    { id: "connect", label: "Contact" },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        document.body.style.overflow = "auto";
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    document.body.style.overflow = "auto";
    onClose();

    setTimeout(() => {
      if (onNavigate) {
        onNavigate(id);
      } else {
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
      }
    }, 350);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[140] overflow-hidden lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              document.body.style.overflow = "auto";
              onClose();
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-surface border-l border-border p-6 flex flex-col justify-between"
          >
            <div className="space-y-8">
              <div className="flex justify-between items-center pb-0 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-text-primary tracking-wider">
                    DONVICTORY ADEWUMI
                  </span>
                </div>
                <button
                  onClick={() => {
                    document.body.style.overflow = "auto";
                    onClose();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-[4px] text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-all border border-border"
                  aria-label="Close navigation"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-[4px] text-sm transition-all ${isActive
                        ? "bg-surface-subtle text-text-primary font-semibold shadow-xs border border-border/80"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle/50"
                        }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4 pt-2 border-t border-border">
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-minimal-secondary w-full text-xs"
              >
                <FileDown size={14} /> Resume (CV)
              </a>

              <div className="flex items-center justify-between">
                <span className="mono-label text-[10px]">Socials</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/Donvictory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-text-primary"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </a>
                  <a
                    href="https://linkedin.com/in/oluwasegun-donvictory-b27a87221"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-text-primary"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href="https://twitter.com/don_of_victory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-text-primary"
                    aria-label="Twitter"
                  >
                    <Twitter size={16} />
                  </a>
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
