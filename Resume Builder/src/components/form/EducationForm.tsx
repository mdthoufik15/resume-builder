'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';

export function EducationForm() {
  const { getActiveResume, addEducation, updateEducation, removeEducation } = useResumeStore();
  const resume = getActiveResume();
  const [expandedId, setExpandedId] = useState<string | null>(
    resume?.education[0]?.id || null
  );

  const handleAdd = () => {
    addEducation();
    setTimeout(() => {
      const newResume = useResumeStore.getState().getActiveResume();
      const last = newResume?.education.at(-1);
      if (last) setExpandedId(last.id);
    }, 0);
  };

  const education = resume?.education || [];

  return (
    <div className="space-y-3">
      {education.length === 0 && (
        <div className="text-center py-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No education added yet</p>
          <button onClick={handleAdd} className="btn-primary gap-2 text-xs">
            <Plus size={13} />
            Add Education
          </button>
        </div>
      )}

      {education.map((edu, index) => {
        const isExpanded = expandedId === edu.id;

        return (
          <div
            key={edu.id}
            className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800"
          >
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750"
              onClick={() => setExpandedId(isExpanded ? null : edu.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {edu.degree || `Degree ${index + 1}`}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {edu.school || 'School name'} {edu.graduationYear && `• ${edu.graduationYear}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                  className="btn-ghost w-7 h-7 p-0 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={12} />
                </button>
                {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </div>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-3">
                <div>
                  <label className="form-label">School / University <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                    placeholder="Massachusetts Institute of Technology"
                    className="form-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Degree <span className="text-red-400">*</span></label>
                    <select
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      className="form-input"
                    >
                      <option value="">Select degree</option>
                      <option>Bachelor of Science</option>
                      <option>Bachelor of Arts</option>
                      <option>Master of Science</option>
                      <option>Master of Arts</option>
                      <option>Master of Business Administration</option>
                      <option>Doctor of Philosophy</option>
                      <option>Associate Degree</option>
                      <option>High School Diploma</option>
                      <option>Certificate</option>
                      <option>Bootcamp Certificate</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Major / Field of Study</label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => updateEducation(edu.id, { major: e.target.value })}
                      placeholder="Computer Science"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">GPA (optional)</label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="3.8 / 4.0"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Graduation Year</label>
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => updateEducation(edu.id, { graduationYear: e.target.value })}
                      placeholder="2024"
                      maxLength={4}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {education.length > 0 && (
        <button onClick={handleAdd} className="btn-secondary gap-2 w-full justify-center text-xs">
          <Plus size={13} />
          Add Another Degree
        </button>
      )}
    </div>
  );
}
