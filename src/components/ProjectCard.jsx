import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

const ProjectCard = ({ project, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="group relative glass-card p-0"
    >
      {/* Project Image Preview with limited overflow */}
      <div className="relative h-64 w-full overflow-hidden rounded-t-[2rem] bg-stone-900 border-b border-white/5">
        <motion.img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-portfolio-bg/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="relative z-10 p-8 flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[8px] font-bold tracking-[0.2em] text-accent bg-accent/5 py-1.5 px-3 rounded-lg uppercase border border-accent/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold font-display text-cream leading-tight">
            {project.title}
          </h3>
          <p className="text-stone-500 text-sm leading-relaxed group-hover:text-stone-400 transition-colors">
            {project.desc}
          </p>
        </div>

        {/* Action Footer - ALWAYS VISIBLE */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex flex-row gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-accent text-portfolio-bg text-[10px] font-black uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-accent/5"
              >
                <ExternalLink size={14} /> Live
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-stone-300 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white hover:scale-[1.02] transition-all duration-300"
              >
                <Github size={14} /> GitHub
              </a>
            )}
          </div>

          <button
            onClick={() => onClick(project)}
            className="w-full flex items-center justify-center gap-2 py-2 text-[9px] font-bold tracking-[0.4em] text-stone-600 hover:text-accent transition-all uppercase group"
          >
            Insights{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
