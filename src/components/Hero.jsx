import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const { profile, projects } = usePortfolio();
  const [typedText, setTypedText] = useState('');

  const userNameSlug = profile.name ? profile.name.toLowerCase().replace(/\s+/g, '') : 'alexmercer';
  const fullText = `${userNameSlug} --inspect-metrics`;

  // Typing effect for terminal command
  useEffect(() => {
    let index = 0;
    setTypedText('');
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [fullText]);

  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;
  const plannedCount = projects.filter(p => p.status === 'planned').length;

  return (
    <section id="hero" className="pt-16 pb-16 px-4 lg:px-8 max-w-5xl mx-auto text-center space-y-8 relative animate-fade-in-up">
      
      {/* Headline */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-heading tracking-tight leading-[1.1]">
          Building Next-Gen Systems.{' '}
          <span className="text-[#38BDF8] bg-clip-text">Shipping Software at Scale.</span>
        </h1>
        
        <p className="text-base sm:text-lg text-[#8E8E93] max-w-2xl mx-auto font-sans leading-relaxed">
          {profile.bio || "Crafting high-performance distributed systems, real-time AI pipelines, and modern web applications with cutting-edge engineering standards."}
        </p>
      </div>

      {/* Dual CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <a href="#projects" className="btn-white-action text-sm px-6 py-3 shadow-lg group">
          <span>Explore Projects ({projects.length})</span>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
        </a>

        <a href="#contact" className="btn-dark-action text-sm px-6 py-3 group">
          <span>Contact Me</span>
          <ArrowRight className="w-4 h-4 text-[#8E8E93] group-hover:text-white group-hover:translate-x-1 transition-all" />
        </a>
      </div>

      {/* Terminal Widget with Dynamic Name */}
      <div className="pt-8 max-w-3xl mx-auto">
        <div className="brand-card-grid p-6 text-left border border-[#222226] bg-[#0E0E11] shadow-2xl relative overflow-hidden group">
          
          {/* Header Dots */}
          <div className="flex items-center justify-between border-b border-[#222226] pb-3 mb-4 font-mono text-xs text-[#8E8E93]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block hover:scale-110 transition-transform"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block hover:scale-110 transition-transform"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block hover:scale-110 transition-transform"></span>
              <span className="ml-2 font-mono text-[11px] text-[#8E8E93]">{userNameSlug} --zsh</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SYS_STATUS: ACTIVE</span>
            </div>
          </div>

          {/* Typing Command Line */}
          <div className="font-mono text-xs space-y-3 text-[#D4D4D8]">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#38BDF8] font-bold">$</span>
              <span className="text-white font-medium">{typedText}</span>
              <span className="w-2 h-4 bg-[#38BDF8] inline-block animate-cursor"></span>
            </div>

            {/* Metrics Output Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              
              <div className="p-3.5 rounded-xl bg-[#16161A] border border-[#222226] hover:border-emerald-500/40 transition-all group/item">
                <div className="text-[11px] text-[#8E8E93] uppercase font-mono">Completed</div>
                <div className="text-xl font-bold text-emerald-400 font-heading mt-0.5 group-hover/item:scale-105 transition-transform">
                  {completedCount} Systems
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#16161A] border border-[#222226] hover:border-amber-500/40 transition-all group/item">
                <div className="text-[11px] text-[#8E8E93] uppercase font-mono">In Progress</div>
                <div className="text-xl font-bold text-amber-400 font-heading mt-0.5 group-hover/item:scale-105 transition-transform">
                  {inProgressCount} Active
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#16161A] border border-[#222226] hover:border-zinc-500/40 transition-all group/item">
                <div className="text-[11px] text-[#8E8E93] uppercase font-mono">Planned</div>
                <div className="text-xl font-bold text-[#8E8E93] font-heading mt-0.5 group-hover/item:scale-105 transition-transform">
                  {plannedCount} Roadmap
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#16161A] border border-[#222226] hover:border-sky-500/40 transition-all group/item">
                <div className="text-[11px] text-[#8E8E93] uppercase font-mono">Experience</div>
                <div className="text-xl font-bold text-[#38BDF8] font-heading mt-0.5 group-hover/item:scale-105 transition-transform">
                  {profile.yearsExperience}+ Years
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
