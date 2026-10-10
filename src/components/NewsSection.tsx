import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Post, PostCategory } from '../types';
import { Calendar, Clock, Pin, ArrowRight, Plus, Sparkles, Tag } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { siteData, setActivePost, setIsAdminOpen, setAdminTab } = useSite();
  const { posts } = siteData;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: { label: string; value: string }[] = [
    { label: 'All News', value: 'all' },
    { label: 'Talks & Keynotes', value: 'Talk' },
    { label: 'Grants & Funding', value: 'Grant' },
    { label: 'Paper Acceptances', value: 'Paper' },
    { label: 'Awards & Honors', value: 'Award' },
    { label: 'Announcements', value: 'Announcement' },
  ];

  const filteredPosts = posts.filter(
    (post) => selectedCategory === 'all' || post.category === selectedCategory
  );

  return (
    <section id="news" className="py-16 md:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-dm text-neutral-400 block mb-1">
              Dispatches & Laboratory Updates
            </span>
            <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-neutral-900 tracking-tight">
              05. Recent News, Talks & Lab Bulletins
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAdminTab('posts');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write New Post</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs (Segmented Buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 rounded-md mb-8 max-w-fit">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 text-xs font-dm font-medium rounded transition-colors whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="p-6 bg-white border border-neutral-200 rounded-md hover:border-neutral-400/80 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Meta Header: Category, Date, Pinned (Zero-pill text) */}
                <div className="flex items-center justify-between text-xs font-dm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-800 uppercase tracking-wider text-[11px]">
                      {post.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                  </div>
                  {post.pinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-700">
                      <Pin className="w-3 h-3 text-neutral-900" />
                      Pinned
                    </span>
                  )}
                </div>

                {/* Post Title */}
                <h3 className="text-base md:text-lg font-cormorant font-semibold text-neutral-900 leading-snug group-hover:text-neutral-700 transition-colors">
                  {post.title}
                </h3>

                {/* Summary / Excerpt */}
                <p className="text-xs md:text-sm font-dm text-neutral-600 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              {/* Footer: Read Time & Read More arrow */}
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-dm text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  {post.readTime}
                </span>
                <span className="inline-flex items-center gap-1 text-neutral-900 font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Quick Admin Callout */}
        <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-dm text-neutral-500">
          <span>Manage, pin, or publish new announcements directly in the Admin Dashboard.</span>
          <button
            onClick={() => {
              setAdminTab('posts');
              setIsAdminOpen(true);
            }}
            className="text-neutral-900 underline font-medium hover:text-neutral-700"
          >
            Open Post Manager
          </button>
        </div>
      </div>
    </section>
  );
};
