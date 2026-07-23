'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Wand2, Loader2, GripVertical } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import { enhanceResponsibilities } from '@/lib/ai';
import type { WorkExperience } from '@/types/resume';

export function ExperienceForm() {
  const { getActiveResume, addExperience, updateExperience, removeExperience } = useResumeStore();
  const resume = getActiveResume();
  const [expandedId, setExpandedId] = useState<string | null>(
    resume?.experience[0]?.id || null
  );
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const handleAdd = () => {
    addExperience();
    // The new item will be added at the end
    setTimeout(() => {
      const newResume = useResumeStore.getState().getActiveResume();
      const last = newResume?.experience.at(-1);
      if (last) setExpandedId(last.id);
    }, 0);
  };

  const handleEnhance = async (exp: WorkExperience) => {
    setEnhancingId(exp.id);
    try {
      const enhanced = enhanceResponsibilities(exp.responsibilities, exp.position);
      updateExperience(exp.id, { responsibilities: enhanced });
    } finally {
      setEnhancingId(null);
    }
  };

  const experience = resume?.experience || [];

  return (
    <div className="space-y-3">
      {experience.length === 0 && (
        <div className="text-center py-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No work experience added yet</p>
          <button onClick={handleAdd} className="btn-primary gap-2 text-xs">
            <Plus size={13} />
            Add Work Experience
          </button>
        </div>
      )}

      {experience.map((exp, index) => {
        const isExpanded = expandedId === exp.id;
        const isEnhancing = enhancingId === exp.id;

        return (
          <div
            key={exp.id}
            className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800"
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750"
              onClick={() => setExpandedId(isExpanded ? null : exp.id)}
            >
              <GripVertical size={14} className="text-slate-300 dark:text-slate-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {exp.position || `Position ${index + 1}`}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {exp.company || 'Company name'} {exp.startDate && `• ${exp.startDate}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                  className="btn-ghost w-7 h-7 p-0 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Remove"
                >
                  <Trash2 size={12} />
                </button>
                {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </div>
            </div>

            {/* Expanded fields */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="form-label">Company <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Acme Corporation"
                      className="form-input"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="form-label">Position <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      placeholder="Software Engineer"
                      className="form-input"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      placeholder="New York, NY (or Remote)"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <input
                      type="month"
                      value={exp.currentlyWorking ? '' : exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      disabled={exp.currentlyWorking}
                      placeholder="Present"
                      className="form-input disabled:opacity-50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking}
                        onChange={(e) =>
                          updateExperience(exp.id, { currentlyWorking: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })
                        }
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Currently working here</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="form-label mb-0">Responsibilities & Achievements</label>
                    <button
                      onClick={() => handleEnhance(exp)}
                      disabled={!exp.responsibilities?.trim() || isEnhancing}
                      className="btn-secondary text-xs px-2.5 py-1 gap-1.5 h-auto"
                    >
                      {isEnhancing ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Wand2 size={11} />
                      )}
                      AI Enhance
                    </button>
                  </div>
                  <textarea
                    value={exp.responsibilities}
                    onChange={(e) => updateExperience(exp.id, { responsibilities: e.target.value })}
                    placeholder={`• Built responsive web applications using React\n• Collaborated with design team to implement UI features\n• Improved API response time by 40%`}
                    className="form-input resize-none font-mono text-xs leading-relaxed"
                    rows={5}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    💡 Add bullet points (•) for each responsibility. Click &quot;AI Enhance&quot; to improve them.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {experience.length > 0 && (
        <button onClick={handleAdd} className="btn-secondary gap-2 w-full justify-center text-xs">
          <Plus size={13} />
          Add Another Position
        </button>
      )}
    </div>
  );
}
