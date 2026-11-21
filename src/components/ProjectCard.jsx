import React from "react";
import { ArrowUpRight, Github, ExternalLink, ArrowRight } from "lucide-react";
import RollText from "./RollText";

const TAG_LABELS = {
  "next.js": "Next.js",
  react: "React",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tailwind: "Tailwind",
  "framer-motion": "Framer Motion",
  firebase: "Firebase",
  supabase: "Supabase",
  html: "HTML",
  ai: "AI",
  web: "Web",
  utility: "Utility",
};

const ProjectCard = ({ project, onClick }) => {
  const tags = project.tags.slice(0, 4);

  return (
    <article
      className="project-card minimal-card flex flex-col overflow-hidden group cursor-pointer"
      onClick={() => onClick(project)}
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-surface-subtle border-b border-border">
        <img
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between gap-6">
        <div className="space-y-3">
          {project.role && (
            <div className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
              {project.role}
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-3xl sm:text-[2.1rem] leading-[1.05] text-text-primary">
              {project.title}
            </h3>
            <ArrowUpRight
              size={20}
              className="mt-1 text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
            />
          </div>


          <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] px-2 py-0.5 rounded-[4px] bg-surface-subtle text-text-secondary"
              >
                {TAG_LABELS[t] ?? t}
              </span>
            ))}
          </div>
        </div>

        <div
          className="pt-4 border-t border-border flex items-center justify-between gap-3"
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
                <RollText text="Live Preview" /> <ExternalLink size={12} />
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
                <Github size={13} /> <RollText text="Code" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => onClick(project)}
            className="text-xs font-mono font-medium text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1 group/btn"
          >
            <RollText text="Details" />
            <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
