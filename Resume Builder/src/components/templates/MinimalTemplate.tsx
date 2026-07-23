import type { ResumeData } from '@/types/resume';

export function MinimalTemplate({ resume }: { resume: ResumeData }) {
  const visibleSections = resume.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="w-full p-12 text-slate-800 text-[12px] leading-[1.7] font-light">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-normal tracking-wide mb-2">
          {resume.personal.fullName || 'Your Name'}
        </h1>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-6" style={{ color: 'var(--theme-primary)' }}>
          {resume.personal.jobTitle || 'Job Title'}
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] tracking-wider text-slate-400">
          {resume.personal.email && <span>{resume.personal.email}</span>}
          {resume.personal.phone && <span>{resume.personal.phone}</span>}
          {resume.personal.address && <span>{resume.personal.address}</span>}
          {resume.personal.linkedin && <span>{resume.personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </div>

      <div className="space-y-10 max-w-3xl mx-auto">
        {visibleSections.map(section => {
          if (section.id === 'summary' && resume.summary) {
            return (
              <div key="summary" className="grid grid-cols-12 gap-6">
                <div className="col-span-3 text-[10px] uppercase tracking-[0.15em] text-slate-400 pt-1 text-right">
                  Profile
                </div>
                <div className="col-span-9 text-justify text-slate-600">
                  {resume.summary}
                </div>
              </div>
            );
          }
          if (section.id === 'experience' && resume.experience.length > 0) {
            return (
              <div key="experience" className="grid grid-cols-12 gap-6">
                <div className="col-span-3 text-[10px] uppercase tracking-[0.15em] text-slate-400 pt-1 text-right">
                  Experience
                </div>
                <div className="col-span-9 space-y-6">
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="mb-2">
                        <span className="font-medium text-[13px] text-slate-900">{exp.position}</span>
                        <span className="text-slate-400 mx-2">/</span>
                        <span className="text-slate-500">{exp.company}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-1">
                          {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.responsibilities && (
                        <div 
                          className="text-slate-600 space-y-1" 
                          dangerouslySetInnerHTML={{ __html: exp.responsibilities.replace(/\n/g, '<br/>') }} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section.id === 'education' && resume.education.length > 0) {
            return (
              <div key="education" className="grid grid-cols-12 gap-6">
                <div className="col-span-3 text-[10px] uppercase tracking-[0.15em] text-slate-400 pt-1 text-right">
                  Education
                </div>
                <div className="col-span-9 space-y-4">
                  {resume.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="font-medium text-[13px] text-slate-900">{edu.degree}</div>
                      <div className="text-slate-500 mt-0.5">{edu.school}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{edu.graduationYear}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section.id === 'skills' && resume.skills.length > 0) {
            return (
              <div key="skills" className="grid grid-cols-12 gap-6">
                <div className="col-span-3 text-[10px] uppercase tracking-[0.15em] text-slate-400 pt-1 text-right">
                  Skills
                </div>
                <div className="col-span-9 text-slate-600 leading-relaxed">
                  {resume.skills.map(s => s.name).join('  ·  ')}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
