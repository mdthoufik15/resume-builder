'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Printer, Sparkles, Eye, EyeOff,
  Moon, Sun, ChevronLeft, ChevronRight, Save, CheckCheck,
  LayoutTemplate, Palette, Type
} from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { ATSScorePanel } from '@/components/ATSScore';
import { MultiStepForm } from '@/components/form/MultiStepForm';
import { TemplateSelector } from '@/components/TemplateSelector';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { PDFExporter } from '@/components/PDFExporter';
import { callAIEnhancement } from '@/lib/ai';
import { calculateATSScore } from '@/lib/atsScore';

type RightPanel = 'preview' | 'ats' | 'template' | 'theme';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    resumes, activeResumeId, isDarkMode, setActiveResume,
    toggleDarkMode, bulkUpdate
  } = useResumeStore();

  const [rightPanel, setRightPanel] = useState<RightPanel>('preview');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const resume = resumes.find((r) => r.id === id);

  useEffect(() => {
    setMounted(true);
    if (id && id !== activeResumeId) {
      setActiveResume(id);
    }
  }, [id, activeResumeId, setActiveResume]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', resume?.colorTheme || 'blue');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', resume?.colorTheme || 'blue');
    }
  }, [isDarkMode, resume?.colorTheme]);

  // Autosave indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAIEnhance = async () => {
    if (!resume) return;
    setIsEnhancing(true);
    try {
      const enhanced = await callAIEnhancement(resume, 'full');
      bulkUpdate(enhanced);
    } catch (err) {
      console.error('Enhancement failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const formatSavedTime = () => {
    if (!lastSaved) return 'Not saved';
    const diff = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (diff < 5) return 'Saved just now';
    if (diff < 60) return `Saved ${diff}s ago`;
    return `Saved ${Math.floor(diff / 60)}m ago`;
  };

  if (!mounted) return null;

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Resume not found</p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const atsScore = calculateATSScore(resume);

  return (
    <div
      className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col"
      data-theme={resume.colorTheme}
    >
      {/* Top Toolbar */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/80 dark:border-slate-700/80">
        <div className="px-4 flex items-center gap-3 h-14">
          {/* Back */}
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-ghost w-8 h-8 p-0 rounded-lg flex items-center justify-center shrink-0"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Resume name */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {resume.name}
            </h1>
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <CheckCheck size={10} className="text-green-500" />
              <span>{formatSavedTime()}</span>
            </div>
          </div>

          {/* Right toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* ATS Score badge */}
            <button
              onClick={() => setRightPanel(rightPanel === 'ats' ? 'preview' : 'ats')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                rightPanel === 'ats'
                  ? 'text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              style={rightPanel === 'ats' ? { background: 'var(--resume-primary, #2563eb)' } : {}}
            >
              <span className="font-bold">{atsScore.overall}</span>
              <span className="opacity-75">ATS</span>
            </button>

            {/* AI Enhance */}
            <button
              onClick={handleAIEnhance}
              disabled={isEnhancing}
              className="btn-primary text-xs px-3 py-1.5 gap-1.5"
              title="AI Enhance Resume"
            >
              {isEnhancing ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              <span className="hidden sm:inline">{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
            </button>

            {/* Panel toggles */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              {[
                { id: 'preview' as RightPanel, icon: Eye, label: 'Preview' },
                { id: 'template' as RightPanel, icon: LayoutTemplate, label: 'Template' },
                { id: 'theme' as RightPanel, icon: Palette, label: 'Theme' },
              ].map(({ id: pid, icon: Icon, label }) => (
                <button
                  key={pid}
                  onClick={() => setRightPanel(pid)}
                  title={label}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    rightPanel === pid
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            {/* PDF Export */}
            <PDFExporter resume={resume} />

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="btn-ghost w-8 h-8 p-0 rounded-lg flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 lg:flex-none lg:w-[520px] overflow-y-auto bg-white dark:bg-slate-900">
          <MultiStepForm resumeId={id} />
        </div>

        {/* Right: Preview / ATS / Template / Theme */}
        <div className="hidden lg:flex flex-1 bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <AnimatePresence mode="wait">
            {rightPanel === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex items-start justify-center p-6 overflow-y-auto"
              >
                <ResumePreview resume={resume} scale={0.75} />
              </motion.div>
            )}

            {rightPanel === 'ats' && (
              <motion.div
                key="ats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-y-auto p-6"
              >
                <ATSScorePanel score={atsScore} />
              </motion.div>
            )}

            {rightPanel === 'template' && (
              <motion.div
                key="template"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-y-auto p-6"
              >
                <TemplateSelector currentTemplate={resume.template} />
              </motion.div>
            )}

            {rightPanel === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-y-auto p-6"
              >
                <ThemeSwitcher
                  currentTheme={resume.colorTheme}
                  currentFont={resume.font}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile preview button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowPreviewMobile(true)}
          className="btn-primary w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center"
        >
          <Eye size={22} />
        </button>
      </div>

      {/* Mobile preview modal */}
      <AnimatePresence>
        {showPreviewMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 lg:hidden flex items-center justify-center p-4"
            onClick={() => setShowPreviewMobile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="w-full max-w-sm bg-slate-200 rounded-2xl overflow-y-auto max-h-[90vh] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Preview</h3>
                <button onClick={() => setShowPreviewMobile(false)} className="btn-ghost p-1 rounded-lg">
                  <EyeOff size={16} />
                </button>
              </div>
              <ResumePreview resume={resume} scale={0.55} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
