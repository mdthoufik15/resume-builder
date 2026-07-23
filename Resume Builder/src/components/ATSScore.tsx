'use client';

import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import type { ATSScore } from '@/types/resume';

interface ATSScorePanelProps {
  score: ATSScore;
}

export function ATSScorePanel({ score }: ATSScorePanelProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreRingColor = (value: number) => {
    if (value >= 80) return 'stroke-green-500';
    if (value >= 60) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score.overall / 100) * circumference;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">ATS Compatibility Score</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          How well your resume will perform in Applicant Tracking Systems.
        </p>
      </div>

      {/* Score Ring */}
      <div className="flex justify-center">
        <div className="relative score-ring w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-slate-200 dark:text-slate-700 stroke-current"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
            />
            <circle
              className={`${getScoreRingColor(score.overall)} transition-all duration-1000 ease-out`}
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">/ 100</span>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-500" />
          Improvement Suggestions
        </h3>
        
        {score.suggestions.length > 0 ? (
          <ul className="space-y-3">
            {score.suggestions.map((suggestion, idx) => {
              const isPositive = suggestion.startsWith('✅');
              return (
                <li
                  key={idx}
                  className={`text-sm p-3 rounded-xl border ${
                    isPositive
                      ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm'
                  }`}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm flex gap-3">
            <CheckCircle2 size={20} className="shrink-0" />
            <p>Your resume is perfectly optimized for ATS systems!</p>
          </div>
        )}
      </div>

      {/* Breakdown Checks */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Detailed Analysis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <CheckItem label="Professional Summary" passed={score.breakdown.hasSummary} />
          <CheckItem label="Summary Length" passed={score.breakdown.summaryLength} />
          <CheckItem label="Work Experience" passed={score.breakdown.hasWorkExperience} />
          <CheckItem label="Action Verbs Used" passed={score.breakdown.hasActionVerbs} />
          <CheckItem label="Measurable Impacts" passed={score.breakdown.hasMeasurableAchievements} />
          <CheckItem label="Bullet Points Format" passed={score.breakdown.experienceBullets} />
          <CheckItem label="Education Added" passed={score.breakdown.hasEducation} />
          <CheckItem label="Skills Listed" passed={score.breakdown.hasSkills} />
          <CheckItem label="8+ Skills" passed={score.breakdown.skillsCount} />
          <CheckItem label="Industry Keywords" passed={score.breakdown.hasKeywords} />
        </div>
      </div>
    </div>
  );
}

function CheckItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
      {passed ? (
        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
      ) : (
        <XCircle size={14} className="text-slate-300 dark:text-slate-600 shrink-0" />
      )}
      <span className={passed ? '' : 'text-slate-400 dark:text-slate-500'}>{label}</span>
    </div>
  );
}
