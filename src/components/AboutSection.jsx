import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function AboutSection() {
  const { profile } = usePortfolio();
  const skills = profile.skills || [];
  const capabilities = profile.capabilities || [];

  return (
    <section id="about" className="py-14 px-4 lg:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Section Title */}
      <div className="border-b border-[#222226] pb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
          About & Engineering Stack
        </h2>
        <p className="text-sm text-[#8E8E93] font-sans mt-1">
          Core technical competencies, architecture standards, and domain expertise.
        </p>
      </div>

      {/* Row List Items for Capabilities (Dynamic & WITHOUT Right Arrows as requested) */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono text-[#8E8E93] uppercase tracking-wider mb-4">
          Core Capabilities & Standards
        </h3>

        <div className="space-y-4">
          {capabilities.map((cap, idx) => (
            <div key={cap.id || idx} className="brand-card-grid p-6 border border-[#222226] bg-[#0E0E11] hover:border-[#383840] transition-colors">
              <h4 className="text-lg font-bold font-heading text-white">
                {cap.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#8E8E93] font-sans mt-1 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Matrix Grid */}
      <div className="pt-4">
        <h3 className="text-xs font-mono text-[#8E8E93] uppercase tracking-wider mb-4">
          Verified Technical Skills
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill, idx) => (
            <div key={idx} className="brand-card-grid p-4 border border-[#222226] bg-[#0E0E11] hover:border-[#383840] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading text-xs font-bold text-white">{skill.name}</span>
                <span className="font-mono text-xs text-[#38BDF8] font-bold">{skill.level}%</span>
              </div>
              <div className="w-full h-1 bg-[#16161A] rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-[#8E8E93]">{skill.category}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
