import React from 'react';
import { useSite } from '../context/SiteContext';
import { ExternalLink, Users, ArrowUpRight, Plus, Mail, Edit2, Image as ImageIcon } from 'lucide-react';

export const ProjectsLabSection: React.FC = () => {
  const { siteData, setIsAdminOpen, setAdminTab, openProjectEditor } = useSite();
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
              Research Initiatives
            </span>
            <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-neutral-900 tracking-tight">
              Current Research Projects
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="text-xs font-dm uppercase tracking-wider text-neutral-500 font-semibold">
                {featuredProject.kicker}
              </div>
              <button
                onClick={() => openProjectEditor(featuredProject.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-dm font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded shadow-xs transition-colors self-start sm:self-auto"
                title="Edit project details and photo"
              >
                <Edit2 className="w-3 h-3 text-neutral-500" />
                <span>Edit Project / Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
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
                <div className="overflow-hidden rounded border border-neutral-200 bg-white shadow-xs relative group">
                  {featuredProject.imageUrl ? (
                    <img
                      src={featuredProject.imageUrl}
                      alt={featuredProject.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] bg-neutral-100 flex flex-col items-center justify-center text-neutral-400 text-xs p-4 gap-2">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span>No research diagram photo</span>
                    </div>
                  )}
                  <button
                    onClick={() => openProjectEditor(featuredProject.id)}
                    className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-dm font-medium text-neutral-800 bg-white/95 hover:bg-white border border-neutral-300 rounded shadow-xs backdrop-blur-xs transition-colors"
                    title="Change or delete project photo"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Change / Delete Photo</span>
                  </button>
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-dm uppercase tracking-wider text-neutral-400 block font-medium">
                      {proj.kicker}
                    </span>
                    <button
                      onClick={() => openProjectEditor(proj.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-dm font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded transition-colors"
                      title="Edit project and photo"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Project / Photo</span>
                    </button>
                  </div>
                  {proj.imageUrl ? (
                    <div className="aspect-[16/9] w-full overflow-hidden rounded border border-neutral-200/80 mb-4 relative group">
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => openProjectEditor(proj.id)}
                        className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-dm font-medium text-neutral-800 bg-white/90 hover:bg-white border border-neutral-300 rounded shadow-xs backdrop-blur-xs transition-colors"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-neutral-50 border border-dashed border-neutral-200 rounded mb-4 flex flex-col items-center justify-center gap-1.5 text-neutral-400 text-xs">
                      <ImageIcon className="w-5 h-5 opacity-40" />
                      <button
                        onClick={() => openProjectEditor(proj.id)}
                        className="text-xs text-neutral-600 hover:text-neutral-900 underline font-dm"
                      >
                        + Add Project Photo
                      </button>
                    </div>
                  )}
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

        {/* PhD Supervision & Research Topics */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-dm text-neutral-400 block mb-1">
                Supervision
              </span>
              <h3 className="text-2xl md:text-3xl font-cormorant font-semibold text-neutral-900">
                PhD Supervision & Research Topics
              </h3>
              <p className="text-xs md:text-sm font-dm text-neutral-500 mt-1">
                Current research supervision as of 2025
              </p>
            </div>
            <button
              onClick={() => {
                setAdminTab('lab');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-500" />
              <span>Manage Topics</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labMembers.map((member, index) => {
              const displayTopic = member.topic || member.name;
              return (
                <div
                  key={member.id}
                  className="p-5 md:p-6 bg-white border border-neutral-200/90 rounded-md hover:border-neutral-300 transition-colors space-y-4 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-dm">
                      <span className="font-mono text-[11px] text-neutral-400">
                        Topic {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                        {member.role || 'PhD Research'}
                      </span>
                    </div>

                    <h4 className="text-sm md:text-base font-dm font-semibold text-neutral-900 leading-snug">
                      {displayTopic}
                    </h4>

                    {member.coSupervisors && (
                      <div className="pt-2 border-t border-neutral-100 text-xs font-dm text-neutral-600 leading-relaxed">
                        <span className="text-neutral-400 font-normal">Co-supervisors: </span>
                        <span className="text-neutral-800 font-medium">{member.coSupervisors}</span>
                      </div>
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
                        <span>Project Details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Prospective Students Callout */}
        <div className="mt-12 p-6 bg-neutral-900 text-neutral-100 rounded-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <h4 className="text-lg font-cormorant font-semibold text-white">
                Note for Prospective PhD Applicants
              </h4>
              <p className="text-xs md:text-sm font-dm text-neutral-300 leading-relaxed">
                Please note that I am not accepting any research students until 2028.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-dm font-medium text-neutral-900 bg-white hover:bg-neutral-100 rounded transition-colors whitespace-nowrap shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
