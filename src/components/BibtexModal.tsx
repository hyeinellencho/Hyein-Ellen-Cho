import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { X, Copy, Check, Download } from 'lucide-react';

export const BibtexModal: React.FC = () => {
  const { activeBibtexPub, setActiveBibtexPub } = useSite();
  const [copied, setCopied] = useState(false);

  if (!activeBibtexPub) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeBibtexPub.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([activeBibtexPub.bibtex], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeBibtexPub.id}.bib`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white border border-neutral-300 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-dm font-semibold text-neutral-900">
              BibTeX Citation
            </h3>
            <p className="text-xs font-dm text-neutral-500 truncate max-w-md">
              {activeBibtexPub.title}
            </p>
          </div>
          <button
            onClick={() => setActiveBibtexPub(null)}
            className="p-1 text-neutral-400 hover:text-neutral-900 rounded"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BibTeX Code content */}
        <div className="p-5 overflow-auto bg-neutral-900">
          <pre className="text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed select-all">
            {activeBibtexPub.bibtex}
          </pre>
        </div>

        {/* Actions */}
        <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-dm text-neutral-500">
            Venue: {activeBibtexPub.venue} ({activeBibtexPub.year})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Download .bib</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
