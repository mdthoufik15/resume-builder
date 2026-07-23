'use client';

import { Check } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import { TEMPLATES } from '@/lib/constants';
import type { TemplateId } from '@/types/resume';

interface TemplateSelectorProps {
  currentTemplate: TemplateId;
}

export function TemplateSelector({ currentTemplate }: TemplateSelectorProps) {
  const { setTemplate } = useResumeStore();

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Choose a Template</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select a layout that best fits your industry and experience level.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => {
          const isActive = template.id === currentTemplate;

          return (
            <button
              key={template.id}
              onClick={() => setTemplate(template.id)}
              className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all text-left w-full h-full ${
                isActive
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
              }`}
            >
              {isActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm z-10">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
              
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-3xl mb-4 shadow-inner">
                {template.preview}
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white text-sm w-full text-center mb-1">
                {template.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                {template.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
