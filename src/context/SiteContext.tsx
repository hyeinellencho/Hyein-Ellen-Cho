import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SiteData,
  Profile,
  ResearchInterest,
  Publication,
  Course,
  ResearchProject,
  ResearchFunding,
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
  addResearchInterest: (ri: Omit<ResearchInterest, 'id'>) => void;
  updateResearchInterest: (id: string, ri: Partial<ResearchInterest>) => void;
  deleteResearchInterest: (id: string) => void;
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
  addResearchFunding: (funding: Omit<ResearchFunding, 'id'>) => void;
  updateResearchFunding: (id: string, partial: Partial<ResearchFunding>) => void;
  deleteResearchFunding: (id: string) => void;
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
  activeEditingProjectId: string | null;
  setActiveEditingProjectId: (id: string | null) => void;
  openProjectEditor: (projectId?: string) => void;
  activeEditingFundingId: string | null;
  setActiveEditingFundingId: (id: string | null) => void;
  openFundingEditor: (fundingId?: string) => void;
}

const STORAGE_KEY = 'hyein_academic_website_data_v8';
const OBSOLETE_KEYS = [
  'hyein_academic_website_data_v7',
  'hyein_academic_website_data_v6',
  'hyein_academic_website_data_v5',
  'hyein_academic_website_data_v4',
  'hyein_academic_website_data_v3',
  'hyein_academic_website_data_v2',
  'hyein_academic_website_data_v1',
];

