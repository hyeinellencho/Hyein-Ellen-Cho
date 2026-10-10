import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Post, Publication, Course, ResearchProject, LabMember, PostCategory, PublicationType, ResearchInterest } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
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
  Lightbulb,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    siteData,
    isAdminOpen,
    setIsAdminOpen,
    adminTab,
    setAdminTab,
    updateProfile,
    addResearchInterest,
    updateResearchInterest,
    deleteResearchInterest,
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
    activeEditingProjectId,
    setActiveEditingProjectId,
  } = useSite();

  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Sub-states for editors ---
  // Post Editor state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [confirmDeletePostId, setConfirmDeletePostId] = useState<string | null>(null);
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
  const [confirmDeletePubId, setConfirmDeletePubId] = useState<string | null>(null);
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
    type: 'journal',
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
  const [primaryInterestsText, setPrimaryInterestsText] = useState(
    (siteData.profile.primaryInterests || []).join(', ')
  );
  const [bioParagraphsText, setBioParagraphsText] = useState(
    (siteData.profile.bioParagraphs || []).join('\n\n')
  );
  const [affiliationsText, setAffiliationsText] = useState(
    (siteData.profile.affiliations || []).join('\n')
  );
  const [prospectiveNoteText, setProspectiveNoteText] = useState(
    siteData.profile.prospectiveStudentsNote || ''
  );

  useEffect(() => {
    setProfileForm({ ...siteData.profile });
    setPrimaryInterestsText((siteData.profile.primaryInterests || []).join(', '));
    setBioParagraphsText((siteData.profile.bioParagraphs || []).join('\n\n'));
    setAffiliationsText((siteData.profile.affiliations || []).join('\n'));
    setProspectiveNoteText(siteData.profile.prospectiveStudentsNote || '');
  }, [siteData.profile, isAdminOpen]);

  // Core Research Themes Editor state
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [confirmDeleteThemeId, setConfirmDeleteThemeId] = useState<string | null>(null);
  const [themeForm, setThemeForm] = useState<{
    title: string;
    description: string;
    keywordsText: string;
  }>({
    title: '',
    description: '',
    keywordsText: '',
  });

  const handleEditTheme = (item: ResearchInterest) => {
    setEditingThemeId(item.id);
    setConfirmDeleteThemeId(null);
    setThemeForm({
      title: item.title,
      description: item.description,
      keywordsText: item.keywords.join(', '),
    });
  };

  const handleCancelThemeEdit = () => {
    setEditingThemeId(null);
    setConfirmDeleteThemeId(null);
    setThemeForm({
      title: '',
      description: '',
      keywordsText: '',
    });
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeForm.title.trim()) return;

    const keywords = themeForm.keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    if (editingThemeId) {
      updateResearchInterest(editingThemeId, {
        title: themeForm.title.trim(),
        description: themeForm.description.trim(),
        keywords,
      });
      showNotice('Research theme updated');
      setEditingThemeId(null);
    } else {
      addResearchInterest({
        title: themeForm.title.trim(),
        description: themeForm.description.trim(),
        keywords,
      });
      showNotice('New research theme added');
    }

    setThemeForm({
      title: '',
      description: '',
      keywordsText: '',
    });
  };

  // Project Editor state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<{
    title: string;
    kicker: string;
    timeframe: string;
    funding: string;
    summary: string;
    fullDescription: string;
    collaborators: string;
    status: 'Active' | 'Completed';
    imageUrl: string;
    externalUrl: string;
  }>({
    title: '',
    kicker: '',
    timeframe: '',
    funding: '',
    summary: '',
    fullDescription: '',
    collaborators: '',
    status: 'Active',
    imageUrl: '',
    externalUrl: '',
  });

  // Automatically activate project editing when triggered from page
  useEffect(() => {
    if (activeEditingProjectId) {
      const target = siteData.projects.find((p) => p.id === activeEditingProjectId);
      if (target) {
        handleEditProject(target);
      }
    }
  }, [activeEditingProjectId, siteData.projects]);

  const handleEditProject = (proj: ResearchProject) => {
    setEditingProjectId(proj.id);
    setConfirmDeleteProjectId(null);
    setProjectForm({
      title: proj.title,
      kicker: proj.kicker || '',
      timeframe: proj.timeframe || '',
      funding: proj.funding || '',
      summary: proj.summary || '',
      fullDescription: proj.fullDescription || '',
      collaborators: proj.collaborators || '',
      status: proj.status || 'Active',
      imageUrl: proj.imageUrl || '',
      externalUrl: proj.externalUrl || '',
    });
  };

  const handleCancelProjectEdit = () => {
    setEditingProjectId(null);
    setActiveEditingProjectId(null);
    setConfirmDeleteProjectId(null);
    setProjectForm({
      title: '',
      kicker: '',
      timeframe: '',
      funding: '',
      summary: '',
      fullDescription: '',
      collaborators: '',
      status: 'Active',
      imageUrl: '',
      externalUrl: '',
    });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    if (editingProjectId) {
      updateProject(editingProjectId, projectForm);
      showNotice('Project updated successfully');
      setEditingProjectId(null);
      setActiveEditingProjectId(null);
    } else {
      addProject(projectForm);
      showNotice('New project added successfully');
    }

    setConfirmDeleteProjectId(null);
    setProjectForm({
      title: '',
      kicker: '',
      timeframe: '',
      funding: '',
      summary: '',
      fullDescription: '',
      collaborators: '',
      status: 'Active',
      imageUrl: '',
      externalUrl: '',
    });
  };

  const handleDeleteProjectConfirmed = (id: string) => {
    deleteProject(id);
    if (editingProjectId === id) {
      handleCancelProjectEdit();
    }
    setConfirmDeleteProjectId(null);
    showNotice('Project deleted successfully');
  };

  // Lab Member / PhD Research Topic Editor state
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [confirmDeleteMemberId, setConfirmDeleteMemberId] = useState<string | null>(null);
  const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState<string | null>(null);
  const [confirmResetDefaults, setConfirmResetDefaults] = useState<boolean>(false);
  const [memberForm, setMemberForm] = useState<{
    name: string;
    role: string;
    topic: string;
    coSupervisors: string;
    websiteUrl: string;
    scholarUrl: string;
  }>({
    name: '',
    role: 'PhD Research',
    topic: '',
    coSupervisors: '',
    websiteUrl: '',
    scholarUrl: '',
  });

  const handleEditMember = (member: LabMember) => {
    setEditingMemberId(member.id);
    setConfirmDeleteMemberId(null);
    setMemberForm({
      name: member.topic || member.name,
      role: member.role || 'PhD Research',
      topic: member.topic || member.name,
      coSupervisors: member.coSupervisors || '',
      websiteUrl: member.websiteUrl || '',
      scholarUrl: member.scholarUrl || '',
    });
  };

  const handleCancelMemberEdit = () => {
    setEditingMemberId(null);
    setConfirmDeleteMemberId(null);
    setMemberForm({
      name: '',
      role: 'PhD Research',
      topic: '',
      coSupervisors: '',
      websiteUrl: '',
      scholarUrl: '',
    });
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    const topicText = memberForm.topic.trim() || memberForm.name.trim();
    if (!topicText) return;

    const dataToSave = {
      ...memberForm,
      name: topicText,
      topic: topicText,
    };

    if (editingMemberId) {
      updateLabMember(editingMemberId, dataToSave);
      showNotice('PhD research topic updated successfully');
      setEditingMemberId(null);
    } else {
      addLabMember(dataToSave);
      showNotice('New PhD research topic added successfully');
    }

    setMemberForm({
      name: '',
      role: 'PhD Research',
      topic: '',
      coSupervisors: '',
      websiteUrl: '',
      scholarUrl: '',
    });
  };

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
    const primaryInterests = primaryInterestsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const bioParagraphs = bioParagraphsText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const affiliations = affiliationsText
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);

    updateProfile({
      ...profileForm,
      officeHours: '',
      primaryInterests,
      bioParagraphs: bioParagraphs.length > 0 ? bioParagraphs : profileForm.bioParagraphs,
      affiliations,
      prospectiveStudentsNote: prospectiveNoteText.trim(),
    });
    showNotice('Profile, biography & settings saved successfully');
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
            { id: 'research', label: 'Research Themes', icon: Lightbulb },
            { id: 'lab', label: 'Research Initiatives & Team', icon: Users },
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
                            {confirmDeletePostId === post.id ? (
                              <span className="inline-flex items-center gap-1.5 p-1 bg-red-50 border border-red-200 rounded">
                                <span className="text-[11px] font-dm text-red-700 font-medium">Delete?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deletePost(post.id);
                                    setConfirmDeletePostId(null);
                                    showNotice('Post deleted');
                                  }}
                                  className="px-1.5 py-0.5 text-[11px] font-dm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeletePostId(null)}
                                  className="px-1.5 py-0.5 text-[11px] font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                                >
                                  No
                                </button>
                              </span>
                            ) : (
                              <button
                                onClick={() => setConfirmDeletePostId(post.id)}
                                className="text-red-600 hover:text-red-800 underline"
                              >
                                Delete
                              </button>
                            )}
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
                        type: 'journal',
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
                    placeholder="e.g. Navigating faith and gender-based violence: the role of faith communities in addressing family violence"
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
                    placeholder="Hyein Ellen Cho, Leah Gerber, Jim Hlavac..."
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
                      <option value="journal">Journal Article</option>
                      <option value="book_chapter">Book Chapter / Monograph</option>
                      <option value="report">Policy & Research Report</option>
                      <option value="oped">Op-ed / Public Commentary</option>
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
                        {confirmDeletePubId === pub.id ? (
                          <div className="inline-flex items-center gap-1.5 p-1 bg-red-50 border border-red-200 rounded">
                            <span className="text-[11px] font-dm text-red-700 font-medium">Delete?</span>
                            <button
                              type="button"
                              onClick={() => {
                                deletePublication(pub.id);
                                setConfirmDeletePubId(null);
                                showNotice('Publication deleted');
                              }}
                              className="px-2 py-0.5 text-[11px] font-dm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePubId(null)}
                              className="px-2 py-0.5 text-[11px] font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeletePubId(pub.id)}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                          >
                            Delete
                          </button>
                        )}
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
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Primary Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">Postal Address</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="Postal address..."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                {/* Primary Research Focus Tags */}
                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">
                    Primary Research Focus Tags (displayed on top Hero)
                  </label>
                  <input
                    type="text"
                    value={primaryInterestsText}
                    onChange={(e) => setPrimaryInterestsText(e.target.value)}
                    placeholder="Gender-based violence, Migration, Social justice, Korean diaspora, Qualitative research"
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 block">
                    Comma-separated keywords displayed under your titles in the Hero section.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Portrait Image URL / Path</label>
                      <label className="text-[11px] font-dm text-neutral-600 hover:text-neutral-900 underline cursor-pointer">
                        Upload File (사진 업로드)
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImageFile(file, 500, 0.8);
                                setProfileForm((prev) => ({ ...prev, avatarUrl: compressed }));
                                showNotice('Portrait photo uploaded & optimized');
                              } catch (err) {
                                console.error('Image compression failed:', err);
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') {
                                    setProfileForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
                                    showNotice('Portrait photo uploaded');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={profileForm.avatarUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">
                      Formspree Contact Endpoint URL (이메일 수신 연동)
                    </label>
                    <input
                      type="url"
                      value={profileForm.formspreeEndpoint || 'https://formspree.io/f/xyekjebq'}
                      onChange={(e) => setProfileForm({ ...profileForm, formspreeEndpoint: e.target.value })}
                      placeholder="https://formspree.io/f/xyekjebq"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none font-mono text-[11px]"
                    />
                    <span className="text-[10px] text-neutral-500 block leading-normal">
                      방문자가 Contact Form을 작성하면 이 URL을 통해 교수님의 이메일함으로 실시간 전달됩니다. (formspree.io 가입 후 본인 전용 폼 주소를 입력하시면 바로 연결됩니다)
                    </span>
                  </div>
                </div>

                {/* Hero Lead Introduction */}
                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">
                    Introduction Lead Paragraph (상단 메인 소개글 - Hero Bio Lead)
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bioLead || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, bioLead: e.target.value })}
                    placeholder="Enter your introductory bio paragraph displayed prominently at the top of the homepage..."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none leading-relaxed"
                  />
                  <span className="text-[11px] text-neutral-500 block">
                    홈페이지 최상단(Hero) 이름 바로 아래에 굵직하게 표시되는 핵심 연구 및 소개 문장입니다. 원하는 문구로 자유롭게 직접 수정하실 수 있습니다.
                  </span>
                </div>

                {/* Full Biography Paragraphs */}
                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">
                    Full Biography Paragraphs (본문 전체 내용)
                  </label>
                  <textarea
                    rows={6}
                    value={bioParagraphsText}
                    onChange={(e) => setBioParagraphsText(e.target.value)}
                    placeholder="Enter paragraphs separated by empty lines..."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none leading-relaxed"
                  />
                  <span className="text-[11px] text-neutral-500 block">
                    Separate each paragraph with an empty line. Each paragraph is rendered in the Biography section.
                  </span>
                </div>

                {/* Key Academic Affiliations */}
                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">
                    Key Academic Affiliations (주요 소속 및 직책)
                  </label>
                  <textarea
                    rows={3}
                    value={affiliationsText}
                    onChange={(e) => setAffiliationsText(e.target.value)}
                    placeholder="Monash University Department of Computer Science (Associate Professor)&#10;Australian Research Council (ARC) Discovery Project Investigator"
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 block">
                    Enter one affiliation per line.
                  </span>
                </div>

                {/* Note for Prospective Students */}
                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">
                    Note for Prospective Ph.D. Applicants & Postdoctoral Fellows
                  </label>
                  <textarea
                    rows={2}
                    value={prospectiveNoteText}
                    onChange={(e) => setProspectiveNoteText(e.target.value)}
                    placeholder="Please note that I am not accepting any research students until 2028."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile & Biography Updates</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB: CORE RESEARCH THEMES MANAGER */}
          {adminTab === 'research' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                  Core Research Themes & Pillars
                </h3>
                <p className="text-xs font-dm text-neutral-500">
                  Add, edit, or remove the core research pillars displayed next to your Biography.
                </p>
              </div>

              {/* Form to Add or Edit Research Theme */}
              <form onSubmit={handleSaveTheme} className="p-5 bg-neutral-50 border border-neutral-200 rounded-md space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-dm font-semibold text-neutral-800 uppercase tracking-wider">
                    {editingThemeId ? 'Edit Research Theme' : 'Add New Research Theme'}
                  </h4>
                  {editingThemeId && (
                    <button
                      type="button"
                      onClick={handleCancelThemeEdit}
                      className="text-xs font-dm text-neutral-600 underline"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">
                    Theme Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={themeForm.title}
                    onChange={(e) => setThemeForm({ ...themeForm, title: e.target.value })}
                    placeholder="e.g. Human-AI Collaboration & Mixed-Initiative Systems"
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={themeForm.description}
                    onChange={(e) => setThemeForm({ ...themeForm, description: e.target.value })}
                    placeholder="Brief explanation of this research pillar and inquiry questions..."
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-dm font-medium text-neutral-700 block">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={themeForm.keywordsText}
                    onChange={(e) => setThemeForm({ ...themeForm, keywordsText: e.target.value })}
                    placeholder="e.g. Interaction Paradigms, Cognitive Ergonomics, Shared Mental Models"
                    className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 block">
                    Separate multiple keywords with commas (,).
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                  >
                    {editingThemeId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{editingThemeId ? 'Update Research Theme' : 'Add Research Theme'}</span>
                  </button>
                  {editingThemeId && (
                    <button
                      type="button"
                      onClick={handleCancelThemeEdit}
                      className="px-3 py-2 text-xs font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {editingThemeId && (
                    confirmDeleteThemeId === editingThemeId ? (
                      <div className="ml-auto inline-flex items-center gap-2 p-1.5 bg-red-50 border border-red-200 rounded">
                        <span className="text-xs font-dm text-red-700 font-medium px-1">Really delete theme?</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteResearchInterest(editingThemeId);
                            handleCancelThemeEdit();
                            showNotice('Research theme deleted');
                          }}
                          className="px-2.5 py-1 text-xs font-dm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteThemeId(null)}
                          className="px-2 py-1 text-xs font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteThemeId(editingThemeId)}
                        className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 text-xs font-dm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete This Theme</span>
                      </button>
                    )
                  )}
                </div>
              </form>

              {/* Existing Themes List */}
              <div className="space-y-3">
                <h4 className="text-xs font-dm uppercase tracking-wider font-semibold text-neutral-800">
                  Current Research Themes ({siteData.researchInterests.length})
                </h4>

                <div className="space-y-3">
                  {siteData.researchInterests.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white border border-neutral-200 rounded-md flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-dm px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                            Theme #{idx + 1}
                          </span>
                          <h5 className="text-sm font-dm font-semibold text-neutral-900">
                            {item.title}
                          </h5>
                        </div>
                        <p className="text-xs font-dm text-neutral-600 leading-relaxed">
                          {item.description}
                        </p>
                        {item.keywords && item.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.keywords.map((kw, kwIdx) => (
                              <span
                                key={kwIdx}
                                className="text-[10px] font-dm bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditTheme(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-dm text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {confirmDeleteThemeId === item.id ? (
                          <div className="inline-flex items-center gap-1.5 p-1 bg-red-50 border border-red-200 rounded">
                            <span className="text-[11px] font-dm text-red-700 font-medium px-1">Delete?</span>
                            <button
                              type="button"
                              onClick={() => {
                                deleteResearchInterest(item.id);
                                if (editingThemeId === item.id) {
                                  handleCancelThemeEdit();
                                }
                                setConfirmDeleteThemeId(null);
                                showNotice('Research theme deleted');
                              }}
                              className="px-2 py-1 text-[11px] font-dm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteThemeId(null)}
                              className="px-2 py-1 text-[11px] font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteThemeId(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-dm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                            title="Delete this theme"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {siteData.researchInterests.length === 0 && (
                    <div className="p-8 text-center bg-neutral-50 border border-neutral-200 rounded text-neutral-500 text-xs font-dm">
                      No research themes found. Use the form above to add research themes.
                    </div>
                  )}
                </div>
              </div>
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
                      {confirmDeleteCourseId === course.id ? (
                        <div className="inline-flex items-center gap-1.5 p-1 bg-red-50 border border-red-200 rounded">
                          <span className="text-[11px] font-dm text-red-700 font-medium">Remove course?</span>
                          <button
                            type="button"
                            onClick={() => {
                              deleteCourse(course.id);
                              setConfirmDeleteCourseId(null);
                              showNotice('Course deleted');
                            }}
                            className="px-2 py-0.5 text-[11px] font-dm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteCourseId(null)}
                            className="px-2 py-0.5 text-[11px] font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteCourseId(course.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
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

          {/* TAB 5: RESEARCH PROJECTS & TEAM MANAGER */}
          {adminTab === 'lab' && (
            <div className="space-y-10 max-w-4xl mx-auto">
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="text-lg font-cormorant font-semibold text-neutral-900">
                  Research Initiatives & Team Management
                </h3>
                <p className="text-xs font-dm text-neutral-500">
                  Edit and add research projects, funding, collaborators, and advisee team members.
                </p>
              </div>

              {/* SECTION A: PROJECTS */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-dm uppercase tracking-wider font-semibold text-neutral-900">
                    {editingProjectId ? 'Edit Research Project' : 'Add New Research Project'}
                  </h4>
                  {editingProjectId && (
                    <button
                      onClick={handleCancelProjectEdit}
                      className="text-xs font-dm text-neutral-600 hover:text-neutral-900 underline"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                <form id="project-edit-form" onSubmit={handleSaveProject} className="p-5 bg-neutral-50 border border-neutral-200 rounded-md space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="e.g. Cognitive-State Driven Mixed-Initiative Decision Frameworks"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    {/* Project Image & Photo Management */}
                    <div className="md:col-span-2 space-y-2 p-3 bg-white border border-neutral-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-dm font-semibold text-neutral-800 block">
                          Project Photo / Visual (프로젝트 사진)
                        </label>
                        {projectForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setProjectForm((prev) => ({ ...prev, imageUrl: '' }));
                              showNotice('Project photo deleted / removed');
                            }}
                            className="inline-flex items-center gap-1 text-xs font-dm text-red-600 hover:text-red-700 font-medium underline"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Photo (사진 삭제)</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Image Preview Box */}
                        <div className="sm:col-span-4 aspect-[16/9] bg-neutral-100 border border-neutral-200 rounded overflow-hidden flex items-center justify-center relative">
                          {projectForm.imageUrl ? (
                            <img
                              src={projectForm.imageUrl}
                              alt="Project visual preview"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2 text-neutral-400 text-xs">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                              <span>No photo assigned</span>
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="sm:col-span-8 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded cursor-pointer transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Photo File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const compressed = await compressImageFile(file, 900, 0.8);
                                      setProjectForm((prev) => ({ ...prev, imageUrl: compressed }));
                                      showNotice('Project photo uploaded & optimized');
                                    } catch (err) {
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        if (typeof reader.result === 'string') {
                                          setProjectForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
                                          showNotice('Project photo uploaded');
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }
                                }}
                              />
                            </label>
                            {projectForm.imageUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setProjectForm((prev) => ({ ...prev, imageUrl: '' }));
                                  showNotice('Project photo cleared');
                                }}
                                className="px-2.5 py-1.5 text-xs font-dm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                              >
                                Clear Photo
                              </button>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-dm text-neutral-500 block">
                              Or paste direct image URL or relative path:
                            </span>
                            <input
                              type="text"
                              value={projectForm.imageUrl}
                              onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                              placeholder="e.g. https://... or /src/assets/images/..."
                              className="w-full px-3 py-1.5 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Kicker / Grant Tag</label>
                      <input
                        type="text"
                        value={projectForm.kicker}
                        onChange={(e) => setProjectForm({ ...projectForm, kicker: e.target.value })}
                        placeholder="e.g. NSF CAREER AWARD #2348910 · 2024–2029"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Timeframe</label>
                      <input
                        type="text"
                        value={projectForm.timeframe}
                        onChange={(e) => setProjectForm({ ...projectForm, timeframe: e.target.value })}
                        placeholder="e.g. 2024 – 2029"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Funding Body / Amount</label>
                      <input
                        type="text"
                        value={projectForm.funding}
                        onChange={(e) => setProjectForm({ ...projectForm, funding: e.target.value })}
                        placeholder="e.g. Australian Research Council Discovery Grant"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Collaborating Partners</label>
                      <input
                        type="text"
                        value={projectForm.collaborators}
                        onChange={(e) => setProjectForm({ ...projectForm, collaborators: e.target.value })}
                        placeholder="e.g. Monash Health, CSIRO Data61"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Short Summary</label>
                      <textarea
                        rows={2}
                        value={projectForm.summary}
                        onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                        placeholder="Brief summary shown in project cards..."
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Full Description</label>
                      <textarea
                        rows={3}
                        value={projectForm.fullDescription}
                        onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                        placeholder="Detailed project background, methodology, and objectives..."
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200">
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingProjectId ? 'Update Project' : 'Add Project'}</span>
                      </button>
                      {editingProjectId && (
                        <button
                          type="button"
                          onClick={handleCancelProjectEdit}
                          className="px-3 py-2 text-xs font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {editingProjectId && (
                      <div className="flex items-center gap-2">
                        {confirmDeleteProjectId === editingProjectId ? (
                          <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded border border-red-200">
                            <span className="text-xs font-dm text-red-700 font-medium">Delete this project?</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteProjectConfirmed(editingProjectId)}
                              className="px-2.5 py-1 text-xs font-dm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteProjectId(null)}
                              className="px-2 py-1 text-xs font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteProjectId(editingProjectId)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-dm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Project</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </form>

                {/* Existing Projects List */}
                <div className="space-y-3">
                  <h5 className="text-xs font-dm uppercase font-semibold text-neutral-700">
                    Existing Projects ({siteData.projects.length})
                  </h5>
                  <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-md">
                    {siteData.projects.map((proj) => (
                      <div key={proj.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50">
                        <div className="flex items-start sm:items-center gap-3">
                          {/* Image thumbnail preview */}
                          <div className="w-16 h-12 shrink-0 bg-neutral-100 rounded border border-neutral-200 overflow-hidden flex items-center justify-center">
                            {proj.imageUrl ? (
                              <img
                                src={proj.imageUrl}
                                alt={proj.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-neutral-400" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-neutral-900 text-sm font-dm">{proj.title}</strong>
                              {proj.kicker && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                                  {proj.kicker}
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-dm text-neutral-500 line-clamp-1">{proj.summary || proj.fullDescription}</p>
                            <div className="text-[11px] font-dm text-neutral-400">
                              {proj.funding} {proj.timeframe && `· ${proj.timeframe}`}
                              {proj.imageUrl ? ' · [Photo attached]' : ' · [No photo]'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              handleEditProject(proj);
                              const formEl = document.getElementById('project-edit-form');
                              formEl?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-dm text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit / Photo</span>
                          </button>
                          {confirmDeleteProjectId === proj.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteProjectConfirmed(proj.id)}
                                className="px-2.5 py-1.5 text-xs font-dm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteProjectId(null)}
                                className="px-2 py-1.5 text-xs font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteProjectId(proj.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-dm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION B: PHD RESEARCH TOPICS & SUPERVISION */}
              <div className="space-y-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-dm uppercase tracking-wider font-semibold text-neutral-900">
                    {editingMemberId ? 'Edit PhD Research Topic' : 'Add PhD Research Topic'}
                  </h4>
                  {editingMemberId && (
                    <button
                      onClick={handleCancelMemberEdit}
                      className="text-xs font-dm text-neutral-600 hover:text-neutral-900 underline"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveMember} className="p-5 bg-neutral-50 border border-neutral-200 rounded-md space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">Research Topic Title *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.topic}
                        onChange={(e) => setMemberForm({ ...memberForm, topic: e.target.value, name: e.target.value })}
                        placeholder="e.g. The experience of women with refugee backgrounds accessing domestic and family violence support"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-dm font-medium text-neutral-700 block">Co-supervisors</label>
                        <input
                          type="text"
                          value={memberForm.coSupervisors}
                          onChange={(e) => setMemberForm({ ...memberForm, coSupervisors: e.target.value })}
                          placeholder="e.g. Dr Kathryn Benier and Dr Sara Niner"
                          className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-dm font-medium text-neutral-700 block">Category / Degree</label>
                        <input
                          type="text"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                          placeholder="e.g. PhD Research"
                          className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingMemberId ? 'Update Topic' : 'Add Topic'}</span>
                    </button>
                    {editingMemberId && (
                      <button
                        type="button"
                        onClick={handleCancelMemberEdit}
                        className="px-3 py-2 text-xs font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    {editingMemberId && (
                      confirmDeleteMemberId === editingMemberId ? (
                        <div className="ml-auto inline-flex items-center gap-2 p-1 bg-red-50 border border-red-200 rounded">
                          <span className="text-xs font-dm text-red-700 font-medium px-1">Remove topic?</span>
                          <button
                            type="button"
                            onClick={() => {
                              deleteLabMember(editingMemberId);
                              handleCancelMemberEdit();
                              showNotice('Topic removed');
                            }}
                            className="px-2.5 py-1 text-xs font-dm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                          >
                            Yes, Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteMemberId(null)}
                            className="px-2 py-1 text-xs font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteMemberId(editingMemberId)}
                          className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 text-xs font-dm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Topic</span>
                        </button>
                      )
                    )}
                  </div>
                </form>

                {/* Existing Topics List */}
                <div className="space-y-3">
                  <h5 className="text-xs font-dm uppercase font-semibold text-neutral-700">
                    PhD Research Topics ({siteData.labMembers.length})
                  </h5>
                  <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-md">
                    {siteData.labMembers.map((member) => (
                      <div key={member.id} className="p-3.5 flex items-start justify-between gap-4 text-xs font-dm hover:bg-neutral-50">
                        <div className="space-y-1">
                          <strong className="text-neutral-900 block leading-snug">{member.topic || member.name}</strong>
                          {member.coSupervisors && (
                            <div className="text-neutral-500 text-[11px]">
                              Co-supervisors: <span className="text-neutral-700 font-medium">{member.coSupervisors}</span>
                            </div>
                          )}
                          <div className="text-neutral-400 text-[10px] uppercase font-mono">{member.role || 'PhD Research'}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditMember(member)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-dm text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          {confirmDeleteMemberId === member.id ? (
                            <div className="inline-flex items-center gap-1.5 p-1 bg-red-50 border border-red-200 rounded">
                              <span className="text-[11px] font-dm text-red-700 font-medium px-1">Remove?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteLabMember(member.id);
                                  if (editingMemberId === member.id) {
                                    handleCancelMemberEdit();
                                  }
                                  setConfirmDeleteMemberId(null);
                                  showNotice('Topic removed');
                                }}
                                className="px-2 py-0.5 text-[11px] font-dm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteMemberId(null)}
                                className="px-2 py-0.5 text-[11px] font-dm text-neutral-600 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteMemberId(member.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-dm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <label className="text-xs font-dm font-medium text-neutral-700 block">Google Scholar Profile URL</label>
                    <input
                      type="text"
                      value={seoForm.googleScholarUrl || ''}
                      onChange={(e) => setSeoForm({ ...seoForm, googleScholarUrl: e.target.value })}
                      placeholder="https://scholar.google.com/citations?..."
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">LinkedIn URL</label>
                    <input
                      type="text"
                      value={seoForm.linkedinUrl || ''}
                      onChange={(e) => setSeoForm({ ...seoForm, linkedinUrl: e.target.value })}
                      placeholder="https://www.linkedin.com/in/..."
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">ORCID ID</label>
                    <input
                      type="text"
                      value={seoForm.orcidId}
                      onChange={(e) => setSeoForm({ ...seoForm, orcidId: e.target.value })}
                      placeholder="0000-0001-5752-5797"
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">GitHub Profile / URL</label>
                    <input
                      type="text"
                      value={seoForm.githubUrl}
                      onChange={(e) => setSeoForm({ ...seoForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
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
                    <span className="text-neutral-800 font-medium">monash.edu</span>
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
      siteData.seo.googleScholarUrl || `https://scholar.google.com/citations?user=${siteData.seo.googleScholarId}`,
      `https://orcid.org/${siteData.seo.orcidId}`,
      siteData.seo.linkedinUrl,
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
                {confirmResetDefaults ? (
                  <div className="p-3 bg-red-100 border border-red-300 rounded space-y-2">
                    <p className="text-xs font-dm text-red-900 font-medium">
                      Are you sure? All custom edits will be reset to default sample data.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          resetToDefaults();
                          setConfirmResetDefaults(false);
                          showNotice('Restored to default rich sample content');
                          setIsAdminOpen(false);
                        }}
                        className="px-3 py-1.5 text-xs font-dm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                      >
                        Yes, Reset Everything
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmResetDefaults(false)}
                        className="px-3 py-1.5 text-xs font-dm text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmResetDefaults(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-dm font-medium text-red-700 bg-white border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All to Default Sample Data</span>
                  </button>
                )}
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
