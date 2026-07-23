import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import type { ResumeData } from '@/types/resume';

export function ProfessionalTemplate({ resume }: { resume: ResumeData }) {
  const visibleSections = resume.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="w-full p-10 text-slate-900 text-[13px] leading-[1.6]">
      {/* Header */}
      <div className="text-center mb-6 pb-6 border-b-2" style={{ borderColor: 'var(--theme-primary)' }}>
        <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase" style={{ color: 'var(--theme-primary)' }}>
          {resume.personal.fullName || 'Your Name'}
        </h1>
        <div className="text-sm font-semibold tracking-widest uppercase mb-4 text-slate-600">
          {resume.personal.jobTitle || 'Job Title'}
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-slate-600">
          {resume.personal.email && <span>{resume.personal.email}</span>}
          {resume.personal.phone && <span>• {resume.personal.phone}</span>}
          {resume.personal.address && <span>• {resume.personal.address}</span>}
          {resume.personal.linkedin && <span>• {resume.personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </div>

      <div className="space-y-6">
        {visibleSections.map(section => {
          if (section.id === 'summary' && resume.summary) {
            return (
              <div key="summary">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--theme-primary)' }}>
                  Professional Summary
                </h2>
                <p className="text-justify text-slate-800">{resume.summary}</p>
              </div>
            );
          }
          if (section.id === 'experience' && resume.experience.length > 0) {
            return (
              <div key="experience">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--theme-primary)' }}>
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-[14px] text-slate-900">{exp.position}</h3>
                        <span className="text-xs font-semibold text-slate-600 shrink-0 ml-4">
                          {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-sm font-medium italic text-slate-700 mb-2">
                        {exp.company}{exp.location ? `, ${exp.location}` : ''}
                      </div>
                      {exp.responsibilities && (
                        <div 
                          className="pl-4 [&>p]:mb-1 space-y-1 text-slate-800" 
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
              <div key="education">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--theme-primary)' }}>
                  Education
                </h2>
                <div className="space-y-3">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <div className="font-bold text-[14px] text-slate-900">
                          {edu.degree}{edu.major && ` in ${edu.major}`}
                        </div>
                        <div className="text-sm text-slate-700">{edu.school}</div>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 text-right">
                        {edu.graduationYear}
                        {edu.gpa && <div>GPA: {edu.gpa}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section.id === 'skills' && resume.skills.length > 0) {
            return (
              <div key="skills">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--theme-primary)' }}>
                  Core Competencies
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-800">
                  {resume.skills.map((skill, index) => (
                    <span key={skill.id}>
                      {skill.name}
                      {index < resume.skills.length - 1 && <span className="text-slate-400 mx-2">•</span>}
                    </span>
                  ))}
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
