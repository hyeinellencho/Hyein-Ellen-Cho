import React from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PublicationsSection } from './components/PublicationsSection';
import { ProjectsLabSection } from './components/ProjectsLabSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { BibtexModal } from './components/BibtexModal';
import { AdminQuickBar } from './components/AdminQuickBar';

const AcademicAppContent: React.FC = () => {
  const { siteData } = useSite();

  // Determine primary font pairing class
  const fontClass =
    siteData.theme.fontPairing === 'playfair'
      ? 'font-playfair'
      : siteData.theme.fontPairing === 'jakarta'
      ? 'font-jakarta'
      : 'font-cormorant';

  return (
    <div className={`min-h-screen bg-white text-neutral-900 ${fontClass}`}>
      {/* Primary Sticky Top Bar */}
      <Header />

      {/* Main Content Sections */}
      <main>
        {/* Split Hero with Academic Portrait & Notice Ribbon */}
        <Hero />

        {/* Biography */}
        <AboutSection />

        {/* Publications */}
        <PublicationsSection />

        {/* Research Initiatives */}
        <ProjectsLabSection />

        {/* Contact & Academic Enquiries */}
        <ContactSection />
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Admin Quick Action Floating Bar */}
      <AdminQuickBar />

      {/* Full Admin Management Dashboard Modal */}
      <AdminDashboardModal />

      {/* BibTeX Citation Exporter Modal */}
      <BibtexModal />
    </div>
  );
};

export default function App() {
  return (
    <SiteProvider>
      <AcademicAppContent />
    </SiteProvider>
  );
}
