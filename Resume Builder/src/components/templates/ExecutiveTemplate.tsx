import type { ResumeData } from '@/types/resume';

export function ExecutiveTemplate({ resume }: { resume: ResumeData }) {
  const visibleSections = resume.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="w-full p-10 text-[#2c3e50] text-[13px] leading-[1.6]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase" style={{ color: 'var(--theme-primary)' }}>
          {resume.personal.fullName || 'Your Name'}
        </h1>
        <div className="text-lg font-bold tracking-widest uppercase mb-3 text-slate-500">
          {resume.personal.jobTitle || 'Job Title'}
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold tracking-widest uppercase text-slate-400">
          {resume.personal.email && <span>{resume.personal.email}</span>}
          {resume.personal.phone && <span>• {resume.personal.phone}</span>}
          {resume.personal.address && <span>• {resume.personal.address}</span>}
          {resume.personal.linkedin && <span>• {resume.personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-8 space-y-8">
          {visibleSections.map(section => {
            if (section.id === 'summary' && resume.summary) {
              return (
                <div key="summary">
                  <h2 className="text-xl font-bold mb-3 border-b-4 pb-2" style={{ borderColor: 'var(--theme-accent)' }}>
                    Executive Summary
                  </h2>
                  <p className="text-justify text-sm leading-relaxed font-medium text-slate-700">{resume.summary}</p>
                </div>
              );
            }
            if (section.id === 'experience' && resume.experience.length > 0) {
              return (
                <div key="experience">
                  <h2 className="text-xl font-bold mb-4 border-b-4 pb-2" style={{ borderColor: 'var(--theme-accent)' }}>
                    Career History
                  </h2>
                  <div className="space-y-6">
                    {resume.experience.map((exp) => (
                      <div key={exp.id}>
                        <h3 className="font-bold text-[15px]">{exp.position}</h3>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                            {exp.company}{exp.location ? `, ${exp.location}` : ''}
                          </span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        {exp.responsibilities && (
                          <div 
                            className="pl-4 [&>p]:mb-1.5 space-y-1.5 text-sm text-slate-700 font-medium" 
                            dangerouslySetInnerHTML={{ __html: exp.responsibilities.replace(/\n/g, '<br/>') }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-8 pl-8 border-l border-slate-200">
          {visibleSections.map(section => {
            if (section.id === 'skills' && resume.skills.length > 0) {
              return (
                <div key="skills">
                  <h2 className="text-[15px] font-bold uppercase tracking-widest mb-4 pb-2 border-b-2" style={{ borderColor: 'var(--theme-accent)' }}>
                    Expertise
                  </h2>
                  <div className="flex flex-col gap-2">
                    {resume.skills.map((skill) => (
                      <div key={skill.id} className="text-sm font-bold text-slate-700">
                        • {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (section.id === 'education' && resume.education.length > 0) {
              return (
                <div key="education">
                  <h2 className="text-[15px] font-bold uppercase tracking-widest mb-4 pb-2 border-b-2" style={{ borderColor: 'var(--theme-accent)' }}>
                    Education
                  </h2>
                  <div className="space-y-4">
                    {resume.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="font-bold text-[13px]">{edu.degree}</div>
                        {edu.major && <div className="text-xs font-bold text-slate-600 mt-1">{edu.major}</div>}
                        <div className="text-xs text-slate-500 mt-1">{edu.school}</div>
                        <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase">{edu.graduationYear}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
