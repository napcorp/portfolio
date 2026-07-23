import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Github, Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react';

export default function SocialsFooter() {
  const { profile, setActiveTab } = usePortfolio();
  const [msgInput, setMsgInput] = useState('');
  const [sentMsg, setSentMsg] = useState(false);

  const displayName = profile.name || "AlexMercer";

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setSentMsg(true);
    setMsgInput('');
    setTimeout(() => setSentMsg(false), 4000);
  };

  return (
    <footer id="contact" className="border-t border-[#222226] bg-[#070709] pt-16 pb-12 px-4 lg:px-8 mt-16 font-sans">
      
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Brand Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Logo with Dynamic Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center text-white font-mono text-sm font-bold">
                ✦
              </div>
              <div className="font-heading font-extrabold text-lg text-white">
                {displayName}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#8E8E93] max-w-sm leading-relaxed">
              Architecting scalable distributed systems and high-performance software. Ship software at speed alongside modern tools.
            </p>

            {/* Social Links Bar */}
            <div className="flex items-center gap-3 text-[#8E8E93]">
              {profile.socials?.github && (
                <a href={profile.socials.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0E0E11] border border-[#222226] hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0E0E11] border border-[#222226] hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.twitter && (
                <a href={profile.socials.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0E0E11] border border-[#222226] hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.email && (
                <a href={`mailto:${profile.socials.email}`} className="p-2 rounded-lg bg-[#0E0E11] border border-[#222226] hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Message Input Box */}
            <div className="pt-2">
              <div className="text-xs font-bold text-white mb-2">Direct Message & Inquiries</div>
              
              {sentMsg ? (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  ✓ Message transmitted successfully!
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex items-center max-w-sm">
                  <input
                    type="text"
                    required
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    placeholder="Enter your message..."
                    className="w-full px-3.5 py-2.5 rounded-l-lg bg-[#0E0E11] border border-[#222226] text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#383840]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-white text-black font-bold text-xs rounded-r-lg hover:bg-zinc-200 transition-colors flex items-center justify-center"
                  >
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </form>
              )}
              <div className="text-[10px] text-[#8E8E93] mt-1 font-mono">Direct inbox dispatch // Fast response</div>
            </div>

          </div>

          {/* Right Columns Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 text-xs font-sans">
            
            {/* Column 1: PROJECTS */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase text-[11px] font-mono tracking-wider">Projects</div>
              <ul className="space-y-2 text-[#8E8E93]">
                <li><a href="#projects" className="hover:text-white transition-colors">Completed</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">In Progress</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">Planned</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">Featured Systems</a></li>
              </ul>
            </div>

            {/* Column 2: CONNECT */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase text-[11px] font-mono tracking-wider">Connect</div>
              <ul className="space-y-2 text-[#8E8E93]">
                {profile.socials?.github && (
                  <li><a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub ↗</a></li>
                )}
                {profile.socials?.linkedin && (
                  <li><a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn ↗</a></li>
                )}
                {profile.socials?.twitter && (
                  <li><a href={profile.socials.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter / X ↗</a></li>
                )}
                {profile.socials?.email && (
                  <li><a href={`mailto:${profile.socials.email}`} className="hover:text-white transition-colors">Email</a></li>
                )}
                <li>
                  <button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors text-left font-mono text-[11px]">
                    Admin Login
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}
