import React, { useRef, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { BookOpen, FileText, Mail, ExternalLink, GraduationCap, MapPin, Clock, Camera, Upload, RotateCcw, Check } from 'lucide-react';

import { compressImageFile } from '../utils/imageCompressor';

export const Hero: React.FC = () => {
  const { siteData, updateProfile, setIsAdminOpen, setAdminTab } = useSite();
  const { profile, seo } = siteData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 500, 0.8);
        updateProfile({ avatarUrl: compressed });
        setPhotoMessage('Photo updated!');
        setTimeout(() => setPhotoMessage(null), 3000);
      } catch (err) {
        console.error('Image compression failed:', err);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            updateProfile({ avatarUrl: reader.result });
            setPhotoMessage('Photo updated!');
            setTimeout(() => setPhotoMessage(null), 3000);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSetDefaultPortrait = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateProfile({ avatarUrl: '/src/assets/images/prof_portrait_new_1791626002011.jpg' });
    setPhotoMessage('Portrait reset to Monash photo');
    setTimeout(() => setPhotoMessage(null), 3000);
  };

  return (
    <section className="relative bg-white pt-10 pb-12 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-dm tracking-wider uppercase text-neutral-500">
              <span>{profile.institution}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.department.split('&')[0]}</span>
              {profile.pronouns && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-neutral-700 font-medium">{profile.pronouns}</span>
                </>
              )}
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
            <div className="group relative">
              <p className="text-base font-dm text-neutral-700 leading-relaxed max-w-2xl">
                {profile.bioLead}
              </p>
              <button
                onClick={() => {
                  setAdminTab('profile');
                  setIsAdminOpen(true);
                }}
                className="mt-1 text-[11px] font-dm text-neutral-400 hover:text-neutral-800 underline inline-flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
                title="Edit introduction / bio lead text"
              >
                Edit Introduction
              </button>
            </div>

            {/* Research Focus - Clean Unboxed Discipline (No Pills!) */}
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-dm text-neutral-400 block">
                  Primary Research Focus
                </span>
                <button
                  onClick={() => {
                    setAdminTab('profile');
                    setIsAdminOpen(true);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-neutral-700 underline"
                  title="Edit primary research themes"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-dm text-neutral-700">
                {(profile.primaryInterests && profile.primaryInterests.length > 0
                  ? profile.primaryInterests
                  : ['Gender-based violence', 'Migration', 'Social justice', 'Korean diaspora', 'Qualitative research']
                ).map((interest, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span>{interest}</span>
                    {idx < arr.length - 1 && (
                      <span className="text-neutral-300" aria-hidden="true">
                        /
                      </span>
                    )}
                  </React.Fragment>
                ))}
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
                <span>Research Funding</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-dm font-medium text-neutral-700 bg-white hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-300 rounded shadow-xs transition-colors whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>Contact</span>
              </a>
            </div>

            {/* Quick Scholarly Links Bar */}
            <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs font-dm text-neutral-500">
              <span className="text-neutral-400">Profiles:</span>
              <a
                href={seo.googleScholarUrl || (seo.googleScholarId ? `https://scholar.google.com/citations?user=${seo.googleScholarId}` : 'https://scholar.google.com')}
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
                href={seo.linkedinUrl || 'https://www.linkedin.com/in/hyein-ellen-cho/'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 transition-colors underline-offset-2 hover:underline"
              >
                LinkedIn
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
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <img
                  src={profile.avatarUrl}
                  alt={`Portrait of ${profile.name}`}
                  referrerPolicy="no-referrer"
                  style={{ width: '301px', height: '300px' }}
                  className="w-[301px] h-[300px] object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
                />

                {/* Subtle scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-1.5">
                  <div className="flex items-center gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-white/95 hover:bg-white text-neutral-900 text-[11px] font-dm font-medium rounded shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Photo (사진 변경)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSetDefaultPortrait}
                      title="Reset to official Monash portrait"
                      className="inline-flex items-center justify-center p-1.5 bg-neutral-900/80 hover:bg-neutral-900 text-white text-[11px] font-dm rounded transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Toast feedback */}
                {photoMessage && (
                  <div className="absolute top-2 inset-x-2 bg-neutral-900/90 text-white text-[11px] font-dm px-2.5 py-1 rounded text-center shadow-md animate-fade-in flex items-center justify-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{photoMessage}</span>
                  </div>
                )}
              </div>

              {/* Caption & Location metadata */}
              <div className="mt-3 space-y-1.5 text-xs font-dm text-neutral-600 px-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{profile.office}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-neutral-500 hover:text-neutral-900 underline text-[11px] inline-flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>사진 변경</span>
                    </button>
                    <span className="text-neutral-300">·</span>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
