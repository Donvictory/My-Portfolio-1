import React from "react";
import { ArrowUpRight, Github, TrendingUp, ExternalLink, ArrowRight } from "lucide-react";

const ProjectCard = ({ project, onClick }) => {
  return (
    <article
      className="project-card minimal-card flex flex-col justify-between overflow-hidden group cursor-pointer"
      onClick={() => onClick(project)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-subtle">

        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between gap-6">
        <div className="space-y-4">
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
        </div>

        <div
          className="pt-2 flex items-center justify-between gap-3"
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
