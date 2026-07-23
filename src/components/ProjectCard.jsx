import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  const { setSelectedProject } = usePortfolio();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge-completed px-2.5 py-0.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Completed</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="badge-in-progress px-2.5 py-0.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>In Progress</span>
          </span>
        );
      case 'planned':
        return (
          <span className="badge-planned px-2.5 py-0.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span>Planned</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="brand-card-grid p-6 flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300">
      
      <div className="space-y-4">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2">
          {getStatusBadge(project.status)}
          <span className="px-2.5 py-0.5 rounded-md bg-[#16161A] border border-[#222226] text-xs font-mono text-[#D4D4D8]">
            {project.category || 'Engineering'}
          </span>
        </div>

        {/* Title & Summary */}
        <div className="space-y-2 cursor-pointer" onClick={() => setSelectedProject(project)}>
          <h3 className="text-xl font-bold font-heading text-[#FAFAFA] group-hover:text-[#38BDF8] transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#8E8E93] font-sans line-clamp-3 leading-relaxed">
            {project.summary || project.description}
          </p>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags && project.tags.slice(0, 5).map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded bg-[#16161A] border border-[#222226] text-[11px] font-mono text-[#D4D4D8] hover:border-[#383840] transition-colors"
            >
              {tag}
            </span>
          ))}
          {project.tags && project.tags.length > 5 && (
            <span className="px-2 py-0.5 rounded bg-[#16161A] border border-[#222226] text-[11px] font-mono text-[#8E8E93]">
              +{project.tags.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-[#222226]/60 flex items-center justify-between gap-2 mt-6">
        <button
          onClick={() => setSelectedProject(project)}
          className="text-xs font-medium text-[#FAFAFA] hover:text-[#38BDF8] flex items-center gap-1 group/btn transition-colors"
        >
          <span>View Explanation</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#8E8E93] group-hover/btn:text-[#38BDF8] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
        </button>

        <div className="flex items-center gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-[#16161A] border border-[#222226] text-[#8E8E93] hover:text-white hover:border-[#383840] transition-all"
              title="GitHub Repo"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-[#16161A] border border-[#222226] text-[#8E8E93] hover:text-white hover:border-[#383840] transition-all"
              title="Live Demo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
}