// Helper to remove obsolete keys and free localStorage quota
const purgeObsoleteStorageKeys = () => {
  OBSOLETE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('hyein_academic_website_data_v6') ||
        localStorage.getItem('hyein_academic_website_data_v3') ||
        localStorage.getItem('hyein_academic_website_data_v2') ||
        localStorage.getItem('hyein_academic_website_data_v1');

      // Clean up previous iteration storage slots immediately to prevent quota bloat
      purgeObsoleteStorageKeys();

      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure complete structure matches current schema and sanitize
        const mergedProfile = { ...initialSiteData.profile, ...parsed.profile };
        if (mergedProfile.institution && mergedProfile.institution.includes('Stanford')) {
          mergedProfile.institution = 'Monash University';
          mergedProfile.institutionUrl = 'https://www.monash.edu';
        }
        if (
          !mergedProfile.title ||
          mergedProfile.title.includes('Computer Science')
        ) {
          mergedProfile.title = initialSiteData.profile.title;
        }
        if (
          !mergedProfile.department ||
          mergedProfile.department.toLowerCase().includes('information technology') ||
          mergedProfile.department.toLowerCase().includes('computer science')
        ) {
          mergedProfile.department = initialSiteData.profile.department;
        }
        if (
          !mergedProfile.office ||
          mergedProfile.office.includes('Woodside Building')
        ) {
          mergedProfile.office = initialSiteData.profile.office;
        }
        if (mergedProfile.email === 'hyein.cho@monash.edu') {
          mergedProfile.email = 'Ellen.Cho@monash.edu';
        }
        // Remove academic notice ribbon & office hours per user request
        mergedProfile.statusBadge = '';
        mergedProfile.officeHours = '';
        if (mergedProfile.pronouns === 'she/her') {
          mergedProfile.pronouns = '';
        }

        if (!mergedProfile.primaryInterests || mergedProfile.primaryInterests.length === 0) {
          mergedProfile.primaryInterests = initialSiteData.profile.primaryInterests;
        }
        if (!mergedProfile.affiliations || mergedProfile.affiliations.length === 0) {
          mergedProfile.affiliations = initialSiteData.profile.affiliations;
        }
        if (mergedProfile.address && mergedProfile.address.includes('Wellington Road')) {
          mergedProfile.address = '';
        }
        if (
          !mergedProfile.prospectiveStudentsNote ||
          mergedProfile.prospectiveStudentsNote.includes('Due to email volume')
        ) {
          mergedProfile.prospectiveStudentsNote = 'Please note that I am not accepting any research students until 2028.';
        }

        // If avatarUrl was the old default or oversized data url, ensure safe fallback
        if (
          !mergedProfile.avatarUrl ||
          mergedProfile.avatarUrl.includes('prof_portrait_hyein_1791619836917')
        ) {
          mergedProfile.avatarUrl = '/src/assets/images/prof_portrait_new_1791626002011.jpg';
        }

        const mergedSeo = { ...initialSiteData.seo, ...(parsed.seo || {}) };
        mergedSeo.googleScholarUrl =
          'https://scholar.google.com/citations?hl=en&user=laKlDswAAAAJ&view_op=list_works&sortby=pubdate';
        mergedSeo.googleScholarId = 'laKlDswAAAAJ';
        mergedSeo.linkedinUrl = 'https://www.linkedin.com/in/hyein-ellen-cho/';
        mergedSeo.dblpUrl = 'https://www.linkedin.com/in/hyein-ellen-cho/';
        mergedSeo.orcidId = '0000-0001-5752-5797';

        // Migrate publications: sync with authentic ORCID & Google Scholar verified list
        const hasVerifiedOrcidData =
          Array.isArray(parsed.publications) &&
          parsed.publications.some((p: Publication) => p.id && p.id.startsWith('pub-orcid-'));

        let mergedPublications: Publication[];
        if (!hasVerifiedOrcidData) {
          mergedPublications = initialSiteData.publications;
        } else {
          // Filter out deleted monograph and dissertation per user request
          mergedPublications = parsed.publications.filter(
            (p: Publication) =>
              p.id !== 'pub-scholar-monograph' &&
              p.id !== 'pub-dissertation-2022' &&
              !p.title.includes('Gender, migration and family violence in Australia: The transnational experiences') &&
              !p.title.includes('An intersectional approach to lived experiences of domestic and family violence within the Korean Diaspora')
          );

          // Clear removed awards (TASA award, Dean's Commendation) per user request
          mergedPublications = mergedPublications.map((p: Publication) => {
            let item = { ...p };
            if (
              item.award &&
              (item.award.includes('TASA') ||
                item.award.includes("Dean's Commendation") ||
                item.award.includes('Research Monograph Under Contract'))
            ) {
              const { award: _removed, ...rest } = item;
              item = rest as Publication;
            }
            if (item.id === 'pub-report-2024') {
              item.type = 'report';
            }
            return item;
          });

          // Ensure authentic research reports from initialSiteData are present
          const existingIds = new Set(mergedPublications.map((p) => p.id));
          const missingReports = initialSiteData.publications.filter(
            (p) => p.type === 'report' && !existingIds.has(p.id)
          );
          if (missingReports.length > 0) {
            mergedPublications = [...mergedPublications, ...missingReports];
          }
        }

          // Ensure authentic PhD research topics are used instead of student placeholders
          const hasPlaceholderLabMembers =
            !Array.isArray(parsed.labMembers) ||
            parsed.labMembers.some(
              (m: LabMember) =>
                m.name === 'Sarah Chen' ||
                m.name === 'Dr. David K. Park' ||
                m.name === 'Elena Rostova' ||
                m.id === 'mem-1' ||
                m.id === 'mem-2'
            ) ||
            !parsed.labMembers.some((m: LabMember) =>
              (m.topic || m.name || '').includes('refugee backgrounds')
            );

          const mergedLabMembers = hasPlaceholderLabMembers
            ? initialSiteData.labMembers
            : parsed.labMembers;

          const mergedResearchFunding =
            Array.isArray(parsed.researchFunding) && parsed.researchFunding.length > 0
              ? parsed.researchFunding
              : initialSiteData.researchFunding;

          return {
            ...initialSiteData,
            ...parsed,
            publications: mergedPublications,
            labMembers: mergedLabMembers,
            researchFunding: mergedResearchFunding,
            profile: mergedProfile,
            theme: { ...initialSiteData.theme, ...(parsed.theme || {}) },
            seo: mergedSeo,
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
  const [activeEditingProjectId, setActiveEditingProjectId] = useState<string | null>(null);
  const [activeEditingFundingId, setActiveEditingFundingId] = useState<string | null>(null);

  const openProjectEditor = (projectId?: string) => {
    setAdminTab('lab');
    setActiveEditingProjectId(projectId || null);
    setIsAdminOpen(true);
  };

  const openFundingEditor = (fundingId?: string) => {
    setAdminTab('lab');
    setActiveEditingFundingId(fundingId || null);
    setIsAdminOpen(true);
  };

  // Sync to localStorage with robust quota handling and safety fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    } catch (error) {
      console.warn('Initial localStorage save failed, purging old keys & retrying...', error);
      // Clean up any old unused keys
      purgeObsoleteStorageKeys();

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
      } catch (secondError) {
        console.warn('Storage still full. Attempting storage with bundled asset path fallback...', secondError);
        // If quota still exceeded, it is likely caused by an oversized avatar data URL.
        // Fall back to saving with the default portrait image path to ensure all textual edits/publications remain saved.
        try {
          const lightweightData: SiteData = {
            ...siteData,
            profile: {
              ...siteData.profile,
              avatarUrl: siteData.profile.avatarUrl.startsWith('data:')
                ? '/src/assets/images/prof_portrait_new_1791626002011.jpg'
                : siteData.profile.avatarUrl,
            },
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightData));
        } catch (fatalStorageError) {
          console.warn('Storage quota fully exhausted by external factors. State retained in memory:', fatalStorageError);
        }
      }
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

  const addResearchInterest = (ri: Omit<ResearchInterest, 'id'>) => {
    const newRI: ResearchInterest = {
      ...ri,
      id: `ri-${Date.now()}`,
    };
    setSiteData((prev) => ({
      ...prev,
      researchInterests: [...prev.researchInterests, newRI],
    }));
  };

  const updateResearchInterest = (id: string, partial: Partial<ResearchInterest>) => {
    setSiteData((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      ),
    }));
  };

  const deleteResearchInterest = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((item) => item.id !== id),
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

  const addResearchFunding = (funding: Omit<ResearchFunding, 'id'>) => {
    const newFunding: ResearchFunding = {
      ...funding,
      id: `fund-${Date.now()}`,
    };
    setSiteData((prev) => ({
      ...prev,
      researchFunding: [newFunding, ...(prev.researchFunding || [])],
    }));
  };

  const updateResearchFunding = (id: string, partial: Partial<ResearchFunding>) => {
    setSiteData((prev) => ({
      ...prev,
      researchFunding: (prev.researchFunding || []).map((f) =>
        f.id === id ? { ...f, ...partial } : f
      ),
    }));
  };

  const deleteResearchFunding = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      researchFunding: (prev.researchFunding || []).filter((f) => f.id !== id),
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
        addResearchFunding,
        updateResearchFunding,
        deleteResearchFunding,
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
        activeEditingProjectId,
        setActiveEditingProjectId,
        openProjectEditor,
        activeEditingFundingId,
        setActiveEditingFundingId,
        openFundingEditor,
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
