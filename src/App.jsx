import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import AboutSection from './components/AboutSection';
import ProjectModal from './components/ProjectModal';
import SocialsFooter from './components/SocialsFooter';
import AdminDashboard from './components/admin/AdminDashboard';

function MainContent() {
  const { activeTab, profile } = usePortfolio();

  // Dynamic Tab Name Sync (only name, no qualifications)
  useEffect(() => {
    const name = profile?.name || 'Alex Mercer';
    if (activeTab === 'admin') {
      document.title = `${name} — Admin CMS`;
    } else {
      document.title = name;
    }
  }, [profile?.name, activeTab]);

  // Separate Isolated Admin Page (No Public Header or Public Footer)
  if (activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-[#070709] text-white">
        <AdminDashboard />
      </div>
    );
  }

  // Public Portfolio Page Layout
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070709] text-white">
      <Navbar />
      
      <main className="grow">
        <Hero />
        <ProjectGrid />
        <AboutSection />
        <ProjectModal />
      </main>

      <SocialsFooter />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainContent />
    </PortfolioProvider>
  );
}
