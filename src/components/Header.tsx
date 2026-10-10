import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Settings, Menu, X, FileText, ExternalLink, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { siteData, setIsAdminOpen, isQuickEditActive, setIsQuickEditActive } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Publications', href: '#publications' },
    { label: 'Research Funding', href: '#lab' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          className="text-lg md:text-xl font-cormorant font-semibold tracking-tight text-neutral-900 hover:text-neutral-600 transition-colors whitespace-nowrap shrink-0"
        >
          {siteData.profile.name}
        </a>

        {/* Zone 2: Navigation Links (Single-line, unboxed, hover underline) */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-dm font-medium text-neutral-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-neutral-950 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-neutral-900 hover:after:w-full after:transition-all whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action (Admin Dashboard & Quick Controls) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 rounded border border-neutral-300 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            title="Directly edit all website content, biography, research, publications & settings"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-600" />
            <span className="hidden sm:inline">Edit Website</span>
            <span className="sm:hidden">Edit</span>
          </button>

          <a
            href="#contact"
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-neutral-600 hover:text-neutral-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-dm text-neutral-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-neutral-950 transition-colors border-b border-neutral-100"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-neutral-900 font-semibold"
            >
              Contact
            </a>
          </nav>
          <div className="pt-2 flex items-center justify-between border-t border-neutral-200 text-xs text-neutral-500">
            <span>{siteData.profile.institution}</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="text-neutral-900 font-medium underline"
            >
              Admin Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
