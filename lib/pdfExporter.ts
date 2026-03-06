import { jsPDF } from 'jspdf';
import { BookConfig } from './promptBuilder';

export interface GeneratedPage {
  id: string;
  pageNumber: number;
  subject: string;
  prompt: string;
  imageUrl?: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
}

export async function generatePdf(config: BookConfig, pages: GeneratedPage[]): Promise<Blob> {
  // Parse trim size (e.g., "8.5x11")
  const [width, height] = config.trimSize.split('x').map(Number);
  
  const doc = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'in',
    format: [width, height]
  });

  let isFirstPage = true;
  let actualPageNum = 1;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    
    if (!isFirstPage) {
      doc.addPage([width, height]);
    }
    isFirstPage = false;

    if (page.imageUrl) {
      // Calculate dimensions with margins
      const margin = config.margins;
      const safeWidth = width - (margin * 2);
      const safeHeight = height - (margin * 2);
      
      // Add image
      doc.addImage(page.imageUrl, 'PNG', margin, margin, safeWidth, safeHeight);
    }

    if (config.pageNumbers) {
      doc.setFontSize(10);
      doc.text(actualPageNum.toString(), width / 2, height - (config.margins / 2), { align: 'center' });
    }
    
    actualPageNum++;

    // Add blank backside if enabled
    if (config.blankBacksides) {
      doc.addPage([width, height]);
      if (config.pageNumbers) {
        doc.setFontSize(10);
        doc.text(actualPageNum.toString(), width / 2, height - (config.margins / 2), { align: 'center' });
      }
      actualPageNum++;
    }
  }

  return doc.output('blob');
}
