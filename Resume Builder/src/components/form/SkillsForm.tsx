'use client';

import { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import type { Skill } from '@/types/resume';

const CATEGORIES: { id: Skill['category']; label: string; color: string }[] = [
  { id: 'technical', label: 'Technical', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'framework', label: 'Framework', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'tool', label: 'Tool', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { id: 'soft', label: 'Soft Skill', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'language', label: 'Language', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
];

const SUGGESTIONS: { category: Skill['category']; skills: string[] }[] = [
  { category: 'technical', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL', 'HTML/CSS', 'REST APIs'] },
  { category: 'framework', skills: ['React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Spring Boot', 'Express'] },
  { category: 'tool', skills: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Figma', 'VS Code', 'Jira', 'Linux'] },
  { category: 'soft', skills: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Agile'] },
  { category: 'language', skills: ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic'] },
];

export function SkillsForm() {
  const { getActiveResume, addSkill, removeSkill } = useResumeStore();
  const resume = getActiveResume();
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Skill['category']>('technical');
  const inputRef = useRef<HTMLInputElement>(null);

  const skills = resume?.skills || [];

  const handleAdd = (name: string, category: Skill['category'] = selectedCategory) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    addSkill({ name: trimmed, category });
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd(input);
    }
  };

  const getCategoryColor = (cat: Skill['category']) =>
    CATEGORIES.find((c) => c.id === cat)?.color || 'bg-slate-100 text-slate-700';

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: skills.filter((s) => s.category === cat.id),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div>
        <label className="form-label">Skill Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? cat.color + ' ring-2 ring-offset-1 ring-current'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="form-label">Add Skill</label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter..."
            className="form-input flex-1"
          />
          <button
            onClick={() => handleAdd(input)}
            disabled={!input.trim()}
            className="btn-primary px-3 disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">Press Enter or comma to add multiple</p>
      </div>

      {/* Quick add suggestions */}
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          Quick add {CATEGORIES.find((c) => c.id === selectedCategory)?.label} skills:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.find((s) => s.category === selectedCategory)?.skills.map((skill) => {
            const alreadyAdded = skills.some((s) => s.name.toLowerCase() === skill.toLowerCase());
            return (
              <button
                key={skill}
                onClick={() => handleAdd(skill)}
                disabled={alreadyAdded}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  alreadyAdded
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {alreadyAdded ? '✓ ' : '+ '}{skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills display */}
      {skills.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Your Skills ({skills.length})
          </p>
          {grouped.map((group) => (
            <div key={group.id}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${group.color}`}
                  >
                    {skill.name}
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="hover:opacity-70 transition-opacity ml-0.5"
                      aria-label={`Remove ${skill.name}`}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
          No skills added yet. Use the suggestions above to get started!
        </div>
      )}
    </div>
  );
}
