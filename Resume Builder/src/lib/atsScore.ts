import type { ResumeData, ATSScore } from '@/types/resume';

const ACTION_VERBS = [
  'achieved', 'accelerated', 'accomplished', 'built', 'championed',
  'collaborated', 'designed', 'developed', 'delivered', 'enhanced',
  'established', 'executed', 'expanded', 'generated', 'implemented',
  'improved', 'increased', 'launched', 'led', 'managed',
  'optimized', 'orchestrated', 'oversaw', 'pioneered', 'reduced',
  'restructured', 'scaled', 'spearheaded', 'streamlined', 'transformed',
  'created', 'analyzed', 'coordinated', 'directed', 'facilitated',
];

const ATS_KEYWORDS = [
  'experience', 'skills', 'developed', 'managed', 'led', 'team',
  'project', 'results', 'performance', 'agile', 'data', 'analysis',
  'communication', 'problem-solving', 'collaboration',
];

export function calculateATSScore(resume: ResumeData): ATSScore {
  const suggestions: string[] = [];
  const breakdown = {
    hasSummary: false,
    hasWorkExperience: false,
    hasEducation: false,
    hasSkills: false,
    hasKeywords: false,
    hasActionVerbs: false,
    hasMeasurableAchievements: false,
    summaryLength: false,
    skillsCount: false,
    experienceBullets: false,
  };

  // Check summary
  if (resume.summary && resume.summary.trim().length > 30) {
    breakdown.hasSummary = true;
    if (resume.summary.length >= 100 && resume.summary.length <= 500) {
      breakdown.summaryLength = true;
    } else {
      suggestions.push(
        resume.summary.length < 100
          ? '📝 Expand your professional summary to at least 100 characters'
          : '✂️ Shorten your professional summary to under 500 characters'
      );
    }
  } else {
    suggestions.push('📝 Add a compelling professional summary to improve ATS score');
  }

  // Check work experience
  if (resume.experience.length > 0) {
    breakdown.hasWorkExperience = true;
    
    // Check for bullet points / action verbs
    const allResponsibilities = resume.experience
      .map((e) => e.responsibilities.toLowerCase())
      .join(' ');
    
    const usedActionVerbs = ACTION_VERBS.filter((v) =>
      allResponsibilities.includes(v)
    );
    
    if (usedActionVerbs.length >= 3) {
      breakdown.hasActionVerbs = true;
    } else {
      suggestions.push('⚡ Use more action verbs (e.g., Developed, Led, Optimized) in work experience');
    }

    // Check for measurable achievements
    const hasNumbers = /\d+%|\d+ (?:users|clients|projects|team|revenue|sales|customers|hours|days|weeks|months)/i.test(allResponsibilities);
    if (hasNumbers) {
      breakdown.hasMeasurableAchievements = true;
    } else {
      suggestions.push('📊 Add measurable achievements (e.g., "Increased performance by 35%")');
    }

    // Check for bullet structure
    const hasBullets = resume.experience.some((e) =>
      e.responsibilities.includes('•') || e.responsibilities.includes('\n')
    );
    if (hasBullets) {
      breakdown.experienceBullets = true;
    } else {
      suggestions.push('📋 Format responsibilities as bullet points for better readability');
    }
  } else {
    suggestions.push('💼 Add at least one work experience entry');
  }

  // Check education
  if (resume.education.length > 0) {
    breakdown.hasEducation = true;
  } else {
    suggestions.push('🎓 Add your educational background');
  }

  // Check skills
  if (resume.skills.length > 0) {
    breakdown.hasSkills = true;
    if (resume.skills.length >= 8) {
      breakdown.skillsCount = true;
    } else {
      suggestions.push(`🔧 Add more skills (you have ${resume.skills.length}, aim for 8+)`);
    }
  } else {
    suggestions.push('🔧 Add technical and soft skills to your resume');
  }

  // Check ATS keyword presence
  const allText = [
    resume.summary,
    ...resume.experience.map((e) => e.responsibilities),
    ...resume.skills.map((s) => s.name),
  ]
    .join(' ')
    .toLowerCase();

  const foundKeywords = ATS_KEYWORDS.filter((k) => allText.includes(k));
  if (foundKeywords.length >= 5) {
    breakdown.hasKeywords = true;
  } else {
    suggestions.push('🔍 Include more industry keywords relevant to your target role');
  }

  // Check for contact info completeness
  const hasEmail = !!resume.personal.email;
  const hasPhone = !!resume.personal.phone;
  if (!hasEmail || !hasPhone) {
    suggestions.push('📞 Complete your contact information (email and phone are required)');
  }

  // Check for LinkedIn
  if (!resume.personal.linkedin) {
    suggestions.push('🔗 Add your LinkedIn profile URL to increase visibility');
  }

  // Check certifications
  if (resume.certifications.length === 0) {
    suggestions.push('🏆 Consider adding certifications to boost your profile');
  }

  // Calculate score
  const trueValues = Object.values(breakdown).filter(Boolean).length;
  const maxValues = Object.keys(breakdown).length;
  
  // Base score + bonus for completeness
  let score = Math.round((trueValues / maxValues) * 85);
  
  // Bonus points
  if (resume.personal.linkedin) score += 5;
  if (resume.certifications.length > 0) score += 5;
  if (resume.projects.length > 0) score += 3;
  if (resume.summary.length > 150) score += 2;
  
  score = Math.min(100, Math.max(0, score));

  // Add positive suggestions if score is good
  if (score >= 80) {
    suggestions.unshift('✅ Great job! Your resume is well-optimized for ATS systems');
  }

  return {
    overall: score,
    breakdown,
    suggestions: suggestions.slice(0, 8), // Max 8 suggestions
  };
}
