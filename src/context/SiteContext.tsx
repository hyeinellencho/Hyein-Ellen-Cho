import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SiteData,
  Profile,
  Publication,
  Course,
  ResearchProject,
  LabMember,
  Post,
  ThemeConfig,
  SeoConfig,
  AdminTab,
} from '../types';
import { initialSiteData } from '../data/initialData';

interface SiteContextType {
  siteData: SiteData;
  updateProfile: (profile: Partial<Profile>) => void;
  addPost: (post: Omit<Post, 'id'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addPublication: (pub: Omit<Publication, 'id'>) => void;
  updatePublication: (id: string, pub: Partial<Publication>) => void;
  deletePublication: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addProject: (proj: Omit<ResearchProject, 'id'>) => void;
  updateProject: (id: string, proj: Partial<ResearchProject>) => void;
  deleteProject: (id: string) => void;
  addLabMember: (member: Omit<LabMember, 'id'>) => void;
  updateLabMember: (id: string, member: Partial<LabMember>) => void;
  deleteLabMember: (id: string) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateSeo: (seo: Partial<SeoConfig>) => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  isQuickEditActive: boolean;
  setIsQuickEditActive: (active: boolean) => void;
  activePost: Post | null;
  setActivePost: (post: Post | null) => void;
  activeBibtexPub: Publication | null;
  setActiveBibtexPub: (pub: Publication | null) => void;
}

const STORAGE_KEY = 'hyein_academic_website_data_v1';

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure complete structure matches current schema
        return {
          ...initialSiteData,
          ...parsed,
          profile: { ...initialSiteData.profile, ...parsed.profile },
          theme: { ...initialSiteData.theme, ...parsed.theme },
          seo: { ...initialSiteData.seo, ...parsed.seo },
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved site data from localStorage:', e);
    }
    return initialSiteData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('publications');
  const [isQuickEditActive, setIsQuickEditActive] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [activeBibtexPub, setActiveBibtexPub] = useState<Publication | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
  }, [siteData]);

  // Sync title and SEO dynamically
  useEffect(() => {
    document.title = siteData.seo.metaTitle || `${siteData.profile.name} — Academic Portfolio`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', siteData.seo.metaDescription);
    }
  }, [siteData.seo, siteData.profile.name]);

  const updateProfile = (partial: Partial<Profile>) => {
    setSiteData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...partial },
    }));
  };

  const addPost = (post: Omit<Post, 'id'>) => {
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
    };
    setSiteData((prev) => ({
      ...prev,
      posts: [newPost, ...prev.posts],
    }));
  };

  const updatePost = (id: string, partial: Partial<Post>) => {
    setSiteData((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    }));
  };

  const deletePost = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== id),
    }));
  };

  const addPublication = (pub: Omit<Publication, 'id'>) => {
    const newPub: Publication = {
      ...pub,
      id: `pub-${Date.now()}`,
    };
    setSiteData((prev) => ({
      ...prev,
      publications: [newPub, ...prev.publications],
    }));
  };

  const updatePublication = (id: string, partial: Partial<Publication>) => {
    setSiteData((prev) => ({
      ...prev,
      publications: prev.publications.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    }));
  };

  const deletePublication = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      publications: prev.publications.filter((p) => p.id !== id),
    }));
  };

  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
    };
    setSiteData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
  };

  const updateCourse = (id: string, partial: Partial<Course>) => {
    setSiteData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    }));
  };

  const deleteCourse = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));
  };

  const addProject = (proj: Omit<ResearchProject, 'id'>) => {
    const newProj: ResearchProject = {
      ...proj,
      id: `proj-${Date.now()}`,
    };
    setSiteData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const updateProject = (id: string, partial: Partial<ResearchProject>) => {
    setSiteData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const addLabMember = (member: Omit<LabMember, 'id'>) => {
    const newMember: LabMember = {
      ...member,
      id: `mem-${Date.now()}`,
    };
    setSiteData((prev) => ({
      ...prev,
      labMembers: [...prev.labMembers, newMember],
    }));
  };

  const updateLabMember = (id: string, partial: Partial<LabMember>) => {
    setSiteData((prev) => ({
      ...prev,
      labMembers: prev.labMembers.map((m) => (m.id === id ? { ...m, ...partial } : m)),
    }));
  };

  const deleteLabMember = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      labMembers: prev.labMembers.filter((m) => m.id !== id),
    }));
  };

  const updateTheme = (partial: Partial<ThemeConfig>) => {
    setSiteData((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...partial },
    }));
  };

  const updateSeo = (partial: Partial<SeoConfig>) => {
    setSiteData((prev) => ({
      ...prev,
      seo: { ...prev.seo, ...partial },
    }));
  };

  const resetToDefaults = () => {
    setSiteData(initialSiteData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportDataJson = () => {
    return JSON.stringify(siteData, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.profile && parsed.publications) {
        setSiteData(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON import:', e);
      return false;
    }
  };

  return (
    <SiteContext.Provider
      value={{
        siteData,
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
        isAdminOpen,
        setIsAdminOpen,
        adminTab,
        setAdminTab,
        isQuickEditActive,
        setIsQuickEditActive,
        activePost,
        setActivePost,
        activeBibtexPub,
        setActiveBibtexPub,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
