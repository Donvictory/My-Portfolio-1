import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Terminal } from "lucide-react";

const ProjectModal = ({ project, onClose }) => {
  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-portfolio-bg/90 backdrop-blur-2xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl bg-surface border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="absolute inset-0 grain-overlay opacity-[0.02] pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-stone-200 hover:text-white hover:bg-white/20 transition-all z-20 group border border-white/10"
            >
              <X
                size={20}
                className="group-hover:rotate-90 transition-transform duration-500"
              />
            </button>

            <div className="overflow-y-auto w-full">
              {/* Feature Image Header */}
              <div className="w-full h-80 lg:h-[450px] overflow-hidden relative border-b border-white/5 bg-stone-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-portfolio-bg/40" />
                <div className="absolute bottom-0 left-0 p-8 lg:p-14 w-full bg-gradient-to-t from-portfolio-bg to-transparent">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] text-accent uppercase bg-accent/10 backdrop-blur-md py-1 px-4 rounded-full border border-accent/20"
                      >
                        <Terminal size={12} /> {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold font-display text-cream leading-tight tracking-tight">
                    {project.title}
                  </h2>
                </div>
              </div>

              <div className="p-8 lg:p-14 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-stone-600 font-bold uppercase tracking-[0.3em] text-[9px]">
                        The Narrative
                      </h4>
                      <p className="text-stone-400 text-lg lg:text-xl leading-relaxed italic font-medium">
                        "{project.desc}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-stone-600 font-bold uppercase tracking-[0.3em] text-[9px]">
                        Direct Access
                      </h4>
                      <div className="flex flex-col gap-3">
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-human btn-human-primary w-full py-4 text-xs font-bold"
                          >
                            Launch Demo <ExternalLink size={16} />
                          </a>
                        )}
                        {project.code && (
                          <a
                            href={project.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-human btn-human-secondary w-full py-4 text-xs font-bold"
                          >
                            View Repository <Github size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-14 py-8 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[9px] font-bold tracking-[0.4em] text-stone-700 uppercase">
                <span>Selected Works // 2025</span>
                <span className="text-accent/20 italic">Prop. DV Adewumi</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
