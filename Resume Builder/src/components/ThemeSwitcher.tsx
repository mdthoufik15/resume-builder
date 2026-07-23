'use client';

import { Check } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import { COLOR_THEMES, FONTS } from '@/lib/constants';
import type { ColorThemeId, FontId } from '@/types/resume';

interface ThemeSwitcherProps {
  currentTheme: ColorThemeId;
  currentFont: FontId;
}

export function ThemeSwitcher({ currentTheme, currentFont }: ThemeSwitcherProps) {
  const { setColorTheme, setFont } = useResumeStore();

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Design Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Customize the color palette and typography of your resume.
        </p>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Color Theme
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COLOR_THEMES.map((theme) => {
            const isActive = theme.id === currentTheme;
            return (
              <button
                key={theme.id}
                onClick={() => setColorTheme(theme.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-inner"
                  style={{ backgroundColor: theme.primary }}
                >
                  {isActive && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`text-xs font-medium truncate ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700"></div>

      {/* Fonts */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Typography
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map((font) => {
            const isActive = font.id === currentFont;
            return (
              <button
                key={font.id}
                onClick={() => setFont(font.id)}
                className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                style={{ fontFamily: font.family }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-base font-semibold ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>
                    {font.name}
                  </span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                  The quick brown fox jumps over the lazy dog.
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
