import React from "react";
import { ArrowUpRight, Github, TrendingUp, ExternalLink, ArrowRight } from "lucide-react";

const ProjectCard = ({ project, onClick }) => {
  return (
    <article
      className="project-card minimal-card flex flex-col justify-between overflow-hidden group cursor-pointer transition-all duration-300"
      onClick={() => onClick(project)}
    >
      {/* Browser Showcase Header & Media */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-subtle border-b border-border">
        {/* Faux Browser Chrome */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-400/70" />
            <span className="w-2 h-2 rounded-full bg-amber-400/70" />
            <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
            <span className="text-[10px] font-mono text-text-tertiary ml-1.5 font-medium">
              {project.title.toLowerCase().replace(/[^a-z0-9]/g, "")}.io
            </span>
          </div>

          {project.role && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium text-text-secondary bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-border">
              {project.role}
            </span>
          )}
        </div>

        {/* Project Thumbnail */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Ambient Gradient on Image Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between gap-6">
        <div className="space-y-4">
          {/* Title & Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary group-hover:text-text-primary transition-colors">
                {project.title}
              </h3>
              <ArrowUpRight
                size={18}
                className="text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
              />
            </div>
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 font-normal">
              {project.desc}
            </p>
          </div>

          {/* Measurable Impact Highlight */}
          {project.impact && (
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border text-xs text-text-secondary leading-relaxed flex items-start gap-2.5">
              <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-text-primary font-semibold">Key Result: </strong>
                {project.impact}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div
          className="pt-5 border-t border-border flex items-center justify-between gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2.5">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-minimal-primary !py-2 !px-3.5 !text-xs"
                aria-label={`Open live site for ${project.title}`}
              >
                Live Preview <ExternalLink size={12} />
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-minimal-secondary !py-2 !px-3.5 !text-xs"
                aria-label={`View code repository for ${project.title}`}
              >
                <Github size={13} /> Code
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => onClick(project)}
            className="text-xs font-mono font-medium text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1 group/btn"
          >
            Details{" "}
            <ArrowRight
              size={12}
              className="group-hover/btn:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
