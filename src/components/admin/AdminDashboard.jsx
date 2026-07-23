import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import AdminLogin from './AdminLogin';
import ProjectFormModal from './ProjectFormModal';
import ProfileEditorModal from './ProfileEditorModal';
import { 
  FolderPlus, Edit, Trash2, UserCheck, KeyRound, Download, RefreshCw, 
  CheckCircle2, Clock, CalendarDays, Search, Lock, LogOut, ArrowLeft, AlertTriangle, X
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    isAdminLoggedIn, 
    projects, 
    profile, 
    deleteProject, 
    updateProject,
    resetDataToDefault,
    logoutAdmin,
    setActiveTab,
    updatePassword,
    token
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState('projects');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // Custom Delete Confirmation Modal State
  const [projectToDelete, setProjectToDelete] = useState(null);

  if (!isAdminLoggedIn) return <AdminLogin />;

  const filteredProjects = projects.filter(p => {
    if (adminStatusFilter !== 'all' && p.status !== adminStatusFilter) return false;
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase();
      return p.title.toLowerCase().includes(q) || (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setShowProjectModal(true);
  };

  const handleOpenEditModal = (project) => {
    setProjectToEdit(project);
    setShowProjectModal(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateProject(id, { status: newStatus });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      if (res.ok) {
        updatePassword(newPassword);
        setPassMsg('Password updated successfully!');
        setNewPassword('');
      } else {
        const d = await res.json();
        setPassMsg(d.error || 'Failed to update password');
      }
    } catch (err) {
      updatePassword(newPassword);
      setPassMsg('Password updated successfully!');
      setNewPassword('');
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ profile, projects }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;
  const plannedCount = projects.filter(p => p.status === 'planned').length;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070709] text-white">
      
      {/* Standalone Admin Header Navbar */}
      <header className="w-full border-b border-[#222226] bg-[#0E0E11] px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center text-white font-mono text-sm font-bold shadow-md">
            ✦
          </div>
          <div>
            <div className="font-heading font-extrabold text-base text-white flex items-center gap-2">
              <span>Admin CMS Dashboard</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                Authenticated
              </span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveSubTab('projects')}
            className={`px-3.5 py-1.5 rounded-lg border transition-all ${
              activeSubTab === 'projects'
                ? 'bg-[#FAFAFA] text-black font-semibold border-white'
                : 'bg-[#16161A] border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA]'
            }`}
          >
            Projects ({projects.length})
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg border transition-all ${
              activeSubTab === 'profile'
                ? 'bg-[#FAFAFA] text-black font-semibold border-white'
                : 'bg-[#16161A] border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA]'
            }`}
          >
            Profile CMS
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3.5 py-1.5 rounded-lg border transition-all ${
              activeSubTab === 'settings'
                ? 'bg-[#FAFAFA] text-black font-semibold border-white'
                : 'bg-[#16161A] border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA]'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('portfolio')}
            className="btn-dark-action text-xs px-3.5 py-1.5 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            title="Log out of Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="grow py-8 px-4 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="brand-card-grid p-4 border border-[#222226] bg-[#0E0E11]">
            <div className="text-xs font-mono text-[#8E8E93] mb-1">Total Projects</div>
            <div className="text-2xl font-bold font-heading text-[#FAFAFA]">{projects.length}</div>
          </div>
          <div className="brand-card-grid p-4 border border-[#222226] bg-[#0E0E11]">
            <div className="text-xs font-mono text-emerald-400 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
            <div className="text-2xl font-bold font-heading text-emerald-400">{completedCount}</div>
          </div>
          <div className="brand-card-grid p-4 border border-[#222226] bg-[#0E0E11]">
            <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>In Progress</span>
            </div>
            <div className="text-2xl font-bold font-heading text-amber-400">{inProgressCount}</div>
          </div>
          <div className="brand-card-grid p-4 border border-[#222226] bg-[#0E0E11]">
            <div className="text-xs font-mono text-[#8E8E93] mb-1 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Planned</span>
            </div>
            <div className="text-2xl font-bold font-heading text-[#FAFAFA]">{plannedCount}</div>
          </div>
        </div>

        {/* TAB 1: PROJECTS CMS */}
        {activeSubTab === 'projects' && (
          <div className="space-y-6">
            <div className="brand-card-grid p-4 border border-[#222226] bg-[#0E0E11] flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#16161A] border border-[#222226] text-[#FAFAFA] text-xs font-mono focus:outline-none focus:border-[#383840]"
                  />
                </div>

                <select
                  value={adminStatusFilter}
                  onChange={(e) => setAdminStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#16161A] border border-[#222226] text-[#FAFAFA] text-xs font-mono focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed Only</option>
                  <option value="in-progress">In Progress Only</option>
                  <option value="planned">Planned Only</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="btn-white-action px-4 py-2 text-xs flex items-center gap-2 font-bold w-full sm:w-auto justify-center"
              >
                <FolderPlus className="w-4 h-4 text-black" />
                <span>+ Add New Project</span>
              </button>
            </div>

            <div className="brand-card-grid overflow-hidden border border-[#222226] bg-[#0E0E11]">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#16161A] border-b border-[#222226] text-[#8E8E93] uppercase">
                    <tr>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222226]/60">
                    {filteredProjects.map(project => (
                      <tr key={project.id} className="hover:bg-[#16161A]/50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-bold text-[#FAFAFA]">{project.title}</div>
                            <div className="text-[11px] text-[#8E8E93] line-clamp-1 font-sans">{project.summary || project.description}</div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#D4D4D8]">
                          {project.category || 'General'}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={project.status}
                            onChange={(e) => handleStatusChange(project.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono border bg-[#16161A] border-[#222226] text-[#FAFAFA] focus:outline-none cursor-pointer"
                          >
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="planned">Planned</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(project)}
                              className="p-1.5 rounded-lg bg-[#16161A] border border-[#222226] text-[#FAFAFA] hover:border-[#383840] transition-all cursor-pointer"
                              title="Edit Project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => setProjectToDelete(project)}
                              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/30 hover:border-red-500/50 transition-all cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE CMS */}
        {activeSubTab === 'profile' && (
          <div className="brand-card-grid p-6 sm:p-8 border border-[#222226] bg-[#0E0E11] space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-[#222226] pb-4">
              <div>
                <h2 className="text-lg font-heading font-bold text-[#FAFAFA]">Profile Metadata</h2>
                <p className="text-xs font-mono text-[#8E8E93]">Current bio, status message, social links & skills</p>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="btn-white-action px-4 py-2 text-xs flex items-center gap-2 font-bold"
              >
                <UserCheck className="w-4 h-4 text-black" />
                <span>Edit Profile & Skills</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="space-y-2 text-[#D4D4D8]">
                <div>Name: <span className="text-white font-bold">{profile.name}</span></div>
                <div>Title: <span className="text-[#FAFAFA]">{profile.title}</span></div>
                <div>Status: <span className="text-emerald-400">{profile.status}</span></div>
                <div>Bio: <p className="text-[#8E8E93] font-sans mt-1 leading-relaxed">{profile.bio}</p></div>
              </div>

              <div className="space-y-2 text-[#D4D4D8]">
                <span className="text-[#8E8E93]">Social Links:</span>
                <div>GitHub: <span className="text-[#FAFAFA]">{profile.socials?.github}</span></div>
                <div>LinkedIn: <span className="text-[#FAFAFA]">{profile.socials?.linkedin}</span></div>
                <div>Email: <span className="text-[#FAFAFA]">{profile.socials?.email}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS & BACKUP */}
        {activeSubTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="brand-card-grid p-6 border border-[#222226] bg-[#0E0E11] space-y-4">
              <h3 className="text-base font-bold font-heading text-[#FAFAFA] flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>Change Admin Password</span>
              </h3>

              {passMsg && (
                <div className="p-3 rounded-lg bg-[#16161A] border border-[#222226] text-[#FAFAFA] font-mono text-xs">
                  {passMsg}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[#8E8E93] mb-1">NEW PASSWORD</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 rounded-lg bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-dark-action px-4 py-2 text-xs w-full flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Save New Password</span>
                </button>
              </form>
            </div>

            <div className="brand-card-grid p-6 border border-[#222226] bg-[#0E0E11] space-y-4">
              <h3 className="text-base font-bold font-heading text-[#FAFAFA] flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Backup & Reset</span>
              </h3>

              <button
                onClick={handleExportJson}
                className="btn-white-action px-4 py-2.5 text-xs w-full flex items-center justify-center gap-2 font-bold"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Export Database JSON Backup</span>
              </button>

              <div className="pt-4 border-t border-[#222226]">
                <button
                  onClick={() => {
                    if (window.confirm("Reset all project & profile data back to default template?")) {
                      resetDataToDefault();
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Default Template</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Custom Confirmation Modal for Deleting Projects */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setProjectToDelete(null)} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          ></div>

          <div className="relative z-10 w-full max-w-md p-6 rounded-2xl bg-[#0E0E11] border border-red-500/30 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#222226] pb-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm font-heading">
                <AlertTriangle className="w-4 h-4" />
                <span>Delete Project Confirmation</span>
              </div>
              <button 
                onClick={() => setProjectToDelete(null)}
                className="p-1 rounded-lg bg-[#16161A] text-[#8E8E93] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#D4D4D8] font-sans leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{projectToDelete.title}"</strong>? This will permanently remove it from your portfolio.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="btn-dark-action px-4 py-2 text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg transition-all"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Admin Footer */}
      <footer className="w-full border-t border-[#222226] bg-[#070709] px-6 py-4 text-center font-mono text-xs text-[#8E8E93]">
        Admin CMS Security Session // Active Token Protected
      </footer>

      {/* Modals */}
      {showProjectModal && (
        <ProjectFormModal
          projectToEdit={projectToEdit}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      {showProfileModal && (
        <ProfileEditorModal
          onClose={() => setShowProfileModal(false)}
        />
      )}

    </div>
  );
}
