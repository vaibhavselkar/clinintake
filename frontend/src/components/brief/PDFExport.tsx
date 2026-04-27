import { Download } from 'lucide-react';
import { ClinicalBrief } from '../../types/clinical.types';
import { generateClinicalBriefPDF } from '../../utils/pdf.generator';
import { Button } from '../shared/Button';
import { useState } from 'react';

interface PDFExportProps {
  brief: ClinicalBrief;
  patientName: string;
  patientAge: number;
  patientSex: 'male' | 'female';
}

export function PDFExport({ brief, patientName, patientAge, patientSex }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  function handleExport() {
    setIsGenerating(true);
    try {
      generateClinicalBriefPDF(brief, patientName, patientAge, patientSex);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Button onClick={handleExport} loading={isGenerating} size="md">
      <Download className="w-4 h-4" />
      Export PDF
    </Button>
  );
}
