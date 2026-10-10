import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Settings, PenTool, Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';

export const AdminQuickBar: React.FC = () => {
  const { setIsAdminOpen, setAdminTab } = useSite();
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 no-print">
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 text-white text-xs font-dm font-medium rounded-full shadow-lg hover:bg-neutral-800 transition-all"
          title="Open Admin Quick Menu"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      ) : (
        <div className="bg-neutral-900/95 backdrop-blur-md text-white border border-neutral-700/80 rounded-lg shadow-xl p-2.5 flex items-center gap-2 text-xs font-dm">
          <div className="flex items-center gap-1.5 pr-2 border-r border-neutral-700 font-medium text-neutral-300">
            <Settings className="w-3.5 h-3.5 text-neutral-400" />
            <span>Edit</span>
          </div>

          <button
            onClick={() => {
              setAdminTab('profile');
              setIsAdminOpen(true);
            }}
            className="px-2 py-1 hover:bg-neutral-800 rounded text-neutral-200 hover:text-white transition-colors"
          >
            Biography & Info
          </button>

          <button
            onClick={() => {
              setAdminTab('research');
              setIsAdminOpen(true);
            }}
            className="px-2 py-1 hover:bg-neutral-800 rounded text-neutral-200 hover:text-white transition-colors"
          >
            Research Themes
          </button>

          <button
            onClick={() => {
              setAdminTab('publications');
              setIsAdminOpen(true);
            }}
            className="px-2 py-1 hover:bg-neutral-800 rounded text-neutral-200 hover:text-white transition-colors"
          >
            Publications
          </button>

          <button
            onClick={() => {
              setAdminTab('lab');
              setIsAdminOpen(true);
            }}
            className="px-2 py-1 hover:bg-neutral-800 rounded text-neutral-200 hover:text-white transition-colors"
          >
            Research Initiatives
          </button>

          <button
            onClick={() => {
              setIsAdminOpen(true);
            }}
            className="px-2.5 py-1 bg-white text-neutral-900 font-semibold rounded hover:bg-neutral-100 transition-colors ml-1"
          >
            All Settings
          </button>

          <button
            onClick={() => setMinimized(true)}
            className="p-1 text-neutral-400 hover:text-neutral-200 rounded ml-1"
            title="Minimize"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
