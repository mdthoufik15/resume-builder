import type { ResumeData } from '@/types/resume';

const ACTION_VERBS = [
  'Achieved', 'Accelerated', 'Accomplished', 'Built', 'Championed',
  'Collaborated', 'Designed', 'Developed', 'Delivered', 'Enhanced',
  'Established', 'Executed', 'Expanded', 'Generated', 'Implemented',
  'Improved', 'Increased', 'Launched', 'Led', 'Managed',
  'Optimized', 'Orchestrated', 'Oversaw', 'Pioneered', 'Reduced',
  'Restructured', 'Scaled', 'Spearheaded', 'Streamlined', 'Transformed',
];

const ATS_KEYWORDS = [
  'cross-functional', 'stakeholder', 'agile', 'scrum', 'KPI',
  'ROI', 'scalable', 'architecture', 'performance', 'optimization',
  'collaboration', 'leadership', 'data-driven', 'metrics', 'strategy',
];

/**
 * Enhance a professional summary using local AI rules
 */
export function enhanceSummary(summary: string, jobTitle: string): string {
  if (!summary.trim()) return summary;

  let enhanced = summary.trim();

  // Capitalize first letter
  enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);

  // Ensure it ends with a period
  if (!enhanced.endsWith('.')) enhanced += '.';

  // Add impact if not present
  if (!enhanced.toLowerCase().includes('passionate') && 
      !enhanced.toLowerCase().includes('experienced') &&
      !enhanced.toLowerCase().includes('results-driven')) {
    enhanced = `Results-driven ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)}`;
  }

  return enhanced;
}

/**
 * Generate a professional summary from career details
 */
export function generateSummaryFromDetails(
  jobTitle: string,
  yearsExperience: number,
  topSkills: string[],
  industry?: string
): string {
  const skills = topSkills.slice(0, 4).join(', ');
  const exp = yearsExperience === 0 ? 'entry-level' : `${yearsExperience}+ years of`;
  const industryStr = industry ? ` in the ${industry} industry` : '';
  
  return `Results-driven ${jobTitle} with ${exp} experience${industryStr}. Skilled in ${skills}, with a proven track record of delivering high-impact solutions. Passionate about leveraging technology to drive business growth and improve operational efficiency. Strong collaborator who thrives in fast-paced, cross-functional environments.`;
}

/**
 * Enhance work experience responsibilities into ATS-optimized bullet points
 */
export function enhanceResponsibilities(responsibilities: string, position: string): string {
  if (!responsibilities.trim()) return responsibilities;

  const lines = responsibilities
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const enhanced = lines.map((line) => {
    // Remove bullet if already has one
    let text = line.replace(/^[•\-\*]\s*/, '').trim();

    // Fix common weak starts
    const weakStarts: Record<string, string> = {
      'worked on': 'Developed',
      'helped with': 'Collaborated on',
      'was responsible for': 'Managed',
      'responsible for': 'Managed',
      'did': 'Executed',
      'made': 'Created',
      'did work on': 'Developed',
      'worked with': 'Collaborated with',
    };

    const lowerText = text.toLowerCase();
    for (const [weak, strong] of Object.entries(weakStarts)) {
      if (lowerText.startsWith(weak)) {
        text = strong + text.slice(weak.length);
        break;
      }
    }

    // Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);

    // Ensure ends with period
    if (!text.endsWith('.')) text += '.';

    // Add measurable impact if none exists
    const hasNumbers = /\d+/.test(text);
    const hasPercent = /\d+%/.test(text);
    
    if (!hasNumbers && !hasPercent && text.length < 120) {
      const impacts = [
        ' resulting in improved team efficiency.',
        ' contributing to a 20%+ increase in productivity.',
        ' reducing processing time by an estimated 30%.',
        ' improving code quality and maintainability.',
        ' enhancing user experience and engagement.',
        ' meeting project deadlines ahead of schedule.',
      ];
      const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
      // Only add if sentence doesn't already end with period before we add
      if (text.endsWith('.')) {
        text = text.slice(0, -1) + randomImpact;
      }
    }

    return `• ${text}`;
  });

  return enhanced.join('\n');
}

/**
 * Enhance a project description
 */
export function enhanceProjectDescription(description: string, technologies: string): string {
  if (!description.trim()) return description;

  let enhanced = description.trim();
  enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
  if (!enhanced.endsWith('.')) enhanced += '.';

  // Add tech stack mention if not already there
  if (technologies && !enhanced.toLowerCase().includes(technologies.split(',')[0]?.toLowerCase())) {
    enhanced += ` Built using ${technologies}.`;
  }

  return enhanced;
}

/**
 * Full AI enhancement of resume data (local implementation)
 */
export async function enhanceResumeLocally(data: Partial<ResumeData>): Promise<Partial<ResumeData>> {
  const enhanced = { ...data };

  // Enhance summary
  if (enhanced.summary) {
    enhanced.summary = enhanceSummary(enhanced.summary, enhanced.personal?.jobTitle || '');
  }

  // Enhance experience
  if (enhanced.experience) {
    enhanced.experience = enhanced.experience.map((exp) => ({
      ...exp,
      responsibilities: enhanceResponsibilities(exp.responsibilities, exp.position),
    }));
  }

  // Enhance projects
  if (enhanced.projects) {
    enhanced.projects = enhanced.projects.map((proj) => ({
      ...proj,
      description: enhanceProjectDescription(proj.description, proj.technologies),
    }));
  }

  return enhanced;
}

/**
 * Call the AI API endpoint (Gemini or local fallback)
 */
export async function callAIEnhancement(
  data: Partial<ResumeData>,
  type: 'summary' | 'experience' | 'project' | 'full' = 'full'
): Promise<Partial<ResumeData>> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, type }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Fallback to local enhancement
  }

  return enhanceResumeLocally(data);
}
