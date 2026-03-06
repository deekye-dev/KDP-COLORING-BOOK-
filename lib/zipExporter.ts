import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BookConfig, BookMetadata } from './promptBuilder';
import { GeneratedPage, generatePdf } from './pdfExporter';

export async function exportProject(config: BookConfig, pages: GeneratedPage[], metadata?: BookMetadata | null) {
  const zip = new JSZip();
  
  // 1. Generate PDF
  const pdfBlob = await generatePdf(config, pages);
  zip.file(`${config.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_interior.pdf`, pdfBlob);

  // 2. Add Images to a folder
  const imgFolder = zip.folder('images');
  if (imgFolder) {
    pages.forEach((page, index) => {
      if (page.imageUrl) {
        // Extract base64 data
        const base64Data = page.imageUrl.split(',')[1];
        const filename = `page_${(index + 1).toString().padStart(3, '0')}_${page.subject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        imgFolder.file(filename, base64Data, { base64: true });
      }
    });
  }

  // 3. Add metadata/config
  zip.file('book_config.json', JSON.stringify(config, null, 2));

  // 4. Add KDP Listing Info if available
  if (metadata) {
    const kdpInfo = `TITLE: ${config.title}
THEME: ${config.theme}
AUDIENCE: ${config.audience}

----------------------------------------
AMAZON DESCRIPTION
----------------------------------------
${metadata.description}

----------------------------------------
7 KDP KEYWORDS
----------------------------------------
${metadata.keywords.map((k, i) => `${i + 1}. ${k}`).join('\n')}

----------------------------------------
CATEGORIES
----------------------------------------
${metadata.categories.map(c => `- ${c}`).join('\n')}

----------------------------------------
MARKETING SUMMARY (For Social Media)
----------------------------------------
${metadata.marketingSummary}
`;
    zip.file('KDP_LISTING_INFO.txt', kdpInfo);
  }

  // Generate and save zip
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${config.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_kdp_assets.zip`);
}
