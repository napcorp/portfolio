import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Navbar() {
  const { profile, setActiveTab } = usePortfolio();

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 80;
      const bodyTop = document.body.getBoundingClientRect().top;
      const elemTop = elem.getBoundingClientRect().top;
      const targetPosition = elemTop - bodyTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  const displayName = profile.name || "Alex Mercer";

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-[#070709]/90 border-b border-[#222226] px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Dynamic Name Logo */}
        <div 
          onClick={(e) => {
            setActiveTab('portfolio');
            handleSmoothScroll(e, 'hero');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center text-white font-mono text-sm font-bold shadow-md group-hover:scale-105 transition-transform">
            ✦
          </div>
          <div className="font-heading font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
            {displayName}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-8 text-sm font-medium text-[#8E8E93]">
          <a 
            href="#projects" 
            onClick={(e) => handleSmoothScroll(e, 'projects')}
            className="hover:text-white transition-colors py-1 relative group"
          >
            <span>Projects</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#38BDF8] group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleSmoothScroll(e, 'about')}
            className="hover:text-white transition-colors py-1 relative group"
          >
            <span>About & Skills</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#38BDF8] group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleSmoothScroll(e, 'contact')}
            className="hover:text-white transition-colors py-1 relative group"
          >
            <span>Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#38BDF8] group-hover:w-full transition-all duration-300"></span>
          </a>
        </nav>

      </div>
    </header>
  );
}
