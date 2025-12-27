import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPdf(element: HTMLElement, filename: string): Promise<void> {
  // Find all A4 pages within the element
  const pages = element.querySelectorAll('.a4-page');

  // If no pages found, treat the entire element as a single page
  const elements = pages.length > 0 ? Array.from(pages) : [element];

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < elements.length; i++) {
    const pageElement = elements[i] as HTMLElement;

    // Create a clone to avoid modifying the original
    const clone = pageElement.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.width = '794px';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add new page for subsequent pages
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF, centered
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
    } finally {
      // Clean up clone
      document.body.removeChild(clone);
    }
  }

  pdf.save(filename);
}

export async function exportToImage(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
  });

  return canvas.toDataURL('image/png');
}
