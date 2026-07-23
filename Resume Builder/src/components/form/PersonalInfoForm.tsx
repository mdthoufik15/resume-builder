'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';
import type { PersonalInfo } from '@/types/resume';

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  address: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  github: z.string().optional().default(''),
  portfolio: z.string().optional().default(''),
});

type FormValues = z.infer<typeof schema>;

const FIELD_CONFIG = [
  { name: 'fullName' as const, label: 'Full Name', icon: User, placeholder: 'John Doe', required: true, type: 'text', col: 'full' },
  { name: 'jobTitle' as const, label: 'Job Title', icon: Briefcase, placeholder: 'Senior Software Engineer', required: true, type: 'text', col: 'full' },
  { name: 'email' as const, label: 'Email Address', icon: Mail, placeholder: 'john@example.com', required: true, type: 'email', col: 'half' },
  { name: 'phone' as const, label: 'Phone Number', icon: Phone, placeholder: '+1 (555) 000-0000', required: true, type: 'tel', col: 'half' },
  { name: 'address' as const, label: 'Address / City', icon: MapPin, placeholder: 'New York, NY', required: false, type: 'text', col: 'full' },
  { name: 'linkedin' as const, label: 'LinkedIn URL', icon: Linkedin, placeholder: 'linkedin.com/in/johndoe', required: false, type: 'url', col: 'full' },
  { name: 'github' as const, label: 'GitHub', icon: Github, placeholder: 'github.com/johndoe', required: false, type: 'url', col: 'half' },
  { name: 'portfolio' as const, label: 'Portfolio / Website', icon: Globe, placeholder: 'johndoe.com', required: false, type: 'url', col: 'half' },
];

export function PersonalInfoForm() {
  const { getActiveResume, updatePersonal } = useResumeStore();
  const resume = getActiveResume();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: resume?.personal || {},
    mode: 'onChange',
  });

  // Live sync to store
  useEffect(() => {
    const subscription = watch((values) => {
      updatePersonal(values as Partial<PersonalInfo>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updatePersonal]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {FIELD_CONFIG.map((field) => {
        const Icon = field.icon;
        const error = errors[field.name];
        return (
          <div key={field.name} className={field.col === 'full' ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
            <label className="form-label" htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <div className="relative">
              <Icon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                {...register(field.name)}
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className={`form-input pl-9 ${error ? 'error' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${field.name}-error` : undefined}
              />
            </div>
            {error && (
              <p id={`${field.name}-error`} className="text-xs text-red-500 mt-1" role="alert">
                {error.message}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
