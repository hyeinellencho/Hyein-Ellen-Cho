import React from 'react';
import { useSite } from '../context/SiteContext';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Microscope, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { siteData, setIsAdminOpen, setAdminTab } = useSite();
  const { profile, researchInterests } = siteData;

  const pillarIcons = [Compass, ShieldCheck, Microscope, Users];

  return (
    <section id="about" className="py-16 md:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header - Editorial Numbering */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-dm text-neutral-400 block mb-1">
              Overview & Background
            </span>
            <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-neutral-900 tracking-tight">
              01. Biography & Academic Mission
            </h2>
          </div>
          <div className="text-xs font-dm text-neutral-500 max-w-sm">
            Investigating human-centered foundations for fluid, accountable interaction with generative AI systems.
          </div>
        </div>

        {/* Narrative & Side Rail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Narrative Column */}
          <div className="lg:col-span-7 space-y-6 text-neutral-700 font-dm leading-relaxed text-base">
            {profile.bioParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={idx === 0 ? 'first-letter:text-5xl first-letter:font-cormorant first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-neutral-950 first-letter:leading-none' : ''}
              >
                {paragraph}
              </p>
            ))}

            <div className="pt-4 p-5 bg-neutral-50 rounded border border-neutral-200/80 space-y-2">
              <h3 className="text-xs uppercase tracking-wider font-dm font-semibold text-neutral-900">
                Key Academic Affiliations
              </h3>
              <ul className="text-xs font-dm text-neutral-600 space-y-1.5 list-none">
                <li className="flex items-center gap-2">
                  <span className="text-neutral-400">·</span>
                  <span>Stanford University Department of Computer Science (Tenured Faculty)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neutral-400">·</span>
                  <span>Stanford Institute for Human-Centered AI (HAI Faculty Affiliate)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neutral-400">·</span>
                  <span>Stanford Center for Decisional Cognition (Senior Fellow)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Side Rail: Research Pillars */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-dm font-semibold uppercase tracking-wider text-neutral-900">
                Core Research Themes
              </h3>
              <button
                onClick={() => {
                  setAdminTab('profile');
                  setIsAdminOpen(true);
                }}
                className="text-xs text-neutral-400 hover:text-neutral-900 underline"
              >
                Customize
              </button>
            </div>

            <div className="space-y-4">
              {researchInterests.map((interest, i) => {
                const IconComponent = pillarIcons[i % pillarIcons.length];
                return (
                  <div
                    key={interest.id}
                    className="p-4 bg-white border border-neutral-200 rounded hover:border-neutral-300 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-neutral-100 rounded text-neutral-700 shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-dm font-medium text-neutral-900 leading-snug">
                          {interest.title}
                        </h4>
                        <p className="text-xs font-dm text-neutral-600 leading-relaxed">
                          {interest.description}
                        </p>
                        <div className="pt-1 flex flex-wrap gap-x-2 text-[11px] font-dm text-neutral-400">
                          {interest.keywords.map((kw, kwIdx) => (
                            <span key={kwIdx}>
                              {kw}{kwIdx < interest.keywords.length - 1 ? ' ·' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
