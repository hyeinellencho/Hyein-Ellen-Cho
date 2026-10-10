import React from 'react';
import { useSite } from '../context/SiteContext';
import { BookOpen, FileText, Mail, ExternalLink, GraduationCap, MapPin, Clock } from 'lucide-react';

export const Hero: React.FC = () => {
  const { siteData, setIsAdminOpen, setAdminTab } = useSite();
  const { profile, seo } = siteData;

  return (
    <section className="relative bg-white pt-10 pb-12 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Kicker Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-dm tracking-wider uppercase text-neutral-500">
              <span>{profile.institution}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.department.split('&')[0]}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-700 font-medium">{profile.pronouns}</span>
            </div>

            {/* Headline & Professorship */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-cormorant font-semibold tracking-tight text-neutral-900 text-balance leading-none">
                {profile.name}
              </h1>
              <p className="text-base md:text-lg font-dm font-normal text-neutral-600 leading-snug">
                {profile.title}
              </p>
              <p className="text-sm font-dm text-neutral-500">
                {profile.secondaryTitle}
              </p>
            </div>

            {/* Lead Narrative */}
            <p className="text-base font-dm text-neutral-700 leading-relaxed max-w-2xl">
              {profile.bioLead}
            </p>

            {/* Research Focus - Clean Unboxed Discipline (No Pills!) */}
            <div className="pt-1">
              <span className="text-xs uppercase tracking-wider font-dm text-neutral-400 block mb-2">
                Primary Research Foci
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-dm text-neutral-700">
                <span>Human-AI Interaction</span>
                <span className="text-neutral-300" aria-hidden="true">/</span>
                <span>Mixed-Initiative Systems</span>
                <span className="text-neutral-300" aria-hidden="true">/</span>
                <span>Algorithmic Transparency</span>
                <span className="text-neutral-300" aria-hidden="true">/</span>
                <span>Scientific Augmented Cognition</span>
              </div>
            </div>

            {/* Action Buttons & Academic Anchors */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#publications"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Selected Publications</span>
              </a>

              <a
                href="#lab"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-dm font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 rounded transition-colors whitespace-nowrap"
              >
                <span>CollabAI Lab Studio</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-dm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded transition-colors whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact & Office</span>
              </a>
            </div>

            {/* Quick Scholarly Links Bar */}
            <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs font-dm text-neutral-500">
              <span className="text-neutral-400">Profiles:</span>
              <a
                href={seo.googleScholarId ? `https://scholar.google.com` : '#'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 transition-colors underline-offset-2 hover:underline"
              >
                Google Scholar
              </a>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <a
                href={`https://orcid.org/${seo.orcidId}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 transition-colors underline-offset-2 hover:underline"
              >
                ORCID ({seo.orcidId})
              </a>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <a
                href={seo.dblpUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 transition-colors underline-offset-2 hover:underline"
              >
                DBLP
              </a>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-neutral-900 transition-colors underline-offset-2 hover:underline"
              >
                {profile.email}
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Portrait & Academic Anchor */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-sm">
              {/* Portrait Frame */}
              <div className="relative w-[301px] h-[300px] max-w-full overflow-hidden rounded-md border border-neutral-200/90 bg-neutral-50 shadow-xs group mx-auto lg:ml-auto">
                <img
                  src={profile.avatarUrl}
                  alt={`Portrait of ${profile.name}`}
                  referrerPolicy="no-referrer"
                  style={{ width: '301px', height: '300px' }}
                  className="w-[301px] h-[300px] object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
                />
                {/* Subtle scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              {/* Caption & Location metadata */}
              <div className="mt-3 space-y-1.5 text-xs font-dm text-neutral-600 px-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{profile.office}</span>
                  </div>
                  <button
                    onClick={() => {
                      setAdminTab('profile');
                      setIsAdminOpen(true);
                    }}
                    className="text-neutral-400 hover:text-neutral-700 underline text-[11px]"
                  >
                    Edit Info
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{profile.officeHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Academic Utility Ribbon below split */}
      <div className="mt-12 border-t border-neutral-200 bg-neutral-50/70 py-3.5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-dm text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900">Current Academic Notice:</span>
            <span>{profile.statusBadge}</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500 shrink-0">
            <span>Faculty Affiliate: Monash Data Futures Institute</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>Associate Editor: ACM TOCHI</span>
          </div>
        </div>
      </div>
    </section>
  );
};
