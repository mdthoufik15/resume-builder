export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  gpa?: string;
  graduationYear: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool' | 'framework';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  github?: string;
  liveDemo?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface ResumeSection {
  id: SectionId;
  label: string;
  visible: boolean;
  order: number;
}

export type SectionId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'achievements'
  | 'interests';

export interface ResumeData {
  id: string;
  name: string; // resume name for dashboard
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  achievements: Achievement[];
  interests: string;
  sections: ResumeSection[];
  template: TemplateId;
  colorTheme: ColorThemeId;
  font: FontId;
  createdAt: string;
  updatedAt: string;
}

export type TemplateId =
  | 'modern'
  | 'professional'
  | 'executive'
  | 'minimal'
  | 'creative'
  | 'ats-clean';

export type ColorThemeId =
  | 'blue'
  | 'green'
  | 'purple'
  | 'black'
  | 'navy'
  | 'rose';

export type FontId = 'inter' | 'poppins' | 'lato' | 'roboto';

export interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  preview: string; // emoji or placeholder
}

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  hex: string;
}

export interface ATSScore {
  overall: number;
  breakdown: {
    hasSummary: boolean;
    hasWorkExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasKeywords: boolean;
    hasActionVerbs: boolean;
    hasMeasurableAchievements: boolean;
    summaryLength: boolean;
    skillsCount: boolean;
    experienceBullets: boolean;
  };
  suggestions: string[];
}

export type FormStep =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'achievements'
  | 'interests';

export interface AIEnhancementRequest {
  type: 'summary' | 'experience' | 'project' | 'full';
  data: Partial<ResumeData>;
  context?: string;
}

export interface AIEnhancementResponse {
  summary?: string;
  experience?: WorkExperience[];
  projects?: Project[];
}
