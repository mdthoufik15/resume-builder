import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import type { ResumeData } from '@/types/resume';

export function ModernTemplate({ resume }: { resume: ResumeData }) {
  const visibleSections = resume.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="flex w-full h-full text-slate-800 text-[13px] leading-[1.6]">
      {/* Sidebar */}
      <div className="w-[30%] text-white p-8 flex flex-col gap-8 h-[297mm]" style={{ backgroundColor: 'var(--theme-primary)' }}>
        <div className="space-y-4 break-words">
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            {resume.personal.fullName || 'Your Name'}
          </h1>
          <div className="text-sm font-semibold opacity-90 uppercase tracking-widest text-[var(--theme-accent)]">
            {resume.personal.jobTitle || 'Job Title'}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-xs opacity-90">
          {resume.personal.email && (
            <div className="flex items-center gap-3">
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{resume.personal.email}</span>
            </div>
          )}
          {resume.personal.phone && (
            <div className="flex items-center gap-3">
              <Phone size={14} className="shrink-0" />
              <span>{resume.personal.phone}</span>
            </div>
          )}
          {resume.personal.address && (
            <div className="flex items-center gap-3">
              <MapPin size={14} className="shrink-0" />
              <span>{resume.personal.address}</span>
            </div>
          )}
          {resume.personal.linkedin && (
            <div className="flex items-center gap-3">
              <Linkedin size={14} className="shrink-0" />
              <span className="truncate">{resume.personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {resume.personal.github && (
            <div className="flex items-center gap-3">
              <Github size={14} className="shrink-0" />
              <span className="truncate">{resume.personal.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {resume.personal.portfolio && (
            <div className="flex items-center gap-3">
              <Globe size={14} className="shrink-0" />
              <span className="truncate">{resume.personal.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {resume.sections.find(s => s.id === 'skills')?.visible && resume.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b border-white/20">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education (moved to sidebar in modern) */}
        {resume.sections.find(s => s.id === 'education')?.visible && resume.education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b border-white/20">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-sm">{edu.degree}</div>
                  {edu.major && <div className="text-xs opacity-90">{edu.major}</div>}
                  <div className="text-xs opacity-80 mt-1">{edu.school}</div>
                  <div className="text-xs opacity-80">{edu.graduationYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[70%] p-8 pl-10 flex flex-col gap-6">
        {visibleSections.map(section => {
          if (section.id === 'summary' && resume.summary) {
            return (
              <div key="summary">
                <h2 className="text-[15px] font-bold uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' }}>
                  Profile
                </h2>
                <p className="text-justify">{resume.summary}</p>
              </div>
            );
          }
          if (section.id === 'experience' && resume.experience.length > 0) {
            return (
              <div key="experience">
                <h2 className="text-[15px] font-bold uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' }}>
                  Experience
                </h2>
                <div className="space-y-5">
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-[14px]">{exp.position}</h3>
                        <span className="text-xs text-slate-500 font-semibold shrink-0 ml-4">
                          {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-sm font-semibold mb-2" style={{ color: 'var(--theme-primary)' }}>
                        {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                      </div>
                      {exp.responsibilities && (
                        <div 
                          className="pl-3 [&>p]:mb-1 space-y-1 text-slate-700" 
                          dangerouslySetInnerHTML={{ __html: exp.responsibilities.replace(/\n/g, '<br/>') }} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (section.id === 'projects' && resume.projects.length > 0) {
            return (
              <div key="projects">
                <h2 className="text-[15px] font-bold uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' }}>
                  Projects
                </h2>
                <div className="space-y-4">
                  {resume.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-[14px]">{proj.name}</h3>
                        {(proj.github || proj.liveDemo) && (
                          <div className="flex gap-3 text-xs">
                            {proj.github && <span className="text-blue-600 font-medium">GitHub</span>}
                            {proj.liveDemo && <span className="text-blue-600 font-medium">Live Demo</span>}
                          </div>
                        )}
                      </div>
                      {proj.technologies && (
                        <div className="text-xs font-semibold text-slate-500 mb-1.5">{proj.technologies}</div>
                      )}
                      <p className="text-slate-700">{proj.description}</p>
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
  );
}
