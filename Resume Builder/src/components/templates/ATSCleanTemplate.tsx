import type { ResumeData } from '@/types/resume';

export function ATSCleanTemplate({ resume }: { resume: ResumeData }) {
  const visibleSections = resume.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="w-full p-12 text-black text-[11pt] font-serif leading-[1.5]">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-[24pt] font-bold mb-1">
          {resume.personal.fullName || 'Your Name'}
        </h1>
        <div className="text-[12pt] mb-2 font-semibold">
          {resume.personal.jobTitle || 'Job Title'}
        </div>
        
        <div className="text-[10pt] flex flex-wrap justify-center items-center">
          {resume.personal.address && <span>{resume.personal.address} | </span>}
          {resume.personal.phone && <span> {resume.personal.phone} | </span>}
          {resume.personal.email && <span> {resume.personal.email} | </span>}
          {resume.personal.linkedin && <span> {resume.personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </div>

      <div className="space-y-4">
        {visibleSections.map(section => {
          if (section.id === 'summary' && resume.summary) {
            return (
              <div key="summary">
                <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">
                  Professional Summary
                </h2>
                <p className="text-justify">{resume.summary}</p>
              </div>
            );
          }
          if (section.id === 'experience' && resume.experience.length > 0) {
            return (
              <div key="experience">
                <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">
                  Experience
                </h2>
                <div className="space-y-3">
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between font-bold">
                        <span>{exp.position}</span>
                        <span>
                          {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="italic mb-1">
                        {exp.company}{exp.location ? `, ${exp.location}` : ''}
                      </div>
                      {exp.responsibilities && (
                        <div 
                          className="pl-4 [&>p]:mb-1 space-y-1" 
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
                <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {resume.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between font-bold">
                        <span>{edu.school}</span>
                        <span>{edu.graduationYear}</span>
                      </div>
                      <div className="italic">
                        {edu.degree}{edu.major && ` in ${edu.major}`}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
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
                <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">
                  Skills
                </h2>
                <div>
                  {resume.skills.map(s => s.name).join(', ')}
                </div>
              </div>
            );
          }
          if (section.id === 'projects' && resume.projects.length > 0) {
            return (
              <div key="projects">
                <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">
                  Projects
                </h2>
                <div className="space-y-3">
                  {resume.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="font-bold">{proj.name}</div>
                      {proj.technologies && <div className="italic text-[10pt] mb-1">Technologies: {proj.technologies}</div>}
                      <p>{proj.description}</p>
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
