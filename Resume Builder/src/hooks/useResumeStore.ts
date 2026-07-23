import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  Award,
  Achievement,
  TemplateId,
  ColorThemeId,
  FontId,
  SectionId,
} from '@/types/resume';

const DEFAULT_SECTIONS = [
  { id: 'personal' as SectionId, label: 'Personal Info', visible: true, order: 0 },
  { id: 'summary' as SectionId, label: 'Professional Summary', visible: true, order: 1 },
  { id: 'experience' as SectionId, label: 'Work Experience', visible: true, order: 2 },
  { id: 'education' as SectionId, label: 'Education', visible: true, order: 3 },
  { id: 'skills' as SectionId, label: 'Skills', visible: true, order: 4 },
  { id: 'projects' as SectionId, label: 'Projects', visible: true, order: 5 },
  { id: 'certifications' as SectionId, label: 'Certifications', visible: false, order: 6 },
  { id: 'awards' as SectionId, label: 'Awards', visible: false, order: 7 },
  { id: 'achievements' as SectionId, label: 'Achievements', visible: false, order: 8 },
  { id: 'interests' as SectionId, label: 'Interests', visible: false, order: 9 },
];

const createEmptyResume = (name = 'Untitled Resume'): ResumeData => ({
  id: uuidv4(),
  name,
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  achievements: [],
  interests: '',
  sections: DEFAULT_SECTIONS,
  template: 'modern',
  colorTheme: 'blue',
  font: 'inter',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

interface ResumeStore {
  resumes: ResumeData[];
  activeResumeId: string | null;
  isDarkMode: boolean;

  // Resume CRUD
  createResume: (name?: string) => string;
  duplicateResume: (id: string) => string;
  deleteResume: (id: string) => void;
  renameResume: (id: string, name: string) => void;
  setActiveResume: (id: string) => void;
  getActiveResume: () => ResumeData | undefined;

  // Update fields
  updatePersonal: (data: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (from: number, to: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addAward: () => void;
  updateAward: (id: string, data: Partial<Award>) => void;
  removeAward: (id: string) => void;
  addAchievement: () => void;
  updateAchievement: (id: string, data: Partial<Achievement>) => void;
  removeAchievement: (id: string) => void;
  updateInterests: (interests: string) => void;

  // Settings
  setTemplate: (template: TemplateId) => void;
  setColorTheme: (theme: ColorThemeId) => void;
  setFont: (font: FontId) => void;
  toggleSection: (id: SectionId) => void;
  reorderSections: (sections: ResumeData['sections']) => void;

  // Bulk update (for AI enhancement)
  bulkUpdate: (data: Partial<ResumeData>) => void;

  // Theme
  toggleDarkMode: () => void;
}

const updateActive = (
  state: ResumeStore,
  updater: (resume: ResumeData) => Partial<ResumeData>
): Partial<ResumeStore> => {
  if (!state.activeResumeId) return {};
  return {
    resumes: state.resumes.map((r) =>
      r.id === state.activeResumeId
        ? { ...r, ...updater(r), updatedAt: new Date().toISOString() }
        : r
    ),
  };
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: [],
      activeResumeId: null,
      isDarkMode: false,

      createResume: (name = 'Untitled Resume') => {
        const resume = createEmptyResume(name);
        set((state) => ({
          resumes: [...state.resumes, resume],
          activeResumeId: resume.id,
        }));
        return resume.id;
      },

      duplicateResume: (id) => {
        const source = get().resumes.find((r) => r.id === id);
        if (!source) return id;
        const copy: ResumeData = {
          ...JSON.parse(JSON.stringify(source)),
          id: uuidv4(),
          name: `${source.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          resumes: [...state.resumes, copy],
          activeResumeId: copy.id,
        }));
        return copy.id;
      },

      deleteResume: (id) => {
        set((state) => {
          const remaining = state.resumes.filter((r) => r.id !== id);
          return {
            resumes: remaining,
            activeResumeId:
              state.activeResumeId === id
                ? (remaining[0]?.id ?? null)
                : state.activeResumeId,
          };
        });
      },

      renameResume: (id, name) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, name, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      setActiveResume: (id) => set({ activeResumeId: id }),

      getActiveResume: () => {
        const state = get();
        return state.resumes.find((r) => r.id === state.activeResumeId);
      },

      updatePersonal: (data) =>
        set((state) =>
          updateActive(state, (r) => ({ personal: { ...r.personal, ...data } }))
        ),

      updateSummary: (summary) =>
        set((state) => updateActive(state, () => ({ summary }))),

      addExperience: () =>
        set((state) =>
          updateActive(state, (r) => ({
            experience: [
              ...r.experience,
              {
                id: uuidv4(),
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                currentlyWorking: false,
                responsibilities: '',
              },
            ],
          }))
        ),

      updateExperience: (id, data) =>
        set((state) =>
          updateActive(state, (r) => ({
            experience: r.experience.map((e) =>
              e.id === id ? { ...e, ...data } : e
            ),
          }))
        ),

      removeExperience: (id) =>
        set((state) =>
          updateActive(state, (r) => ({
            experience: r.experience.filter((e) => e.id !== id),
          }))
        ),

      reorderExperience: (from, to) =>
        set((state) =>
          updateActive(state, (r) => {
            const exp = [...r.experience];
            const [item] = exp.splice(from, 1);
            exp.splice(to, 0, item);
            return { experience: exp };
          })
        ),

      addEducation: () =>
        set((state) =>
          updateActive(state, (r) => ({
            education: [
              ...r.education,
              {
                id: uuidv4(),
                school: '',
                degree: '',
                major: '',
                gpa: '',
                graduationYear: '',
              },
            ],
          }))
        ),

      updateEducation: (id, data) =>
        set((state) =>
          updateActive(state, (r) => ({
            education: r.education.map((e) =>
              e.id === id ? { ...e, ...data } : e
            ),
          }))
        ),

      removeEducation: (id) =>
        set((state) =>
          updateActive(state, (r) => ({
            education: r.education.filter((e) => e.id !== id),
          }))
        ),

      addSkill: (skill) =>
        set((state) =>
          updateActive(state, (r) => ({
            skills: [...r.skills, { ...skill, id: uuidv4() }],
          }))
        ),

      removeSkill: (id) =>
        set((state) =>
          updateActive(state, (r) => ({
            skills: r.skills.filter((s) => s.id !== id),
          }))
        ),

      addProject: () =>
        set((state) =>
          updateActive(state, (r) => ({
            projects: [
              ...r.projects,
              {
                id: uuidv4(),
                name: '',
                description: '',
                technologies: '',
                github: '',
                liveDemo: '',
              },
            ],
          }))
        ),

      updateProject: (id, data) =>
        set((state) =>
          updateActive(state, (r) => ({
            projects: r.projects.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          }))
        ),

      removeProject: (id) =>
        set((state) =>
          updateActive(state, (r) => ({
            projects: r.projects.filter((p) => p.id !== id),
          }))
        ),

      addCertification: () =>
        set((state) =>
          updateActive(state, (r) => ({
            certifications: [
              ...r.certifications,
              { id: uuidv4(), name: '', issuer: '', date: '', url: '' },
            ],
          }))
        ),

      updateCertification: (id, data) =>
        set((state) =>
          updateActive(state, (r) => ({
            certifications: r.certifications.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          }))
        ),

      removeCertification: (id) =>
        set((state) =>
          updateActive(state, (r) => ({
            certifications: r.certifications.filter((c) => c.id !== id),
          }))
        ),

      addAward: () =>
        set((state) =>
          updateActive(state, (r) => ({
            awards: [
              ...r.awards,
              { id: uuidv4(), title: '', issuer: '', date: '', description: '' },
            ],
          }))
        ),

      updateAward: (id, data) =>
        set((state) =>
          updateActive(state, (r) => ({
            awards: r.awards.map((a) => (a.id === id ? { ...a, ...data } : a)),
          }))
        ),

      removeAward: (id) =>
        set((state) =>
          updateActive(state, (r) => ({
            awards: r.awards.filter((a) => a.id !== id),
          }))
        ),

      addAchievement: () =>
        set((state) =>
          updateActive(state, (r) => ({
            achievements: [
              ...r.achievements,
              { id: uuidv4(), title: '', description: '' },
            ],
          }))
        ),

      updateAchievement: (id, data) =>
        set((state) =>
          updateActive(state, (r) => ({
            achievements: r.achievements.map((a) =>
              a.id === id ? { ...a, ...data } : a
            ),
          }))
        ),

      removeAchievement: (id) =>
        set((state) =>
          updateActive(state, (r) => ({
            achievements: r.achievements.filter((a) => a.id !== id),
          }))
        ),

      updateInterests: (interests) =>
        set((state) => updateActive(state, () => ({ interests }))),

      setTemplate: (template) =>
        set((state) => updateActive(state, () => ({ template }))),

      setColorTheme: (colorTheme) =>
        set((state) => updateActive(state, () => ({ colorTheme }))),

      setFont: (font) =>
        set((state) => updateActive(state, () => ({ font }))),

      toggleSection: (id) =>
        set((state) =>
          updateActive(state, (r) => ({
            sections: r.sections.map((s) =>
              s.id === id ? { ...s, visible: !s.visible } : s
            ),
          }))
        ),

      reorderSections: (sections) =>
        set((state) => updateActive(state, () => ({ sections }))),

      bulkUpdate: (data) =>
        set((state) => updateActive(state, (r) => ({ ...r, ...data }))),

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'ai-resume-builder-store',
      version: 1,
    }
  )
);
