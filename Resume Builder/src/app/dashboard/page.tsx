'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FileText, Copy, Trash2, Edit3, Download,
  Moon, Sun, Sparkles, Clock, MoreVertical,
  CheckCircle, Search, FilePlus
} from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import type { ResumeData } from '@/types/resume';
import { TEMPLATES, COLOR_THEMES } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const {
    resumes, isDarkMode, createResume, duplicateResume,
    deleteResume, renameResume, setActiveResume, toggleDarkMode
  } = useResumeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filtered = resumes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    const id = createResume('My Resume');
    router.push(`/builder/${id}`);
  };

  const handleEdit = (id: string) => {
    setActiveResume(id);
    router.push(`/builder/${id}`);
  };

  const handleDuplicate = (id: string) => {
    const newId = duplicateResume(id);
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    deleteResume(id);
    setDeleteConfirmId(null);
    setOpenMenuId(null);
  };

  const handleRename = (id: string) => {
    if (renameValue.trim()) {
      renameResume(id, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
    setOpenMenuId(null);
  };

  const startRename = (resume: ResumeData) => {
    setRenamingId(resume.id);
    setRenameValue(resume.name);
    setOpenMenuId(null);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300`}>
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 glass border-b border-slate-200/80 dark:border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                AI
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                  ResumeAI
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Resume Builder</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="btn-ghost w-9 h-9 p-0 rounded-xl flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4.5 h-4.5 text-amber-400" size={18} />
                ) : (
                  <Moon className="w-4.5 h-4.5" size={18} />
                )}
              </button>
              <button onClick={handleCreate} className="btn-primary gap-2">
                <Plus size={16} />
                <span className="hidden sm:inline">New Resume</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 dark:text-white"
          >
            My Resumes
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} saved locally
          </p>
        </div>

        {/* Search bar */}
        {resumes.length > 0 && (
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-9"
            />
          </div>
        )}

        {/* Empty state */}
        {resumes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #dbeafe, #ede9fe)' }}>
              <FilePlus className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              No resumes yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              Create your first AI-powered resume in minutes. Choose a template and start building.
            </p>
            <button onClick={handleCreate} className="btn-primary gap-2 text-base px-6 py-3">
              <Sparkles size={18} />
              Create My First Resume
            </button>
          </motion.div>
        )}

        {/* Resume grid */}
        <AnimatePresence>
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* Create new card */}
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleCreate}
                className="group relative flex flex-col items-center justify-center h-52 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 flex items-center justify-center mb-3 transition-colors">
                  <Plus className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  New Resume
                </span>
              </motion.button>

              {/* Resume cards */}
              {filtered.map((resume, index) => {
                const template = TEMPLATES.find((t) => t.id === resume.template);
                const theme = COLOR_THEMES.find((t) => t.id === resume.colorTheme);
                const isRenaming = renamingId === resume.id;
                const isMenuOpen = openMenuId === resume.id;
                const isDeleteConfirm = deleteConfirmId === resume.id;

                return (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="card group relative overflow-hidden cursor-pointer"
                    onClick={() => !isMenuOpen && !isRenaming && handleEdit(resume.id)}
                  >
                    {/* Template preview thumbnail */}
                    <div
                      className="h-32 flex items-center justify-center text-5xl relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${theme?.primary}22, ${theme?.accent}44)` }}
                    >
                      {/* Mini resume preview */}
                      <div className="absolute inset-0 flex flex-col gap-1 p-3 opacity-60">
                        <div className="h-3 rounded-full w-2/3" style={{ background: theme?.primary }}></div>
                        <div className="h-1.5 rounded-full w-1/2 bg-slate-300"></div>
                        <div className="mt-1 flex gap-1.5">
                          <div className="flex-1 space-y-1">
                            <div className="h-1 rounded-full bg-slate-300 w-full"></div>
                            <div className="h-1 rounded-full bg-slate-300 w-5/6"></div>
                            <div className="h-1 rounded-full bg-slate-300 w-4/6"></div>
                          </div>
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="h-1.5 rounded-full w-1/3" style={{ background: theme?.primary + '88' }}></div>
                          <div className="h-1 rounded-full bg-slate-300 w-full"></div>
                          <div className="h-1 rounded-full bg-slate-300 w-5/6"></div>
                        </div>
                      </div>
                      <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
                        style={{ background: theme?.primary }}>
                        <span>{template?.preview}</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      {isRenaming ? (
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleRename(resume.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(resume.id);
                            if (e.key === 'Escape') {
                              setRenamingId(null);
                              setRenameValue('');
                            }
                          }}
                          className="form-input text-sm font-semibold"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight truncate">
                          {resume.name}
                        </h3>
                      )}

                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {template?.name}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: theme?.primary }}
                        ></div>
                      </div>

                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 dark:text-slate-500">
                        <Clock size={11} />
                        <span>{formatDate(resume.updatedAt)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(resume.id); }}
                          className="flex-1 btn-secondary text-xs py-1.5 justify-center"
                        >
                          <Edit3 size={12} />
                          Edit
                        </button>
                        
                        {/* More menu */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setOpenMenuId(isMenuOpen ? null : resume.id)}
                            className="btn-ghost w-8 h-8 p-0 rounded-lg flex items-center justify-center"
                          >
                            <MoreVertical size={14} />
                          </button>

                          <AnimatePresence>
                            {isMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                                className="absolute right-0 bottom-full mb-1 w-44 card shadow-xl z-50 p-1"
                              >
                                <button
                                  onClick={() => startRename(resume)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                                >
                                  <Edit3 size={13} /> Rename
                                </button>
                                <button
                                  onClick={() => handleDuplicate(resume.id)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                                >
                                  <Copy size={13} /> Duplicate
                                </button>
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                {isDeleteConfirm ? (
                                  <div className="px-3 py-2">
                                    <p className="text-xs text-red-600 dark:text-red-400 mb-2">Delete permanently?</p>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleDelete(resume.id)}
                                        className="flex-1 text-xs py-1 rounded-lg bg-red-500 text-white font-medium"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="flex-1 text-xs py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmId(resume.id)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* No results */}
        {resumes.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No resumes match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}
