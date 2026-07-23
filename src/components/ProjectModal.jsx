import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ExternalLink, Github, Layers, Cpu } from 'lucide-react';

export default function ProjectModal() {
  const { selectedProject, setSelectedProject } = usePortfolio();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProject]);

  if (!selectedProject) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge-completed px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Completed</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="badge-in-progress px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>In Progress</span>
          </span>
        );
      case 'planned':
        return (
          <span className="badge-planned px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
            <span>Planned</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop with Backdrop Blur */}
      <div 
        onClick={() => setSelectedProject(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
      ></div>

      {/* Modal Box with Scale Up Animation */}
      <div className="brand-card-grid relative w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10 scrollbar-thin animate-scale-up border border-[#222226] bg-[#0E0E11] shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProject(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-[#16161A] border border-[#222226] text-[#8E8E93] hover:text-white hover:border-[#383840] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Image Header */}
        <div className="relative h-60 sm:h-72 w-full bg-[#16161A] overflow-hidden">
          <img
            src={selectedProject.image}
            alt={selectedProject.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E11] via-transparent to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(selectedProject.status)}
                <span className="px-2.5 py-0.5 rounded bg-[#16161A] border border-[#222226] text-xs font-mono text-[#D4D4D8]">
                  {selectedProject.category || 'Engineering'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] font-heading tracking-tight">
                {selectedProject.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#16161A] border border-[#222226] text-sm text-[#FAFAFA] font-sans leading-relaxed">
            {selectedProject.summary || selectedProject.description}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold font-heading text-[#FAFAFA] mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8E8E93]" />
              <span>Project Explanation & Architecture</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#D4D4D8] font-sans leading-relaxed whitespace-pre-line bg-[#0E0E11] p-4 rounded-xl border border-[#222226]">
              {selectedProject.description}
            </p>
          </div>

          {/* Tech Tags */}
          <div>
            <h3 className="text-sm font-bold font-heading text-[#FAFAFA] mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8E8E93]" />
              <span>Technologies Used</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tags && selectedProject.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#16161A] border border-[#222226] text-xs font-mono text-[#FAFAFA]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-6 border-t border-[#222226] flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-mono text-[#8E8E93]">
              Date: <span className="text-[#FAFAFA]">{selectedProject.date || '2026'}</span>
            </div>

            <div className="flex items-center gap-3">
              {selectedProject.github && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-dark-action px-4 py-2 text-xs flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repo</span>
                </a>
              )}
              {selectedProject.demo && (
                <a
                  href={selectedProject.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-white-action px-5 py-2 text-xs flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-black" />
                  <span>Launch Live Project</span>
                </a>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
