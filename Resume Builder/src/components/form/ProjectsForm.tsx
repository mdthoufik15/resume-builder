'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Github, ExternalLink, Wand2, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import { enhanceProjectDescription } from '@/lib/ai';

export function ProjectsForm() {
  const { getActiveResume, addProject, updateProject, removeProject } = useResumeStore();
  const resume = getActiveResume();
  const [expandedId, setExpandedId] = useState<string | null>(
    resume?.projects[0]?.id || null
  );
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const handleAdd = () => {
    addProject();
    setTimeout(() => {
      const newResume = useResumeStore.getState().getActiveResume();
      const last = newResume?.projects.at(-1);
      if (last) setExpandedId(last.id);
    }, 0);
  };

  const handleEnhance = async (id: string, description: string, technologies: string) => {
    setEnhancingId(id);
    try {
      const enhanced = enhanceProjectDescription(description, technologies);
      updateProject(id, { description: enhanced });
    } finally {
      setEnhancingId(null);
    }
  };

  const projects = resume?.projects || [];

  return (
    <div className="space-y-3">
      {projects.length === 0 && (
        <div className="text-center py-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No projects added yet</p>
          <button onClick={handleAdd} className="btn-primary gap-2 text-xs">
            <Plus size={13} />
            Add Project
          </button>
        </div>
      )}

      {projects.map((project, index) => {
        const isExpanded = expandedId === project.id;
        const isEnhancing = enhancingId === project.id;

        return (
          <div
            key={project.id}
            className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800"
          >
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750"
              onClick={() => setExpandedId(isExpanded ? null : project.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {project.name || `Project ${index + 1}`}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {project.technologies || 'Technologies not specified'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
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
                  <label className="form-label">Project Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                    placeholder="E-Commerce Platform"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Technologies Used</label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, { technologies: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL, AWS"
                    className="form-input"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="form-label mb-0">Description <span className="text-red-400">*</span></label>
                    <button
                      onClick={() => handleEnhance(project.id, project.description, project.technologies)}
                      disabled={!project.description?.trim() || isEnhancing}
                      className="btn-secondary text-xs px-2.5 py-1 gap-1.5 h-auto"
                    >
                      {isEnhancing ? <Loader2 size={11} className="animate-spin" /> : <Wand2 size={11} />}
                      AI Enhance
                    </button>
                  </div>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, { description: e.target.value })}
                    placeholder="Describe what you built, the problem it solves, and your role..."
                    className="form-input resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">
                      <Github size={12} className="inline mr-1.5" />
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={project.github || ''}
                      onChange={(e) => updateProject(project.id, { github: e.target.value })}
                      placeholder="github.com/user/repo"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      <ExternalLink size={12} className="inline mr-1.5" />
                      Live Demo
                    </label>
                    <input
                      type="url"
                      value={project.liveDemo || ''}
                      onChange={(e) => updateProject(project.id, { liveDemo: e.target.value })}
                      placeholder="myproject.com"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {projects.length > 0 && (
        <button onClick={handleAdd} className="btn-secondary gap-2 w-full justify-center text-xs">
          <Plus size={13} />
          Add Another Project
        </button>
      )}
    </div>
  );
}
