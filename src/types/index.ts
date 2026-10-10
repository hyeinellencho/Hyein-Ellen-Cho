export type FontPairing = 'cormorant' | 'playfair' | 'jakarta';
export type GrayPalette = 'neutral' | 'slate' | 'zinc' | 'stone';
export type BorderTone = 'hairline' | 'crisp' | 'none';
export type AdminTab = 'posts' | 'publications' | 'profile' | 'research' | 'teaching' | 'lab' | 'theme' | 'seo' | 'backup';

export interface Profile {
  name: string;
  pronouns: string;
  title: string;
  secondaryTitle: string;
  department: string;
  institution: string;
  institutionUrl: string;
  office: string;
  officeHours?: string;
  email: string;
  phone: string;
  address: string;
  statusBadge: string;
  bioLead: string;
  bioParagraphs: string[];
  avatarUrl: string;
  cvUrl?: string;
  formspreeEndpoint?: string;
  primaryInterests?: string[];
  affiliations?: string[];
  prospectiveStudentsNote?: string;
}

export interface ResearchInterest {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}

export type PublicationType = 'journal' | 'book_chapter' | 'oped' | 'conference' | 'preprint';

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: PublicationType;
  doi?: string;
  pdfUrl?: string;
  codeUrl?: string;
  projectUrl?: string;
  slidesUrl?: string;
  abstract: string;
  award?: string;
  featured: boolean;
  bibtex: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  level: 'Undergraduate' | 'Graduate' | 'Advanced Seminar';
  schedule: string;
  location: string;
  description: string;
  syllabusUrl?: string;
  courseWebsiteUrl?: string;
  enrollmentCount?: number;
}

export interface ResearchProject {
  id: string;
  title: string;
  kicker: string;
  timeframe: string;
  funding: string;
  summary: string;
  fullDescription: string;
  imageUrl?: string;
  collaborators: string;
  status: 'Active' | 'Completed';
  externalUrl?: string;
}

export interface LabMember {
  id: string;
  name: string;
  role: 'Postdoctoral Fellow' | 'Ph.D. Student' | 'Master Student' | 'Undergraduate' | 'Alumni';
  topic: string;
  photoUrl?: string;
  currentAffiliation?: string;
  websiteUrl?: string;
  scholarUrl?: string;
}

export type PostCategory = 'Announcement' | 'Paper' | 'Grant' | 'Talk' | 'Media' | 'Award';

export interface Post {
  id: string;
  title: string;
  date: string;
  category: PostCategory;
  summary: string;
  content: string;
  readTime: string;
  externalLink?: string;
  pinned: boolean;
}

export interface CVItem {
  id: string;
  section: 'Education' | 'Academic Appointments' | 'Honors & Awards' | 'Grants & Fellowships' | 'Selected Service' | 'Invited Talks';
  period: string;
  title: string;
  organization: string;
  details?: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  googleScholarId: string;
  googleScholarUrl: string;
  orcidId: string;
  arxivAuthorId: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterHandle: string;
  dblpUrl?: string;
}

export interface ThemeConfig {
  fontPairing: FontPairing;
  grayPalette: GrayPalette;
  borderTone: BorderTone;
  accentGrayscale: string; // e.g. '#171717', '#1e293b', etc.
}

export interface SiteData {
  profile: Profile;
  researchInterests: ResearchInterest[];
  publications: Publication[];
  courses: Course[];
  projects: ResearchProject[];
  labMembers: LabMember[];
  posts: Post[];
  cvItems: CVItem[];
  theme: ThemeConfig;
  seo: SeoConfig;
}
