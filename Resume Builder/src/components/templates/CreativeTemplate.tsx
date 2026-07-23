import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import type { ResumeData } from '@/types/resume';

export function CreativeTemplate({ resume }: { resume: ResumeData }) {
  const visibleSections = resume.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="w-full min-h-[297mm] text-slate-800 text-[13px] leading-[1.6] bg-[#fdfdfd] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3" style={{ backgroundColor: 'var(--theme-primary)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3" style={{ backgroundColor: 'var(--theme-accent)' }} />

      <div className="relative z-10 p-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b-2 pb-6" style={{ borderColor: 'var(--theme-primary)' }}>
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--theme-primary)' }}>
              {resume.personal.fullName || 'Your Name'}
            </h1>
            <div className="text-xl font-medium text-slate-600 tracking-wide">
              {resume.personal.jobTitle || 'Job Title'}
            </div>
          </div>
          <div className="text-right space-y-1 text-[11px] font-medium text-slate-500">
            {resume.personal.email && <div>{resume.personal.email}</div>}
            {resume.personal.phone && <div>{resume.personal.phone}</div>}
            {resume.personal.address && <div>{resume.personal.address}</div>}
            {resume.personal.linkedin && <div>{resume.personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</div>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="col-span-2 space-y-8">
            {visibleSections.map(section => {
              if (section.id === 'summary' && resume.summary) {
                return (
                  <div key="summary">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      <span className="w-8 h-1 rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}></span>
                      Profile
                    </h2>
                    <p className="text-slate-700 leading-relaxed text-justify">{resume.summary}</p>
                  </div>
                );
              }
              if (section.id === 'experience' && resume.experience.length > 0) {
                return (
                  <div key="experience">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-8 h-1 rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}></span>
                      Experience
                    </h2>
                    <div className="space-y-6">
                      {resume.experience.map((exp) => (
                        <div key={exp.id} className="relative pl-6 border-l-2" style={{ borderColor: 'var(--theme-primary)33' }}>
                          <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
                          <h3 className="font-bold text-[15px]">{exp.position}</h3>
                          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--theme-accent)' }}>
                            {exp.company} <span className="text-slate-400 font-normal mx-1">•</span> {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                          </div>
                          {exp.responsibilities && (
                            <div 
                              className="[&>p]:mb-1.5 space-y-1.5 text-slate-600" 
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

          {/* Sidebar */}
          <div className="col-span-1 space-y-8">
            {visibleSections.map(section => {
              if (section.id === 'skills' && resume.skills.length > 0) {
                return (
                  <div key="skills">
                    <h2 className="text-xl font-bold mb-4">Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ backgroundColor: 'var(--theme-primary)15', color: 'var(--theme-primary)' }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              if (section.id === 'education' && resume.education.length > 0) {
                return (
                  <div key="education">
                    <h2 className="text-xl font-bold mb-4">Education</h2>
                    <div className="space-y-4">
                      {resume.education.map((edu) => (
                        <div key={edu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-bold text-[13px] text-slate-800">{edu.degree}</div>
                          {edu.major && <div className="text-xs font-semibold text-slate-600 mt-1">{edu.major}</div>}
                          <div className="text-xs text-slate-500 mt-2">{edu.school}</div>
                          <div className="text-[11px] font-bold text-slate-400 mt-1">{edu.graduationYear}</div>
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
    </div>
  );
}
