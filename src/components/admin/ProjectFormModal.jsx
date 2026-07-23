import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Save, FolderPlus, Tag, Plus, Trash2 } from 'lucide-react';

export default function ProjectFormModal({ projectToEdit, onClose }) {
  const { addProject, updateProject } = usePortfolio();

  const [formData, setFormData] = useState({
    title: projectToEdit?.title || '',
    status: projectToEdit?.status || 'planned',
    category: projectToEdit?.category || 'General',
    summary: projectToEdit?.summary || '',
    description: projectToEdit?.description || '',
    image: projectToEdit?.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: projectToEdit?.tags || ['React', 'Tailwind CSS'],
    github: projectToEdit?.github || '',
    demo: projectToEdit?.demo || '',
    featured: Boolean(projectToEdit?.featured)
  });

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (projectToEdit) {
      await updateProject(projectToEdit.id, formData);
    } else {
      await addProject(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      ></div>

      {/* Modal Box with explicit scrolling */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 z-10 rounded-2xl bg-[#0E0E11] border border-[#222226] shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#16161A] border border-[#222226] text-[#8E8E93] hover:text-[#FAFAFA] z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-10">
          <div className="p-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA]">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-heading text-[#FAFAFA]">
              {projectToEdit ? 'Edit Project' : 'Add New Project'}
            </h2>
            <p className="text-xs font-mono text-[#8E8E93]">Configure project details, status & tech tags</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          
          <div>
            <label className="block text-[#FAFAFA] mb-1 font-semibold">PROJECT TITLE *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. QuantumGuard Security Mesh"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FAFAFA] mb-1 font-semibold">STATUS *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>

            <div>
              <label className="block text-[#FAFAFA] mb-1 font-semibold">CATEGORY *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Cybersecurity, AI / Web"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#FAFAFA] mb-1 font-semibold">SUMMARY (Card Subtitle) *</label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Short 1-2 sentence overview"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
            />
          </div>

          <div>
            <label className="block text-[#FAFAFA] mb-1 font-semibold">FULL EXPLANATION (Modal Content) *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed architecture description and implementation details"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none font-sans"
            ></textarea>
          </div>

          <div>
            <label className="block text-[#FAFAFA] mb-1 font-semibold">PROJECT PHOTO URL (Modal Header Image)</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FAFAFA] mb-1 font-semibold">GITHUB REPOSITORY URL</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/username/repo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
              />
            </div>

            <div>
              <label className="block text-[#FAFAFA] mb-1 font-semibold">LIVE DEMO URL</label>
              <input
                type="text"
                value={formData.demo}
                onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="p-3.5 rounded-xl bg-[#16161A] border border-[#222226] space-y-2">
            <label className="block text-[#FAFAFA] font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>TECHNOLOGY TAGS</span>
            </label>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-[#0E0E11] border border-[#222226] text-xs flex items-center gap-1">
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(idx)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag (e.g. React)"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0E0E11] border border-[#222226] text-[#FAFAFA]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-dark-action px-3 py-1.5 text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#222226] sticky bottom-0 bg-[#0E0E11] py-2 z-10">
            <button
              type="button"
              onClick={onClose}
              className="btn-dark-action px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-white-action px-6 py-2 text-xs flex items-center gap-2 font-bold"
            >
              <Save className="w-4 h-4 text-black" />
              <span>{projectToEdit ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
