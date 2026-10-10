import React from 'react';
import { useSite } from '../context/SiteContext';
import { ExternalLink, Users, ArrowUpRight, Plus, Mail } from 'lucide-react';

export const ProjectsLabSection: React.FC = () => {
  const { siteData, setIsAdminOpen, setAdminTab } = useSite();
  const { projects, labMembers } = siteData;

  const featuredProject = projects[0];
  const secondaryProjects = projects.slice(1);

  return (
    <section id="lab" className="py-16 md:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-dm text-neutral-400 block mb-1">
              Active Grants & Group
            </span>
            <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-neutral-900 tracking-tight">
              03. Research Initiatives & CollabAI Studio
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAdminTab('lab');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-500" />
              <span>Manage Projects & Team</span>
            </button>
          </div>
        </div>

        {/* Featured Research Project Card (NSF CAREER with generated visualization) */}
        {featuredProject && (
          <div className="mb-14 p-6 md:p-8 bg-neutral-50/70 border border-neutral-200 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="text-xs font-dm uppercase tracking-wider text-neutral-500 font-semibold">
                  {featuredProject.kicker}
                </div>
                <h3 className="text-2xl md:text-3xl font-cormorant font-semibold text-neutral-900 leading-tight">
                  {featuredProject.title}
                </h3>
                <div className="text-xs font-dm text-neutral-600 font-medium">
                  Funding: {featuredProject.funding}
                </div>
                <p className="text-sm font-dm text-neutral-700 leading-relaxed">
                  {featuredProject.fullDescription}
                </p>
                <div className="pt-2 text-xs font-dm text-neutral-500">
                  <span className="font-semibold text-neutral-700">Collaborating Partners: </span>
                  {featuredProject.collaborators}
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded border border-neutral-200 bg-white shadow-xs">
                  {featuredProject.imageUrl ? (
                    <img
                      src={featuredProject.imageUrl}
                      alt={featuredProject.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
                      Research diagram
                    </div>
                  )}
                  <div className="p-3 bg-white border-t border-neutral-100 text-[11px] font-dm text-neutral-500 italic">
                    Fig. 1 — Conceptual architecture for human-agent cognitive handoffs and mutual mental model alignment.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Project Showcase (CollabAI Studio Banner) */}
        {secondaryProjects.length > 0 && (
          <div className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            {secondaryProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 bg-white border border-neutral-200 rounded-md hover:border-neutral-300 transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {proj.imageUrl && (
                    <div className="aspect-[16/9] w-full overflow-hidden rounded border border-neutral-200/80 mb-4">
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <span className="text-xs font-dm uppercase tracking-wider text-neutral-400 block font-medium">
                    {proj.kicker}
                  </span>
                  <h4 className="text-xl font-cormorant font-semibold text-neutral-900 leading-snug">
                    {proj.title}
                  </h4>
                  <p className="text-xs md:text-sm font-dm text-neutral-600 leading-relaxed">
                    {proj.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-dm text-neutral-500">
                  <span>{proj.funding}</span>
                  <span className="text-neutral-400">{proj.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Laboratory Members - 3-in-a-Row Grid per Section 2.C */}
        <div className="mt-16">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-8">
            <div>
              <h3 className="text-xl font-cormorant font-semibold text-neutral-900">
                CollabAI Research Group Members & Alumni
              </h3>
              <p className="text-xs font-dm text-neutral-500">
                Ph.D. candidates, postdocs, and research collaborators advised by Prof. Cho.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labMembers.map((member) => (
              <div
                key={member.id}
                className="p-5 bg-white border border-neutral-200 rounded hover:border-neutral-300 transition-colors space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-dm font-semibold text-neutral-900">
                      {member.name}
                    </h4>
                    {/* Unboxed role text (zero-pill rule) */}
                    <span className="text-xs font-dm text-neutral-500 font-medium">
                      {member.role}
                    </span>
                  </div>

                  <p className="text-xs font-dm text-neutral-600 leading-relaxed">
                    {member.topic}
                  </p>

                  {member.currentAffiliation && (
                    <p className="text-xs font-dm text-neutral-400 italic">
                      Current: {member.currentAffiliation}
                    </p>
                  )}
                </div>

                {member.websiteUrl && member.websiteUrl !== '#' && (
                  <div className="pt-2 border-t border-neutral-100">
                    <a
                      href={member.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-dm text-neutral-700 hover:text-neutral-950 underline underline-offset-2"
                    >
                      <span>Personal Page</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prospective Students Callout */}
        <div className="mt-12 p-6 bg-neutral-900 text-neutral-100 rounded-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <h4 className="text-lg font-cormorant font-semibold text-white">
                Prospective Ph.D. Applicants & Postdoctoral Fellows
              </h4>
              <p className="text-xs md:text-sm font-dm text-neutral-300 leading-relaxed">
                I am actively considering applications for Fall 2027 doctoral research candidates via the Monash University Faculty of Information Technology. Please mention my name in your research proposal and review our recent CHI/UIST publications before reaching out.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-dm font-medium text-neutral-900 bg-white hover:bg-neutral-100 rounded transition-colors whitespace-nowrap shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Inquiry Instructions</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
