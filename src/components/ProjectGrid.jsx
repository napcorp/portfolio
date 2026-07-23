import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import ProjectCard from './ProjectCard';
import { Search, FolderGit2, RefreshCw } from 'lucide-react';

export default function ProjectGrid() {
  const {
    profile,
    projects,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag
  } = usePortfolio();

  // Use custom managed tags if configured in CMS, else unique project tags
  const allTags = profile?.customTags && profile.customTags.length > 0
    ? profile.customTags
    : Array.from(new Set(projects.flatMap(p => p.tags || [])));

  const filteredProjects = projects.filter(project => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false;
    if (selectedTag !== 'all' && (!project.tags || !project.tags.includes(selectedTag))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        project.title?.toLowerCase().includes(q) ||
        project.summary?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;
  const plannedCount = projects.filter(p => p.status === 'planned').length;

  return (
    <section id="projects" className="py-10 px-4 lg:px-8 max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] font-heading tracking-tight">
            Projects Portfolio
          </h2>
          <p className="text-xs text-[#8E8E93] font-sans mt-1">
            Explore projects categorized by development status.
          </p>
        </div>

        <div className="text-xs font-mono text-[#8E8E93]">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="brand-card-grid p-4 mb-8 space-y-4 border border-[#222226] bg-[#0E0E11]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#FFFFFF] text-[#000000] font-semibold'
                  : 'bg-[#16161A] border border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA]'
              }`}
            >
              All ({projects.length})
            </button>

            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                statusFilter === 'completed'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-[#16161A] border border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Completed ({completedCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                statusFilter === 'in-progress'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-[#16161A] border border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>In Progress ({inProgressCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('planned')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                statusFilter === 'planned'
                  ? 'bg-zinc-200 text-black font-semibold'
                  : 'bg-[#16161A] border border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              <span>Planned ({plannedCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#16161A] border border-[#222226] text-[#FAFAFA] placeholder-[#8E8E93] text-xs focus:outline-none focus:border-[#383840]"
            />
          </div>

        </div>

        {/* Tag Filters (CMS Managed) */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-[#222226] overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-mono text-[#8E8E93] shrink-0">Filter by Tag:</span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors shrink-0 ${
                selectedTag === 'all'
                  ? 'bg-[#FAFAFA] text-black font-semibold'
                  : 'bg-[#16161A] text-[#8E8E93] hover:text-[#FAFAFA]'
              }`}
            >
              All
            </button>

            {allTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors shrink-0 ${
                  selectedTag === tag
                    ? 'bg-[#16161A] border border-[#383840] text-[#FAFAFA] font-semibold'
                    : 'bg-[#0E0E11] border border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Grid Display */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="brand-card-grid p-12 text-center flex flex-col items-center border border-[#222226] bg-[#0E0E11]">
          <FolderGit2 className="w-10 h-10 text-[#8E8E93] mb-3" />
          <h3 className="text-base font-bold text-[#FAFAFA] mb-1">No Projects Found</h3>
          <p className="text-xs text-[#8E8E93] mb-4">Try adjusting your search query or status filter.</p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setSearchQuery('');
              setSelectedTag('all');
            }}
            className="btn-dark-action px-4 py-2 text-xs flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}

    </section>
  );
}
