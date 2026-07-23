'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  User, Briefcase, GraduationCap, Wrench, FolderOpen,
  Award, Star, Heart, FileText, Trophy, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { AwardsForm } from './AwardsForm';
import { AchievementsForm } from './AchievementsForm';
import { InterestsForm } from './InterestsForm';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User, shortLabel: 'Personal' },
  { id: 'summary', label: 'Summary', icon: FileText, shortLabel: 'Summary' },
  { id: 'experience', label: 'Experience', icon: Briefcase, shortLabel: 'Exp.' },
  { id: 'education', label: 'Education', icon: GraduationCap, shortLabel: 'Edu.' },
  { id: 'skills', label: 'Skills', icon: Wrench, shortLabel: 'Skills' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, shortLabel: 'Projects' },
  { id: 'certifications', label: 'Certs', icon: Award, shortLabel: 'Certs' },
  { id: 'awards', label: 'Awards', icon: Trophy, shortLabel: 'Awards' },
  { id: 'achievements', label: 'Achievements', icon: Star, shortLabel: 'Achiev.' },
  { id: 'interests', label: 'Interests', icon: Heart, shortLabel: 'More' },
] as const;

interface MultiStepFormProps {
  resumeId: string;
}

export function MultiStepForm({ resumeId }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { resumes } = useResumeStore();
  const resume = resumes.find((r) => r.id === resumeId);

  if (!resume) return null;

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'personal': return <PersonalInfoForm />;
      case 'summary': return <SummaryForm />;
      case 'experience': return <ExperienceForm />;
      case 'education': return <EducationForm />;
      case 'skills': return <SkillsForm />;
      case 'projects': return <ProjectsForm />;
      case 'certifications': return <CertificationsForm />;
      case 'awards': return <AwardsForm />;
      case 'achievements': return <AchievementsForm />;
      case 'interests': return <InterestsForm />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Step navigation tabs */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex overflow-x-auto scrollbar-hide px-4 pt-3 gap-1">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'text-white shadow-md'
                    : isCompleted
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                style={isActive ? { background: 'var(--resume-primary, #2563eb)' } : {}}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{step.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-slate-100 dark:bg-slate-800 mt-2">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${((currentStep + 1) / STEPS.length) * 100}%`,
              background: 'var(--resume-primary, #2563eb)',
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-5"
          >
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {(() => {
                  const Icon = STEPS[currentStep].icon;
                  return <Icon size={18} style={{ color: 'var(--resume-primary, #2563eb)' }} />;
                })()}
                {STEPS[currentStep].label}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Step {currentStep + 1} of {STEPS.length}
              </p>
            </div>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="btn-secondary gap-2 disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {currentStep + 1} / {STEPS.length}
        </span>

        <button
          onClick={() => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={currentStep === STEPS.length - 1}
          className="btn-primary gap-2 disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
