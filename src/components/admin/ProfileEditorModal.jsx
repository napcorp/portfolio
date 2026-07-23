import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Save, UserCheck, Plus, Trash2, Tag, Layers, Sparkles } from 'lucide-react';

export default function ProfileEditorModal({ onClose }) {
  const { profile, updateProfile } = usePortfolio();

  const [formData, setFormData] = useState({
    name: profile.name || '',
    title: profile.title || '',
    bio: profile.bio || '',
    status: profile.status || '',
    location: profile.location || '',
    yearsExperience: profile.yearsExperience || 5,
    avatar: profile.avatar || '',
    socials: {
      github: profile.socials?.github || '',
      linkedin: profile.socials?.linkedin || '',
      twitter: profile.socials?.twitter || '',
      discord: profile.socials?.discord || '',
      email: profile.socials?.email || ''
    },
    capabilities: profile.capabilities || [],
    customTags: profile.customTags || [],
    skills: profile.skills || []
  });

  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', level: 90 });
  const [newCap, setNewCap] = useState({ title: '', description: '' });
  const [newTag, setNewTag] = useState('');

  // Skill Handlers
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill, level: Number(newSkill.level) }]
    }));
    setNewSkill({ name: '', category: 'Frontend', level: 90 });
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Capability Handlers
  const handleAddCapability = () => {
    if (!newCap.title.trim()) return;
    setFormData(prev => ({
      ...prev,
      capabilities: [
        ...prev.capabilities,
        { id: `cap-${Date.now()}`, title: newCap.title, description: newCap.description }
      ]
    }));
    setNewCap({ title: '', description: '' });
  };

  const handleRemoveCapability = (index) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index)
    }));
  };

  // Tag Handlers
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const tagClean = newTag.trim();
    if (formData.customTags.includes(tagClean)) return;
    setFormData(prev => ({
      ...prev,
      customTags: [...prev.customTags, tagClean]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      customTags: prev.customTags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      ></div>

      {/* Modal Box with explicit overflow-y-auto and scrollbar support */}
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 z-10 rounded-2xl bg-[#0E0E11] border border-[#222226] shadow-2xl space-y-6">
        
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
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-heading text-[#FAFAFA]">
              Edit Profile & CMS Settings
            </h2>
            <p className="text-xs font-mono text-[#8E8E93]">Update Site Name, Capabilities, Tags & Skills</p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FAFAFA] mb-1.5 font-semibold">SITE / DEVELOPER NAME *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Mercer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
              />
            </div>

            <div>
              <label className="block text-[#FAFAFA] mb-1.5 font-semibold">TITLE / ROLE *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
              />
            </div>
          </div>

          {/* Status & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FAFAFA] mb-1.5 font-semibold">STATUS PILL MESSAGE</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
              />
            </div>

            <div>
              <label className="block text-[#FAFAFA] mb-1.5 font-semibold">LOCATION</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none focus:border-[#383840]"
              />
            </div>
          </div>

          {/* Bio Text */}
          <div>
            <label className="block text-[#FAFAFA] mb-1.5 font-semibold">BIO SUMMARY</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] focus:outline-none font-sans"
            ></textarea>
          </div>

          {/* MANAGED CAPABILITIES / STANDARDS SECTION */}
          <div className="p-4 rounded-2xl bg-[#16161A] border border-[#222226] space-y-3">
            <h3 className="text-xs font-bold font-heading text-[#FAFAFA] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              <span>Core Capabilities & Standards (About Section)</span>
            </h3>

            <div className="space-y-2 mb-3">
              {formData.capabilities.map((cap, idx) => (
                <div key={cap.id || idx} className="p-3 rounded-lg bg-[#0E0E11] border border-[#222226] flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-white text-xs">{cap.title}</div>
                    <div className="text-[11px] text-[#8E8E93] font-sans mt-0.5">{cap.description}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCapability(idx)}
                    className="p-1 text-red-400 hover:text-red-300 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#222226]">
              <input
                type="text"
                placeholder="Capability Title (e.g. Distributed Systems Architecture)"
                value={newCap.title}
                onChange={(e) => setNewCap({ ...newCap, title: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0E0E11] border border-[#222226] text-[#FAFAFA]"
              />
              <input
                type="text"
                placeholder="Capability Description"
                value={newCap.description}
                onChange={(e) => setNewCap({ ...newCap, description: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0E0E11] border border-[#222226] text-[#FAFAFA] font-sans"
              />
              <button
                type="button"
                onClick={handleAddCapability}
                className="btn-dark-action px-3 py-1.5 text-xs flex items-center gap-1 w-full justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Capability</span>
              </button>
            </div>
          </div>

          {/* MANAGED PROJECT FILTER TAGS SECTION */}
          <div className="p-4 rounded-2xl bg-[#16161A] border border-[#222226] space-y-3">
            <h3 className="text-xs font-bold font-heading text-[#FAFAFA] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#38BDF8]" />
              <span>Project Filter Tags (Projects Section)</span>
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {formData.customTags.map((tag, idx) => (
                <div key={idx} className="px-2.5 py-1 rounded-lg bg-[#0E0E11] border border-[#222226] text-[#FAFAFA] flex items-center gap-2 text-[11px]">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#222226]">
              <input
                type="text"
                placeholder="New Tag Name (e.g. Next.js)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0E0E11] border border-[#222226] text-[#FAFAFA]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-dark-action px-4 py-1.5 text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            </div>
          </div>

          {/* SKILLS MATRIX SECTION */}
          <div className="p-4 rounded-2xl bg-[#16161A] border border-[#222226] space-y-3">
            <h3 className="text-xs font-bold font-heading text-[#FAFAFA] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Skills Matrix (Verified Technical Skills)</span>
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.map((s, idx) => (
                <div key={idx} className="px-2.5 py-1 rounded-lg bg-[#0E0E11] border border-[#222226] text-[#FAFAFA] flex items-center gap-2 text-[11px]">
                  <span>{s.name} ({s.level}%)</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end pt-2 border-t border-[#222226]">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Skill Name (e.g. Docker)"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0E0E11] border border-[#222226] text-[#FAFAFA]"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Level %"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0E0E11] border border-[#222226] text-[#FAFAFA]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-dark-action px-3 py-1.5 text-xs flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
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
              <span>Save CMS Changes</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
