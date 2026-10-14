import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Github,
  LayoutGrid,
  List,
} from "lucide-react";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const SelectedWorks = ({ projects, onSelectProject }) => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [filter, setFilter] = useState("all");
  const worksRef = useRef(null);

  const filteredProjects = projects.filter((p) =>
    filter === "all" ? true : p.tags.includes(filter)
  );

  // Observe section height shifts (e.g. Grid <-> Table, tag filters) so all
  // subsequent section triggers on the page immediately recalibrate their scroll positions
  useEffect(() => {
    if (!worksRef.current) return;

    let rafId = null;
    const observer = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    observer.observe(worksRef.current);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.set(".works-header-anim", { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: "#works",
        start: "top 88%",
        end: "bottom 5%",
        onEnter: () =>
          gsap.to(".works-header-anim", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          }),
        onLeave: () =>
          gsap.to(".works-header-anim", {
            opacity: 0,
            y: -20,
            duration: 0.35,
            ease: "power2.in",
            overwrite: "auto",
          }),
        onEnterBack: () =>
          gsap.to(".works-header-anim", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          }),
        onLeaveBack: () =>
          gsap.to(".works-header-anim", {
            opacity: 0,
            y: 20,
            duration: 0.35,
            ease: "power2.in",
            overwrite: "auto",
          }),
      });

      // Cards or Table reveal
      const targets =
        viewMode === "grid" ? ".project-card" : ".works-table-anim";
      const elements = gsap.utils.toArray(targets);

      if (elements.length > 0) {
        gsap.set(elements, { opacity: 0, y: 24 });
        ScrollTrigger.batch(elements, {
          start: "top 88%",
          end: "bottom 8%",
          interval: 0.08,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeave: (batch) =>
            gsap.to(batch, {
              opacity: 0,
              y: -20,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
          onEnterBack: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power2.out",
              overwrite: "auto",
            }),
          onLeaveBack: (batch) =>
            gsap.to(batch, {
              opacity: 0,
              y: 24,
              duration: 0.35,
              ease: "power2.in",
              overwrite: "auto",
            }),
        });
      }
    }, worksRef);

    // Promptly recalculate all trigger coordinates across the page
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      ctx.revert();
    };
  }, [viewMode, filter]);

  return (
    <section ref={worksRef} id="works" className="py-12 sm:py-16 space-y-10 scroll-mt-20">
      {/* Section Header with Controls */}
      <div className="works-header-anim flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Projects
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Production web platforms, client solutions, and open-source software.
          </p>
        </div>

        {/* View Switcher & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1 p-1 rounded-[4px] bg-surface-subtle border border-border">
            {[
              { id: "all", label: "All Works" },
              { id: "react", label: "React" },
              { id: "next.js", label: "Next.js" },
              { id: "javascript", label: "JavaScript" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-colors ${filter === f.id
                  ? "bg-surface text-text-primary font-semibold shadow-xs border border-border"
                  : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-[4px] bg-surface-subtle border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-[4px] text-xs transition-colors flex items-center gap-1.5 ${viewMode === "grid"
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
              className={`p-1.5 rounded-[4px] text-xs transition-colors flex items-center gap-1.5 ${viewMode === "table"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
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
        <div className="works-table-anim minimal-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-surface-subtle text-text-tertiary font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 sm:px-5 font-medium w-8 sm:w-16">Index</th>
                  <th className="py-3 px-3 sm:px-5 font-medium">Project</th>
                  <th className="py-3 px-3 sm:px-5 font-medium">Tech Stack</th>
                  <th className="py-3 px-3 sm:px-5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProjects.map((project, idx) => (
                  <tr
                    key={project.id}
                    className="hover:bg-surface-subtle transition-colors cursor-pointer group"
                    onClick={() => onSelectProject(project)}
                  >
                    <td className="py-3 sm:py-4 px-3 sm:px-5 font-mono text-text-tertiary text-xs">
                      0{idx + 1}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5">
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs sm:text-sm text-text-primary group-hover:text-text-primary flex items-center gap-1.5">
                          {project.title}
                          <ArrowUpRight size={13} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <div className="text-[11px] text-text-secondary line-clamp-1 max-w-[140px] sm:max-w-xs md:hidden">
                          {project.desc}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5">
                      <div className="flex flex-wrap gap-1 max-w-[140px] sm:max-w-none">
                        {project.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[9px] sm:text-[10px] uppercase px-1.5 py-0.5 rounded-[4px] bg-surface-subtle text-text-secondary whitespace-nowrap"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td
                      className="py-3 sm:py-4 px-3 sm:px-5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-minimal-primary !py-1 !px-2 sm:!px-2.5 !text-[10px] sm:!text-[11px] !rounded-[4px] whitespace-nowrap"
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
                            className="p-1 sm:p-1.5 rounded-[4px] bg-surface-subtle text-text-secondary hover:text-text-primary transition-colors"
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
