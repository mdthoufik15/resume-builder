'use client';

import { useMemo } from 'react';
import { ModernTemplate } from '../templates/ModernTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate';
import { MinimalTemplate } from '../templates/MinimalTemplate';
import { CreativeTemplate } from '../templates/CreativeTemplate';
import { ATSCleanTemplate } from '../templates/ATSCleanTemplate';
import { COLOR_THEMES, FONTS } from '@/lib/constants';
import type { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  resume: ResumeData;
  scale?: number;
}

export function ResumePreview({ resume, scale = 1 }: ResumePreviewProps) {
  const theme = useMemo(
    () => COLOR_THEMES.find((t) => t.id === resume.colorTheme) || COLOR_THEMES[0],
    [resume.colorTheme]
  );

  const font = useMemo(
    () => FONTS.find((f) => f.id === resume.font) || FONTS[0],
    [resume.font]
  );

  const TemplateComponent = useMemo(() => {
    switch (resume.template) {
      case 'modern': return ModernTemplate;
      case 'professional': return ProfessionalTemplate;
      case 'executive': return ExecutiveTemplate;
      case 'minimal': return MinimalTemplate;
      case 'creative': return CreativeTemplate;
      case 'ats-clean': return ATSCleanTemplate;
      default: return ModernTemplate;
    }
  }, [resume.template]);

  return (
    <div
      className="resume-preview-wrapper transition-all duration-300 origin-top flex justify-center w-full"
      style={{ transform: `scale(${scale})` }}
    >
      <div
        id="resume-preview-content"
        className="resume-preview shadow-xl bg-white w-[210mm] min-h-[297mm] mx-auto overflow-hidden text-slate-800 relative"
        style={{
          fontFamily: font.family,
          ['--theme-primary' as string]: theme.primary,
          ['--theme-secondary' as string]: theme.secondary,
          ['--theme-accent' as string]: theme.accent,
        }}
      >
        <TemplateComponent resume={resume} />
      </div>
    </div>
  );
}
