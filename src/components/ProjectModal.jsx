import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Github } from "lucide-react";

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-surface border-none rounded-[4px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-surface-subtle">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-text-secondary">{project.title}</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-[4px] text-text-secondary hover:text-text-primary hover:bg-surface transition-all"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto w-full p-6 sm:p-8 space-y-8">
              {/* Media Preview */}
              <div className="w-full aspect-[16/9] overflow-hidden rounded-[4px] bg-surface-subtle relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-[4px] bg-surface-subtle text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2
                  id="modal-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary"
                >
                  {project.title}
                </h2>
              </div>

              {/* Description & Impact */}
              <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
                <div className="space-y-2">
                  <h4 className="mono-label">Overview</h4>
                  <p className="text-text-primary text-base leading-relaxed">
                    {project.desc}
                  </p>
                </div>
              </div>

              {/* Direct Links */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-minimal-primary"
                    >
                      Launch Live Product <ArrowUpRight size={14} />
                    </a>
                  )}
                  {project.code && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-minimal-secondary"
                    >
                      <Github size={14} /> GitHub Repository
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
