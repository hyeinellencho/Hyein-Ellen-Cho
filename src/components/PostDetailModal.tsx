import React from 'react';
import { useSite } from '../context/SiteContext';
import { X, Calendar, Clock, Pin, Share2, ArrowLeft } from 'lucide-react';

export const PostDetailModal: React.FC = () => {
  const { activePost, setActivePost } = useSite();

  if (!activePost) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white border border-neutral-300 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2 text-xs font-dm text-neutral-500">
            <span className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
              {activePost.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{activePost.date}</span>
            <span aria-hidden="true">·</span>
            <span>{activePost.readTime}</span>
          </div>
          <button
            onClick={() => setActivePost(null)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
            aria-label="Close post"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="space-y-3">
            {activePost.pinned && (
              <span className="inline-flex items-center gap-1 text-xs font-dm font-semibold text-neutral-700">
                <Pin className="w-3.5 h-3.5" />
                Featured Bulletin
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-cormorant font-semibold text-neutral-900 leading-snug">
              {activePost.title}
            </h2>
            <p className="text-sm font-dm text-neutral-500 italic pb-2 border-b border-neutral-100">
              {activePost.summary}
            </p>
          </div>

          <div className="prose prose-neutral font-dm text-neutral-800 leading-relaxed text-sm md:text-base space-y-4">
            {activePost.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-200 flex items-center justify-between text-xs font-dm text-neutral-500">
            <span>Published by CollabAI Lab · Monash University</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Article URL copied to clipboard');
              }}
              className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 underline"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={() => setActivePost(null)}
            className="px-4 py-1.5 text-xs font-dm font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
