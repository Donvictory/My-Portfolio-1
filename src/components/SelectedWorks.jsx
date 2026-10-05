import React, { useState } from "react";
import {
  ArrowUpRight,
  Github,
  TrendingUp,
  LayoutGrid,
  List,
} from "lucide-react";
import ProjectCard from "./ProjectCard";

const SelectedWorks = ({ projects, onSelectProject }) => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [filter, setFilter] = useState("all");

  const filteredProjects = projects.filter((p) =>
    filter === "all" ? true : p.tags.includes(filter)
  );

  return (
    <section id="works" className="py-20 sm:py-28 space-y-12">
      {/* Section Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1.5">
          <span className="mono-label">Portfolio Index</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Selected Works
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Production web platforms, client solutions, and open-source software.
          </p>
        </div>

        {/* View Switcher & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-subtle border border-border">
            {[
              { id: "all", label: "All Works" },
              { id: "react", label: "React" },
              { id: "next.js", label: "Next.js" },
              { id: "javascript", label: "JavaScript" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === f.id
                    ? "bg-surface text-text-primary font-semibold shadow-xs border border-border"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-subtle border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-surface text-text-primary font-semibold shadow-xs border border-border"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline-block text-[11px]">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-surface text-text-primary font-semibold shadow-xs border border-border"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Index Table View"
              aria-label="Index Table View"
            >
              <List size={14} />
              <span className="hidden sm:inline-block text-[11px]">Index</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 1. BALANCED 2x2 GRID VIEW */}
      {/* ========================================================== */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={onSelectProject}
            />
          ))}
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. TABLE / INDEX VIEW (EDITORIAL MASTER LEDGER) */}
      {/* ========================================================== */}
      {viewMode === "table" && (
        <div className="minimal-card overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-text-tertiary font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-medium">Index</th>
                  <th className="py-3.5 px-5 font-medium">Project</th>
                  <th className="py-3.5 px-5 font-medium hidden md:table-cell">Role</th>
                  <th className="py-3.5 px-5 font-medium hidden lg:table-cell">Key Result</th>
                  <th className="py-3.5 px-5 font-medium hidden sm:table-cell">Tech Stack</th>
                  <th className="py-3.5 px-5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.map((project, idx) => (
                  <tr
                    key={project.id}
                    className="hover:bg-surface-subtle transition-colors cursor-pointer group"
                    onClick={() => onSelectProject(project)}
                  >
                    <td className="py-4 px-5 font-mono text-text-tertiary">
                      0{idx + 1}
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-text-primary group-hover:text-text-primary flex items-center gap-1.5">
                          {project.title}
                          <ArrowUpRight size={13} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-text-secondary line-clamp-1 max-w-xs md:hidden">
                          {project.desc}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-text-secondary font-medium hidden md:table-cell">
                      {project.role}
                    </td>
                    <td className="py-4 px-5 text-text-secondary hidden lg:table-cell max-w-sm">
                      <div className="flex items-start gap-1.5 text-[11px] line-clamp-2">
                        <TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{project.impact}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-surface border border-border text-text-tertiary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td
                      className="py-4 px-5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-minimal-primary !py-1 !px-2.5 !text-[11px]"
                            aria-label={`Open live site for ${project.title}`}
                          >
                            Live <ArrowUpRight size={11} />
                          </a>
                        )}
                        {project.code && (
                          <a
                            href={project.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
                            aria-label={`View code for ${project.title}`}
                          >
                            <Github size={13} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default SelectedWorks;
