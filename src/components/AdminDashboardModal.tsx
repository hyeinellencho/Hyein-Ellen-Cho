import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Post, Publication, Course, ResearchProject, LabMember, PostCategory, PublicationType } from '../types';
import {
  X,
  FileText,
  BookOpen,
  User,
  GraduationCap,
  Users,
  Palette,
  Search,
  Database,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  Eye,
  ExternalLink,
  Share2,
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    siteData,
    isAdminOpen,
    setIsAdminOpen,
    adminTab,
    setAdminTab,
    updateProfile,
    addPost,
    updatePost,
    deletePost,
    addPublication,
    updatePublication,
    deletePublication,
    addCourse,
    updateCourse,
    deleteCourse,
    addProject,
    updateProject,
    deleteProject,
    addLabMember,
    updateLabMember,
    deleteLabMember,
    updateTheme,
    updateSeo,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  } = useSite();

  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Sub-states for editors ---
  // Post Editor state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<{
    title: string;
    category: PostCategory;
    date: string;
    summary: string;
    content: string;
    readTime: string;
    pinned: boolean;
  }>({
    title: '',
    category: 'Announcement',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    summary: '',
    content: '',
    readTime: '3 min read',
    pinned: false,
  });

  // Publication Editor state
  const [editingPubId, setEditingPubId] = useState<string | null>(null);
  const [pubForm, setPubForm] = useState<{
    title: string;
    authors: string;
    venue: string;
    year: number;
    type: PublicationType;
    doi: string;
    pdfUrl: string;
    codeUrl: string;
    award: string;
    abstract: string;
    bibtex: string;
    featured: boolean;
  }>({
    title: '',
    authors: 'Hyein Ellen Cho, ',
    venue: '',
    year: 2026,
    type: 'conference',
    doi: '',
    pdfUrl: '#',
    codeUrl: '',
    award: '',
    abstract: '',
    bibtex: '',
    featured: false,
  });

  // Profile Editor state
  const [profileForm, setProfileForm] = useState({ ...siteData.profile });

  // SEO Editor state
  const [seoForm, setSeoForm] = useState({ ...siteData.seo });

  // JSON Import state
  const [importJsonText, setImportJsonText] = useState('');

  if (!isAdminOpen) return null;

  // Handle post save
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title) return;

    if (editingPostId) {
      updatePost(editingPostId, postForm);
      showNotice('Post updated successfully');
      setEditingPostId(null);
    } else {
      addPost(postForm);
      showNotice('New post published successfully');
    }
    // reset form
    setPostForm({
      title: '',
      category: 'Announcement',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      summary: '',
      content: '',
      readTime: '3 min read',
      pinned: false,
    });
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      category: post.category,
      date: post.date,
      summary: post.summary,
      content: post.content,
      readTime: post.readTime,
      pinned: post.pinned,
    });
  };

  // Handle publication save
  const handleSavePub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.title) return;

    // Generate basic bibtex if empty
    const generatedBibtex =
      pubForm.bibtex.trim() ||
      `@inproceedings{cho${pubForm.year}${pubForm.title.split(' ')[0].toLowerCase()},\n  author = {${pubForm.authors}},\n  title = {${pubForm.title}},\n  booktitle = {${pubForm.venue}},\n  year = {${pubForm.year}}\n}`;

    const dataToSave = {
      ...pubForm,
      bibtex: generatedBibtex,
    };

    if (editingPubId) {
      updatePublication(editingPubId, dataToSave);
      showNotice('Publication updated');
      setEditingPubId(null);
    } else {
      addPublication(dataToSave);
      showNotice('Publication added');
    }

    setPubForm({
      title: '',
      authors: 'Hyein Ellen Cho, ',
      venue: '',
      year: 2026,
      type: 'conference',
      doi: '',
      pdfUrl: '#',
      codeUrl: '',
      award: '',
      abstract: '',
      bibtex: '',
      featured: false,
    });
  };

  const handleEditPub = (pub: Publication) => {
    setEditingPubId(pub.id);
    setPubForm({
      title: pub.title,
      authors: pub.authors,
      venue: pub.venue,
      year: pub.year,
      type: pub.type,
      doi: pub.doi || '',
      pdfUrl: pub.pdfUrl || '',
      codeUrl: pub.codeUrl || '',
      award: pub.award || '',
      abstract: pub.abstract,
      bibtex: pub.bibtex,
      featured: pub.featured,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    showNotice('Profile information saved');
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeo(seoForm);
    showNotice('SEO & Social metadata updated');
  };

  const handleExportJson = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hyein_academic_website_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showNotice('Configuration backup downloaded');
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJson(importJsonText);
    if (ok) {
      showNotice('Configuration imported successfully!');
      setImportJsonText('');
    } else {
      alert('Invalid JSON format. Please verify your backup file.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-5xl bg-white border border-neutral-300 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Bar */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-dm font-semibold tracking-tight">
              Website Management & Content Dashboard
            </h2>
            <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
              Prof. Hyein Ellen Cho
            </span>
          </div>

          <div className="flex items-center gap-3">
            {notification && (
              <span className="text-xs text-emerald-400 bg-neutral-800 px-2.5 py-1 rounded flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {notification}
              </span>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              aria-label="Close Admin Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="bg-neutral-100 border-b border-neutral-200 px-6 flex items-center gap-1 overflow-x-auto shrink-0 py-2">
          {[
            { id: 'publications', label: 'Publications', icon: BookOpen },
            { id: 'profile', label: 'Profile & Bio', icon: User },
            { id: 'lab', label: 'Lab & Research', icon: Users },
            { id: 'theme', label: 'Design & Theme', icon: Palette },
            { id: 'seo', label: 'SEO & Social', icon: Search },
            { id: 'backup', label: 'Backup / Reset', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium rounded transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-300/80'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* TAB 1: POSTS & NEWS MANAGER (게시글 작성·관리 시스템) */}
          {adminTab === 'posts' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                    {editingPostId ? 'Edit Academic Bulletin Post' : 'Create New Academic Post / Announcement'}
                  </h3>
                  <p className="text-xs font-dm text-neutral-500">
                    Easily publish lab bulletins, paper acceptances, grants, and invited keynote announcements.
                  </p>
                </div>
                {editingPostId && (
                  <button
                    onClick={() => {
                      setEditingPostId(null);
                      setPostForm({
                        title: '',
                        category: 'Announcement',
                        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        summary: '',
                        content: '',
                        readTime: '3 min read',
                        pinned: false,
                      });
                    }}
                    className="text-xs font-dm text-neutral-600 underline"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {/* Form to create/edit post */}
              <form onSubmit={handleSavePost} className="p-5 bg-neutral-50 border border-neutral-200 rounded-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Post Title *</label>
                    <input
                      type="text"
                      required
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      placeholder="e.g., Invited Keynote at ACM CHI 2026 on Collaborative AI"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Category *</label>
                    <select
                      value={postForm.category}
                      onChange={(e) => setPostForm({ ...postForm, category: e.target.value as PostCategory })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    >
                      <option value="Announcement">Announcement</option>
                      <option value="Paper">Paper Acceptance</option>
                      <option value="Grant">Grant / Funding</option>
                      <option value="Talk">Talk / Keynote</option>
                      <option value="Award">Award / Honor</option>
                      <option value="Media">Media / Press</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Date *</label>
                    <input
                      type="text"
                      required
                      value={postForm.date}
                      onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                      placeholder="October 10, 2026"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Read Time</label>
                    <input
                      type="text"
                      value={postForm.readTime}
                      onChange={(e) => setPostForm({ ...postForm, readTime: e.target.value })}
                      placeholder="3 min read"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-dm text-neutral-700">
                      <input
                        type="checkbox"
                        checked={postForm.pinned}
                        onChange={(e) => setPostForm({ ...postForm, pinned: e.target.checked })}
                        className="rounded border-neutral-300 text-neutral-900"
                      />
                      <span>Pin this post to the top</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">Summary / Excerpt *</label>
                  <textarea
                    rows={2}
                    required
                    value={postForm.summary}
                    onChange={(e) => setPostForm({ ...postForm, summary: e.target.value })}
                    placeholder="Short 1-2 sentence preview for the card list..."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">Full Post Body *</label>
                  <textarea
                    rows={5}
                    required
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    placeholder="Full article content. Separate paragraphs with double enter..."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingPostId ? 'Update Post' : 'Publish Post'}</span>
                </button>
              </form>

              {/* Existing Posts Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-dm font-semibold text-neutral-900 uppercase tracking-wider">
                  Existing Posts ({siteData.posts.length})
                </h4>

                <div className="border border-neutral-200 rounded-md overflow-hidden">
                  <table className="w-full text-xs font-dm text-left">
                    <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold">
                      <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {siteData.posts.map((post) => (
                        <tr key={post.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-medium text-neutral-900 max-w-xs truncate">
                            {post.pinned && <span className="mr-1 text-neutral-400 font-bold">[Pinned]</span>}
                            {post.title}
                          </td>
                          <td className="p-3 text-neutral-600">{post.category}</td>
                          <td className="p-3 text-neutral-500 whitespace-nowrap">{post.date}</td>
                          <td className="p-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="text-neutral-600 hover:text-neutral-900 underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete post "${post.title}"?`)) {
                                  deletePost(post.id);
                                  showNotice('Post deleted');
                                }
                              }}
                              className="text-red-600 hover:text-red-800 underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PUBLICATIONS MANAGER */}
          {adminTab === 'publications' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                    {editingPubId ? 'Edit Academic Publication' : 'Add Research Publication'}
                  </h3>
                  <p className="text-xs font-dm text-neutral-500">
                    Manage papers, conference proceedings, preprints, BibTeX entries, and PDF links.
                  </p>
                </div>
                {editingPubId && (
                  <button
                    onClick={() => {
                      setEditingPubId(null);
                      setPubForm({
                        title: '',
                        authors: 'Hyein Ellen Cho, ',
                        venue: '',
                        year: 2026,
                        type: 'conference',
                        doi: '',
                        pdfUrl: '#',
                        codeUrl: '',
                        award: '',
                        abstract: '',
                        bibtex: '',
                        featured: false,
                      });
                    }}
                    className="text-xs font-dm text-neutral-600 underline"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {/* Publication Form */}
              <form onSubmit={handleSavePub} className="p-5 bg-neutral-50 border border-neutral-200 rounded-md space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">Paper Title *</label>
                  <input
                    type="text"
                    required
                    value={pubForm.title}
                    onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                    placeholder="e.g. Adaptive Cognitive Hand-offs in Human-Large Language Model Problem Solving"
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">Authors *</label>
                  <input
                    type="text"
                    required
                    value={pubForm.authors}
                    onChange={(e) => setPubForm({ ...pubForm, authors: e.target.value })}
                    placeholder="Hyein Ellen Cho, Sarah Chen, Julian Vance..."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Venue / Conference *</label>
                    <input
                      type="text"
                      required
                      value={pubForm.venue}
                      onChange={(e) => setPubForm({ ...pubForm, venue: e.target.value })}
                      placeholder="ACM CHI 2026"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Year *</label>
                    <input
                      type="number"
                      required
                      value={pubForm.year}
                      onChange={(e) => setPubForm({ ...pubForm, year: parseInt(e.target.value) || 2026 })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Type *</label>
                    <select
                      value={pubForm.type}
                      onChange={(e) => setPubForm({ ...pubForm, type: e.target.value as PublicationType })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    >
                      <option value="conference">Conference Paper</option>
                      <option value="journal">Journal Article</option>
                      <option value="preprint">Preprint (arXiv)</option>
                      <option value="book_chapter">Book Chapter / Monograph</option>
                      <option value="workshop">Workshop</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">DOI</label>
                    <input
                      type="text"
                      value={pubForm.doi}
                      onChange={(e) => setPubForm({ ...pubForm, doi: e.target.value })}
                      placeholder="10.1145/3613904.3642109"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Award (Optional)</label>
                    <input
                      type="text"
                      value={pubForm.award}
                      onChange={(e) => setPubForm({ ...pubForm, award: e.target.value })}
                      placeholder="e.g. Best Paper Award"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Code URL</label>
                    <input
                      type="text"
                      value={pubForm.codeUrl}
                      onChange={(e) => setPubForm({ ...pubForm, codeUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">Abstract *</label>
                  <textarea
                    rows={3}
                    required
                    value={pubForm.abstract}
                    onChange={(e) => setPubForm({ ...pubForm, abstract: e.target.value })}
                    placeholder="Full scientific abstract..."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">BibTeX Entry</label>
                  <textarea
                    rows={4}
                    value={pubForm.bibtex}
                    onChange={(e) => setPubForm({ ...pubForm, bibtex: e.target.value })}
                    placeholder="@inproceedings{... (auto-generated if left blank)"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingPubId ? 'Update Publication' : 'Add Publication'}</span>
                </button>
              </form>

              {/* Publications List */}
              <div className="space-y-3">
                <h4 className="text-sm font-dm font-semibold text-neutral-900 uppercase tracking-wider">
                  Current Publications ({siteData.publications.length})
                </h4>
                <div className="border border-neutral-200 rounded-md divide-y divide-neutral-100">
                  {siteData.publications.map((pub) => (
                    <div key={pub.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50">
                      <div className="space-y-0.5 max-w-2xl">
                        <div className="text-xs font-dm font-semibold text-neutral-900 truncate">
                          [{pub.year}] {pub.title}
                        </div>
                        <div className="text-[11px] font-dm text-neutral-500">
                          {pub.venue} · {pub.authors}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditPub(pub)}
                          className="text-xs text-neutral-600 hover:text-neutral-900 underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete publication "${pub.title}"?`)) {
                              deletePublication(pub.id);
                              showNotice('Publication deleted');
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-800 underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE & BIO CUSTOMIZER */}
          {adminTab === 'profile' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                  Professor Profile & Academic Biography
                </h3>
                <p className="text-xs font-dm text-neutral-500">
                  Update your official title, bio, contact details, and portrait photo path.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Pronouns</label>
                    <input
                      type="text"
                      value={profileForm.pronouns}
                      onChange={(e) => setProfileForm({ ...profileForm, pronouns: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Primary Title</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Secondary Title / Lab Role</label>
                    <input
                      type="text"
                      value={profileForm.secondaryTitle}
                      onChange={(e) => setProfileForm({ ...profileForm, secondaryTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Institution / University</label>
                    <input
                      type="text"
                      value={profileForm.institution}
                      onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Department & Affiliations</label>
                    <input
                      type="text"
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Office Location</label>
                    <input
                      type="text"
                      value={profileForm.office}
                      onChange={(e) => setProfileForm({ ...profileForm, office: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Office Hours</label>
                    <input
                      type="text"
                      value={profileForm.officeHours}
                      onChange={(e) => setProfileForm({ ...profileForm, officeHours: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Primary Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Academic Notice Ribbon Text</label>
                    <input
                      type="text"
                      value={profileForm.statusBadge}
                      onChange={(e) => setProfileForm({ ...profileForm, statusBadge: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Portrait Image URL / Path</label>
                    <input
                      type="text"
                      value={profileForm.avatarUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">
                      Formspree Contact Endpoint URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.formspreeEndpoint || 'https://formspree.io/f/xyekjebq'}
                      onChange={(e) => setProfileForm({ ...profileForm, formspreeEndpoint: e.target.value })}
                      placeholder="https://formspree.io/f/xyekjebq"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none font-mono text-[11px]"
                    />
                    <span className="text-[10px] text-neutral-500 block">
                      All inquiries from the Contact form are collected at this Formspree URL.
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">Lead Bio Statement</label>
                  <textarea
                    rows={3}
                    value={profileForm.bioLead}
                    onChange={(e) => setProfileForm({ ...profileForm, bioLead: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Updates</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: COURSES MANAGER */}
          {adminTab === 'teaching' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                  Course Offerings & Teaching
                </h3>
                <p className="text-xs font-dm text-neutral-500">
                  Update current courses, syllabus links, and classroom times.
                </p>
              </div>

              <div className="space-y-4">
                {siteData.courses.map((course) => (
                  <div key={course.id} className="p-4 border border-neutral-200 rounded-md bg-neutral-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm font-dm text-neutral-900">{course.code}: {course.title}</span>
                      <button
                        onClick={() => {
                          if (confirm(`Remove course ${course.code}?`)) {
                            deleteCourse(course.id);
                            showNotice('Course deleted');
                          }
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-dm text-neutral-600">
                      <div>Term: {course.term}</div>
                      <div>Level: {course.level}</div>
                      <div>Schedule: {course.schedule}</div>
                      <div>Location: {course.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LAB & TEAM MANAGER */}
          {adminTab === 'lab' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                  CollabAI Research Group & Laboratory
                </h3>
                <p className="text-xs font-dm text-neutral-500">
                  Manage lab personnel, alumni, and ongoing research initiatives.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-dm uppercase font-semibold text-neutral-700">Team Members ({siteData.labMembers.length})</h4>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded">
                  {siteData.labMembers.map((member) => (
                    <div key={member.id} className="p-3 flex items-center justify-between text-xs font-dm">
                      <div>
                        <strong className="text-neutral-900">{member.name}</strong> ({member.role})
                        <div className="text-neutral-500">{member.topic}</div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${member.name}?`)) {
                            deleteLabMember(member.id);
                            showNotice('Member removed');
                          }
                        }}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DESIGN, THEME & FONT CUSTOMIZER (자유로운 커스터마이징) */}
          {adminTab === 'theme' && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                  Visual Theme, Typography & Grayscale Customizer
                </h3>
                <p className="text-xs font-dm text-neutral-500">
                  Refine the aesthetic tone of the website. Clean white canvas with nuanced gray accents.
                </p>
              </div>

              {/* Font Pairing Selection */}
              <div className="space-y-3">
                <label className="text-xs font-dm uppercase tracking-wider font-semibold text-neutral-800 block">
                  Typography Pairing:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'cormorant',
                      title: 'Editorial Monograph (Default)',
                      desc: 'Cormorant Garamond (Serif) + DM Sans (Prose)',
                      preview: 'Hyein Ellen Cho, Ph.D.',
                    },
                    {
                      id: 'playfair',
                      title: 'Classical Academic',
                      desc: 'Playfair Display + DM Sans',
                      preview: 'Hyein Ellen Cho, Ph.D.',
                    },
                    {
                      id: 'jakarta',
                      title: 'Contemporary Sans',
                      desc: 'Plus Jakarta Sans + Clean Sans',
                      preview: 'Hyein Ellen Cho, Ph.D.',
                    },
                  ].map((fontOpt) => (
                    <div
                      key={fontOpt.id}
                      onClick={() => {
                        updateTheme({ fontPairing: fontOpt.id as any });
                        showNotice(`Applied font pairing: ${fontOpt.title}`);
                      }}
                      className={`p-4 border rounded-md cursor-pointer transition-all ${
                        siteData.theme.fontPairing === fontOpt.id
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="text-sm font-semibold text-neutral-900 mb-1">{fontOpt.title}</div>
                      <div className="text-xs text-neutral-500 mb-2">{fontOpt.desc}</div>
                      <div className="text-base text-neutral-800 italic">{fontOpt.preview}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accent Grayscale Nuance */}
              <div className="space-y-3">
                <label className="text-xs font-dm uppercase tracking-wider font-semibold text-neutral-800 block">
                  Accent Gray Palette (포인트 컬러는 회색):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'neutral', name: 'Refined Charcoal', hex: '#171717', sampleBg: 'bg-neutral-900' },
                    { id: 'slate', name: 'Modern Slate', hex: '#1e293b', sampleBg: 'bg-slate-800' },
                    { id: 'zinc', name: 'Studio Zinc', hex: '#27272a', sampleBg: 'bg-zinc-800' },
                    { id: 'stone', name: 'Warm Ash', hex: '#292524', sampleBg: 'bg-stone-800' },
                  ].map((grayOpt) => (
                    <div
                      key={grayOpt.id}
                      onClick={() => {
                        updateTheme({ grayPalette: grayOpt.id as any, accentGrayscale: grayOpt.hex });
                        showNotice(`Applied gray palette: ${grayOpt.name}`);
                      }}
                      className={`p-3 border rounded-md cursor-pointer transition-all flex items-center gap-3 ${
                        siteData.theme.grayPalette === grayOpt.id
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded ${grayOpt.sampleBg} shrink-0`} />
                      <div>
                        <div className="text-xs font-dm font-semibold text-neutral-900">{grayOpt.name}</div>
                        <div className="text-[11px] font-mono text-neutral-400">{grayOpt.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Background & Surface Discipline */}
              <div className="p-4 bg-neutral-50 rounded border border-neutral-200 text-xs font-dm text-neutral-600 space-y-1">
                <span className="font-semibold text-neutral-900 block">Aesthetic Discipline:</span>
                <p>Pure white background canvas (`#ffffff`) with 1px hairline structural dividers and high-legibility dark ink typography. Complies strictly with zero-pill metadata and WCAG AA contrast standards.</p>
              </div>
            </div>
          )}

          {/* TAB 7: SEO TOOLS & SOCIAL MEDIA INTEGRATION (SEO 도구, 소셜 미디어 연동) */}
          {adminTab === 'seo' && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                  SEO Optimization & Academic Social Integrations
                </h3>
                <p className="text-xs font-dm text-neutral-500">
                  Configure search engine metadata, Google Scholar indexing, ORCID, and OpenGraph social cards.
                </p>
              </div>

              <form onSubmit={handleSaveSeo} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">HTML Meta Title</label>
                  <input
                    type="text"
                    value={seoForm.metaTitle}
                    onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">HTML Meta Description</label>
                  <textarea
                    rows={2}
                    value={seoForm.metaDescription}
                    onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">Keywords (Comma-separated)</label>
                  <input
                    type="text"
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">ORCID ID</label>
                    <input
                      type="text"
                      value={seoForm.orcidId}
                      onChange={(e) => setSeoForm({ ...seoForm, orcidId: e.target.value })}
                      placeholder="0000-0002-1825-0097"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">DBLP Profile URL</label>
                    <input
                      type="text"
                      value={seoForm.dblpUrl}
                      onChange={(e) => setSeoForm({ ...seoForm, dblpUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">GitHub Organization / Profile</label>
                    <input
                      type="text"
                      value={seoForm.githubUrl}
                      onChange={(e) => setSeoForm({ ...seoForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Twitter / X Handle</label>
                    <input
                      type="text"
                      value={seoForm.twitterHandle}
                      onChange={(e) => setSeoForm({ ...seoForm, twitterHandle: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save SEO & Social Settings</span>
                </button>
              </form>

              {/* Live Google Search Results Snippet Simulator */}
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <h4 className="text-xs font-dm uppercase tracking-wider font-semibold text-neutral-800">
                  Live Google Search Snippet Preview:
                </h4>
                <div className="p-4 bg-white border border-neutral-200 rounded-md font-sans max-w-xl shadow-xs">
                  <div className="text-[11px] text-neutral-600 flex items-center gap-1.5 mb-0.5">
                    <span className="text-neutral-800 font-medium">stanford.edu</span>
                    <span className="text-neutral-400">› hyeincho</span>
                  </div>
                  <div className="text-base text-blue-800 hover:underline cursor-pointer font-medium leading-snug">
                    {seoForm.metaTitle || 'Hyein Ellen Cho, Ph.D. — Associate Professor'}
                  </div>
                  <div className="text-xs text-neutral-600 leading-relaxed mt-1">
                    {seoForm.metaDescription || 'Official academic portfolio of Prof. Hyein Ellen Cho...'}
                  </div>
                </div>
              </div>

              {/* JSON-LD Academic Structured Data Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-dm uppercase tracking-wider font-semibold text-neutral-800">
                  Schema.org JSON-LD Structured Data:
                </h4>
                <pre className="p-3 bg-neutral-900 text-neutral-300 text-[11px] font-mono rounded overflow-x-auto">
{JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteData.profile.name,
    jobTitle: siteData.profile.title,
    worksFor: {
      '@type': 'CollegeOrUniversity',
      name: siteData.profile.institution,
    },
    url: siteData.seo.canonicalUrl,
    sameAs: [
      `https://orcid.org/${siteData.seo.orcidId}`,
      siteData.seo.dblpUrl,
      siteData.seo.githubUrl,
    ],
  },
  null,
  2
)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 8: BACKUP, RESTORE & SAMPLE DATA RESET */}
          {adminTab === 'backup' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                  Data Backup, Import & Sample Content Reset
                </h3>
                <p className="text-xs font-dm text-neutral-500">
                  All changes are automatically saved to your browser. You can export a JSON backup file or restore default sample data at any time.
                </p>
              </div>

              <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-md space-y-4">
                <h4 className="text-xs font-dm font-semibold text-neutral-900 uppercase tracking-wider">
                  Export Website Data Backup
                </h4>
                <p className="text-xs font-dm text-neutral-600">
                  Download a complete JSON snapshot containing all publications, posts, bio, courses, and design settings.
                </p>
                <button
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-neutral-800 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Download Backup JSON File</span>
                </button>
              </div>

              <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-md space-y-3">
                <h4 className="text-xs font-dm font-semibold text-neutral-900 uppercase tracking-wider">
                  Restore from JSON Backup
                </h4>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste JSON backup text here..."
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                />
                <button
                  onClick={handleImportJson}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-neutral-800 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Import JSON Data</span>
                </button>
              </div>

              <div className="p-5 bg-red-50/50 border border-red-200 rounded-md space-y-3">
                <h4 className="text-xs font-dm font-semibold text-red-900 uppercase tracking-wider">
                  Reset to Default Sample Content
                </h4>
                <p className="text-xs font-dm text-red-700 leading-relaxed">
                  Revert all posts, publications, lab members, and theme options back to the rich default sample data for Prof. Hyein Ellen Cho.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to restore default sample content? All custom edits will be reset.')) {
                      resetToDefaults();
                      showNotice('Restored to default rich sample content');
                      setIsAdminOpen(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-red-700 bg-white border border-red-300 rounded hover:bg-red-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All to Default Sample Data</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Footer */}
        <div className="px-6 py-3.5 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs font-dm text-neutral-600 shrink-0">
          <span>
            Changes take effect immediately on your academic portfolio.
          </span>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-4 py-1.5 font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
          >
            Done & View Website
          </button>
        </div>
      </div>
    </div>
  );
};
