'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/hooks/useResumeStore';

export default function HomePage() {
  const router = useRouter();
  const { resumes, createResume } = useResumeStore();

  useEffect(() => {
    if (resumes.length > 0) {
      router.replace('/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [resumes, router, createResume]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-xl font-bold">AI</span>
        </div>
        <p className="text-slate-500 text-sm">Loading your workspace...</p>
      </div>
    </div>
  );
}
