'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import { enhanceSummary, generateSummaryFromDetails } from '@/lib/ai';

export function SummaryForm() {
  const { getActiveResume, updateSummary } = useResumeStore();
  const resume = getActiveResume();

  const [isGenerating, setIsGenerating] = useState(false);
  const [careerDetails, setCareerDetails] = useState('');
  const [mode, setMode] = useState<'write' | 'generate'>('write');

  const handleSummaryChange = (value: string) => {
    updateSummary(value);
  };

  const handleEnhance = () => {
    if (!resume?.summary) return;
    const enhanced = enhanceSummary(resume.summary, resume.personal.jobTitle);
    updateSummary(enhanced);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Parse career details from the text area
      const exp = resume?.experience?.length || 0;
      const skills = resume?.skills?.slice(0, 5).map((s) => s.name) || [];
      const title = resume?.personal?.jobTitle || 'Professional';

      const generated = generateSummaryFromDetails(title, exp, skills);
      updateSummary(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800">
        <button
          onClick={() => setMode('write')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
            mode === 'write'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          ✍️ Write my own
        </button>
        <button
          onClick={() => setMode('generate')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
            mode === 'generate'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          🤖 AI generate
        </button>
      </div>

      {mode === 'write' ? (
        <div className="space-y-3">
          <div>
            <label className="form-label">Professional Summary</label>
            <textarea
              value={resume?.summary || ''}
              onChange={(e) => handleSummaryChange(e.target.value)}
              placeholder="Write a 2-4 sentence summary highlighting your expertise, years of experience, and key accomplishments..."
              className="form-input resize-none"
              rows={5}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-slate-400">
                {(resume?.summary || '').length} / 500 characters
              </p>
              <p className="text-xs text-slate-400">Aim for 100–350 characters</p>
            </div>
          </div>

          <button
            onClick={handleEnhance}
            disabled={!resume?.summary?.trim()}
            className="btn-secondary gap-2 text-xs w-full justify-center"
          >
            <Wand2 size={13} />
            Enhance with AI
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              How AI generates your summary:
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <li>• Uses your job title from Personal Info</li>
              <li>• Counts your work experience entries</li>
              <li>• Incorporates your listed skills</li>
              <li>• Applies professional ATS-friendly language</li>
            </ul>
          </div>

          <div>
            <label className="form-label">Additional context (optional)</label>
            <textarea
              value={careerDetails}
              onChange={(e) => setCareerDetails(e.target.value)}
              placeholder="E.g., 'I specialize in React and Node.js, have led teams of 5+, and worked in fintech...'"
              className="form-input resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary gap-2 w-full justify-center"
          >
            {isGenerating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {isGenerating ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>
      )}

      {/* Preview */}
      {resume?.summary && (
        <div className="rounded-xl p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
            Preview
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {resume.summary}
          </p>
        </div>
      )}
    </div>
  );
}
