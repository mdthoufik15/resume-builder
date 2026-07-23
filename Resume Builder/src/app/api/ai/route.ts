import { NextRequest, NextResponse } from 'next/server';
import { enhanceResumeLocally } from '@/lib/ai';
import type { ResumeData } from '@/types/resume';

export async function POST(request: NextRequest) {
  try {
    const { data, type } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Try Gemini if API key is available
    if (apiKey) {
      try {
        const result = await callGemini(apiKey, data, type);
        return NextResponse.json(result);
      } catch (err) {
        console.error('Gemini API failed, falling back to local:', err);
      }
    }

    // Local fallback
    const result = await enhanceResumeLocally(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI route error:', error);
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 });
  }
}

async function callGemini(
  apiKey: string,
  data: Partial<ResumeData>,
  type: string
): Promise<Partial<ResumeData>> {
  const prompt = buildPrompt(data, type);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');

  return JSON.parse(text);
}

function buildPrompt(data: Partial<ResumeData>, type: string): string {
  const jsonData = JSON.stringify(data, null, 2);

  const rules = `
Rules:
- Never fabricate experience, companies, or achievements
- Improve grammar and wording
- Use strong action verbs (Developed, Led, Optimized, etc.)
- Format bullets as "• Action verb + context + measurable result."
- Make content ATS-friendly with industry keywords
- Keep bullet points concise (max 20 words each)
- Correct all grammar errors
- Maintain consistent tense (past tense for past jobs, present for current)
- Return valid JSON matching the input structure exactly
`;

  if (type === 'summary') {
    return `${rules}
Improve this professional summary. Return JSON: {"summary": "improved summary here"}

Input:
${jsonData}`;
  }

  if (type === 'experience') {
    return `${rules}
Rewrite work experience responsibilities as powerful bullet points. Return JSON matching input structure.

Input:
${jsonData}`;
  }

  if (type === 'project') {
    return `${rules}
Improve project descriptions to be impactful and professional. Return JSON matching input structure.

Input:
${jsonData}`;
  }

  // Full enhancement
  return `${rules}
Enhance this entire resume. Improve the summary, rewrite experience bullets with action verbs, and improve project descriptions. Return JSON matching the exact input structure.

Input:
${jsonData}`;
}
