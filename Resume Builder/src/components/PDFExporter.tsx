'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { ResumeData } from '@/types/resume';

interface PDFExporterProps {
  resume: ResumeData;
}

export function PDFExporter({ resume }: PDFExporterProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('resume-preview-content');
      if (!element) throw new Error('Preview element not found');

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="btn-secondary text-xs px-3 py-1.5 gap-1.5"
    >
      {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      <span className="hidden sm:inline">{isExporting ? 'Generating...' : 'Download PDF'}</span>
    </button>
  );
}
