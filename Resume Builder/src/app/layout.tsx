import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Resume Builder — Create ATS-Optimized Resumes',
  description:
    'Build a professional, ATS-optimized resume in minutes with AI-powered content enhancement, 6 beautiful templates, and instant PDF download.',
  keywords:
    'resume builder, AI resume, ATS resume, professional resume, CV builder, job application',
  openGraph: {
    title: 'AI Resume Builder',
    description: 'Create stunning, ATS-optimized resumes with AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}
