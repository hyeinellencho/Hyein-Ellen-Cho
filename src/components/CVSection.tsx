import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Printer, Download, Award, Briefcase, GraduationCap, DollarSign, HeartHandshake, Mic } from 'lucide-react';

export const CVSection: React.FC = () => {
  const { siteData, setIsAdminOpen, setAdminTab } = useSite();
  const { cvItems, profile } = siteData;

  const [activeSection, setActiveSection] = useState<string>('all');

  const sections = [
    { label: 'Full CV Dossier', value: 'all', icon: Briefcase },
    { label: 'Appointments', value: 'Academic Appointments', icon: Briefcase },
    { label: 'Education', value: 'Education', icon: GraduationCap },
    { label: 'Honors & Awards', value: 'Honors & Awards', icon: Award },
    { label: 'Grants & Funding', value: 'Grants & Fellowships', icon: DollarSign },
    { label: 'Academic Service', value: 'Selected Service', icon: HeartHandshake },
    { label: 'Invited Keynotes', value: 'Invited Talks', icon: Mic },
  ];

  const filteredItems = cvItems.filter(
    (item) => activeSection === 'all' || item.section === activeSection
  );

  // Group by section for clean editorial presentation
  const groupedSections = [
    'Academic Appointments',
    'Education',
    'Honors & Awards',
    'Grants & Fellowships',
    'Selected Service',
    'Invited Talks',
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="cv" className="py-16 md:py-20 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-dm text-neutral-400 block mb-1">
              Curriculum Vitae
            </span>
            <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-neutral-900 tracking-tight">
              06. Academic Curriculum Vitae
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors"
              title="Print academic dossier or export to PDF"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-600" />
              <span>Print / Save CV (PDF)</span>
            </button>
          </div>
        </div>

        {/* Section Selector Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-md mb-10 max-w-fit">
          {sections.map((s) => (
            <button
              key={s.value}
              onClick={() => setActiveSection(s.value)}
              className={`px-3 py-1.5 text-xs font-dm font-medium rounded transition-colors whitespace-nowrap ${
                activeSection === s.value
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* CV Content Table/List */}
        <div className="bg-white border border-neutral-200 rounded-md p-6 md:p-8 space-y-10">
          {groupedSections
            .filter((sec) => activeSection === 'all' || activeSection === sec)
            .map((secName) => {
              const items = cvItems.filter((i) => i.section === secName);
              if (items.length === 0) return null;

              return (
                <div key={secName} className="space-y-4">
                  <h3 className="text-sm font-dm font-semibold uppercase tracking-wider text-neutral-900 pb-2 border-b border-neutral-200">
                    {secName}
                  </h3>

                  <div className="divide-y divide-neutral-100">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-baseline"
                      >
                        <div className="md:col-span-3 text-xs font-dm font-medium text-neutral-500 tabular-nums">
                          {item.period}
                        </div>
                        <div className="md:col-span-9 space-y-0.5">
                          <div className="text-sm font-dm font-semibold text-neutral-900">
                            {item.title}
                          </div>
                          <div className="text-xs font-dm text-neutral-700">
                            {item.organization}
                          </div>
                          {item.details && (
                            <div className="text-xs font-dm text-neutral-500 italic pt-0.5">
                              {item.details}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footnote on dossier */}
        <div className="mt-4 text-right text-xs font-dm text-neutral-400">
          Complete formal tenure-track dossier available upon institutional request.
        </div>
      </div>
    </section>
  );
};
