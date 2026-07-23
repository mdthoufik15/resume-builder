'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';

export function CertificationsForm() {
  const { getActiveResume, addCertification, updateCertification, removeCertification } = useResumeStore();
  const resume = getActiveResume();
  const certs = resume?.certifications || [];

  return (
    <div className="space-y-3">
      <div className="rounded-xl p-3.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
        💡 Certifications can boost your ATS score and differentiate you from other candidates.
      </div>

      {certs.map((cert, index) => (
        <div key={cert.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Certification {index + 1}
            </p>
            <button
              onClick={() => removeCertification(cert.id)}
              className="btn-ghost w-7 h-7 p-0 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div>
            <label className="form-label">Certification Name</label>
            <input
              type="text"
              value={cert.name}
              onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
              placeholder="AWS Certified Solutions Architect"
              className="form-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Issuing Organization</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                placeholder="Amazon Web Services"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Date Issued</label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Certificate URL (optional)</label>
            <input
              type="url"
              value={cert.url || ''}
              onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
              placeholder="https://..."
              className="form-input"
            />
          </div>
        </div>
      ))}

      <button onClick={addCertification} className="btn-secondary gap-2 w-full justify-center text-xs">
        <Plus size={13} />
        Add Certification
      </button>
    </div>
  );
}

export function AwardsForm() {
  const { getActiveResume, addAward, updateAward, removeAward } = useResumeStore();
  const resume = getActiveResume();
  const awards = resume?.awards || [];

  return (
    <div className="space-y-3">
      {awards.map((award, index) => (
        <div key={award.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Award {index + 1}
            </p>
            <button
              onClick={() => removeAward(award.id)}
              className="btn-ghost w-7 h-7 p-0 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="form-label">Award Title</label>
              <input
                type="text"
                value={award.title}
                onChange={(e) => updateAward(award.id, { title: e.target.value })}
                placeholder="Employee of the Year"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Issuer / Organization</label>
              <input
                type="text"
                value={award.issuer}
                onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
                placeholder="Acme Corporation"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                type="month"
                value={award.date}
                onChange={(e) => updateAward(award.id, { date: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="col-span-2">
              <label className="form-label">Description (optional)</label>
              <textarea
                value={award.description || ''}
                onChange={(e) => updateAward(award.id, { description: e.target.value })}
                placeholder="Brief description of what this award recognizes..."
                className="form-input resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={addAward} className="btn-secondary gap-2 w-full justify-center text-xs">
        <Plus size={13} />
        Add Award
      </button>
    </div>
  );
}

export function AchievementsForm() {
  const { getActiveResume, addAchievement, updateAchievement, removeAchievement } = useResumeStore();
  const resume = getActiveResume();
  const achievements = resume?.achievements || [];

  return (
    <div className="space-y-3">
      {achievements.map((item, index) => (
        <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Achievement {index + 1}
            </p>
            <button
              onClick={() => removeAchievement(item.id)}
              className="btn-ghost w-7 h-7 p-0 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateAchievement(item.id, { title: e.target.value })}
              placeholder="Top Performer Q3 2024"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              value={item.description}
              onChange={(e) => updateAchievement(item.id, { description: e.target.value })}
              placeholder="Describe what you achieved and its impact..."
              className="form-input resize-none"
              rows={2}
            />
          </div>
        </div>
      ))}

      <button onClick={addAchievement} className="btn-secondary gap-2 w-full justify-center text-xs">
        <Plus size={13} />
        Add Achievement
      </button>
    </div>
  );
}

export function InterestsForm() {
  const { getActiveResume, updateInterests } = useResumeStore();
  const resume = getActiveResume();

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
        💡 Interests can help show personality and cultural fit. Keep it professional and relevant.
      </div>
      <div>
        <label className="form-label">Interests & Hobbies</label>
        <textarea
          value={resume?.interests || ''}
          onChange={(e) => updateInterests(e.target.value)}
          placeholder="Open source development, hiking, reading tech blogs, chess, photography..."
          className="form-input resize-none"
          rows={4}
        />
        <p className="text-xs text-slate-400 mt-1">Separate interests with commas or list them on separate lines.</p>
      </div>
    </div>
  );
}
