import React from 'react';
import { useSite } from '../context/SiteContext';
import { ArrowUp, Settings, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteData, setIsAdminOpen } = useSite();
  const { profile, seo } = siteData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-neutral-200 py-12 text-xs font-dm text-neutral-500">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b border-neutral-100">
          <div className="space-y-2 max-w-sm">
            <h3 className="text-base font-cormorant font-semibold text-neutral-900">
              {profile.name}
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              {profile.title} · {profile.department}
            </p>
            <p className="text-neutral-400">
              {profile.institution}
              {profile.address && !profile.address.includes('Wellington Road')
                ? ` · ${profile.address}`
                : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px] block">
                Navigation
              </span>
              <ul className="space-y-1 text-neutral-600">
                <li><a href="#about" className="hover:text-neutral-900 transition-colors">Biography</a></li>
                <li><a href="#publications" className="hover:text-neutral-900 transition-colors">Publications</a></li>
                <li><a href="#lab" className="hover:text-neutral-900 transition-colors">Research Projects</a></li>
                <li><a href="#contact" className="hover:text-neutral-900 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px] block">
                Academic Profiles
              </span>
              <ul className="space-y-1 text-neutral-600">
                <li>
                  <a
                    href={seo.googleScholarUrl || 'https://scholar.google.com/citations?hl=en&user=laKlDswAAAAJ&view_op=list_works&sortby=pubdate'}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Google Scholar
                  </a>
                </li>
                <li>
                  <a
                    href={`https://orcid.org/${seo.orcidId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    ORCID
                  </a>
                </li>
                <li>
                  <a
                    href={seo.linkedinUrl || 'https://www.linkedin.com/in/hyein-ellen-cho/'}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3 text-neutral-400">
            <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 underline"
            >
              <Settings className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors py-1 px-2 hover:bg-neutral-100 rounded"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
