import type { ColorTheme, TemplateOption, FontId } from '@/types/resume';

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#3b82f6',
    hex: '#2563eb',
  },
  {
    id: 'green',
    name: 'Emerald',
    primary: '#059669',
    secondary: '#047857',
    accent: '#10b981',
    hex: '#059669',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#7c3aed',
    secondary: '#6d28d9',
    accent: '#8b5cf6',
    hex: '#7c3aed',
  },
  {
    id: 'black',
    name: 'Midnight',
    primary: '#1f2937',
    secondary: '#111827',
    accent: '#374151',
    hex: '#1f2937',
  },
  {
    id: 'navy',
    name: 'Navy',
    primary: '#1e3a5f',
    secondary: '#152c4a',
    accent: '#2d5a8e',
    hex: '#1e3a5f',
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    primary: '#e11d48',
    secondary: '#be123c',
    accent: '#f43f5e',
    hex: '#e11d48',
  },
];

export const TEMPLATES: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column layout with vibrant sidebar',
    preview: '🎨',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean single-column, corporate style',
    preview: '💼',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold typography with premium accents',
    preview: '👔',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Elegant whitespace-focused design',
    preview: '✨',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Asymmetric layout for creative roles',
    preview: '🎭',
  },
  {
    id: 'ats-clean',
    name: 'ATS Clean',
    description: 'Optimized for ATS parsing systems',
    preview: '🤖',
  },
];

export const FONTS: { id: FontId; name: string; family: string }[] = [
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif" },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif" },
  { id: 'lato', name: 'Lato', family: "'Lato', sans-serif" },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif" },
];

export function getColorTheme(id: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://${url}`;
}
