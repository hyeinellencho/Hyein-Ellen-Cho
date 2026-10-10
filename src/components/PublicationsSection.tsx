import React, { useState, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import { Publication, PublicationType } from '../types';
import { Search, FileText, Code, ExternalLink, ChevronDown, ChevronUp, Quote, Trophy, Plus, Check } from 'lucide-react';

export const PublicationsSection: React.FC = () => {
  const { siteData, setActiveBibtexPub, setIsAdminOpen, setAdminTab } = useSite();
  const { publications } = siteData;

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});

  const typeTabs: { label: string; value: string }[] = [
    { label: 'All Publications', value: 'all' },
    { label: 'Conference Papers', value: 'conference' },
    { label: 'Journal Articles', value: 'journal' },
    { label: 'Preprints', value: 'preprint' },
    { label: 'Chapters & Books', value: 'book_chapter' },
  ];

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesType = selectedType === 'all' || pub.type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pub.title.toLowerCase().includes(q) ||
        pub.authors.toLowerCase().includes(q) ||
        pub.venue.toLowerCase().includes(q) ||
        pub.year.toString().includes(q);

      return matchesType && matchesSearch;
    });
  }, [publications, selectedType, searchQuery]);

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper to render author string highlighting Prof. Hyein Ellen Cho
  const renderAuthors = (authors: string) => {
    const parts = authors.split(/(Hyein Ellen Cho|Cho, Hyein Ellen)/g);
    return (
      <span>
        {parts.map((part, i) =>
          part === 'Hyein Ellen Cho' || part === 'Cho, Hyein Ellen' ? (
            <span key={i} className="font-semibold text-neutral-950 underline decoration-neutral-300 underline-offset-2">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <section id="publications" className="py-16 md:py-20 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-dm text-neutral-400 block mb-1">
              Scholarly Output
            </span>
            <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-neutral-900 tracking-tight">
              02. Peer-Reviewed Publications & Manuscripts
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAdminTab('publications');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-500" />
              <span>Add Publication</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Search Input (Zero-pill, clean segmented controls) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-neutral-200 rounded-md">
            {typeTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value)}
                className={`px-3 py-1.5 text-xs font-dm font-medium rounded transition-colors whitespace-nowrap ${
                  selectedType === tab.value
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, venue, year..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-dm bg-white border border-neutral-200 rounded text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>
        </div>

        {/* Publication Count & Academic Citation helper */}
        <div className="flex items-center justify-between text-xs font-dm text-neutral-500 mb-6 px-1">
          <span>
            Showing <strong className="text-neutral-900">{filteredPublications.length}</strong> of{' '}
            {publications.length} works
          </span>
          <span className="hidden sm:inline">
            Click <Quote className="w-3 h-3 inline mx-0.5 text-neutral-400" /> to export BibTeX citation entry
          </span>
        </div>

        {/* Publications List */}
        {filteredPublications.length === 0 ? (
          <div className="py-12 text-center bg-white border border-neutral-200 rounded p-8">
            <p className="text-sm font-dm text-neutral-500">No publications matched your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-dm text-neutral-800 underline hover:text-neutral-950"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map((pub, idx) => {
              const isExpanded = !!expandedAbstracts[pub.id];
              return (
                <div
                  key={pub.id}
                  className="p-5 md:p-6 bg-white border border-neutral-200/90 rounded-md hover:border-neutral-300 transition-colors space-y-3"
                >
                  {/* Top line: Index, Year, Venue, Award (Unboxed text) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-dm text-neutral-500">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-neutral-400">[{pub.year}]</span>
                      <span className="font-medium text-neutral-800">{pub.venue}</span>
                      {pub.award && (
                        <>
                          <span aria-hidden="true" className="text-neutral-300">·</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-neutral-900">
                            <Trophy className="w-3.5 h-3.5 text-neutral-700" />
                            {pub.award}
                          </span>
                        </>
                      )}
                    </div>

                    {pub.doi && (
                      <span className="font-mono text-[11px] text-neutral-400">
                        DOI: {pub.doi}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-dm font-semibold text-neutral-900 leading-snug">
                    {pub.title}
                  </h3>

                  {/* Authors */}
                  <p className="text-xs md:text-sm font-dm text-neutral-600 leading-relaxed">
                    {renderAuthors(pub.authors)}
                  </p>

                  {/* Action Affordances: Abstract toggle, BibTeX, PDF, Code */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 text-xs font-dm">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => toggleAbstract(pub.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Hide Abstract</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Read Abstract</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveBibtexPub(pub)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors"
                      >
                        <Quote className="w-3.5 h-3.5 text-neutral-500" />
                        <span>BibTeX</span>
                      </button>

                      {pub.codeUrl && (
                        <a
                          href={pub.codeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors"
                        >
                          <Code className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Code Repository</span>
                        </a>
                      )}

                      {pub.pdfUrl && (
                        <a
                          href={pub.pdfUrl}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Paper PDF</span>
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setAdminTab('publications');
                        setIsAdminOpen(true);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-neutral-700 underline"
                    >
                      Edit Entry
                    </button>
                  </div>

                  {/* Expanded Abstract Card */}
                  {isExpanded && (
                    <div className="mt-3 p-4 bg-neutral-50 rounded border border-neutral-200/80 text-xs md:text-sm font-dm text-neutral-700 leading-relaxed space-y-2">
                      <span className="font-semibold text-neutral-900 block text-xs uppercase tracking-wider">
                        Abstract:
                      </span>
                      <p>{pub.abstract}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
