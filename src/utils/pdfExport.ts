import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPdf(element: HTMLElement, filename: string): Promise<void> {
  // Find A4 page within the element
  const pageElement = element.querySelector('.a4-page') as HTMLElement || element;

  // A4 dimensions in points (595.28 x 841.89)
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Capture directly from the visible element
  const canvas = await html2canvas(pageElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc, clonedElement) => {
      // Ensure the cloned element has proper styles
      clonedElement.style.transform = 'none';
      clonedElement.style.width = '794px';
      clonedElement.style.minHeight = '1123px';
    }
  });

  const imgData = canvas.toDataURL('image/png', 1.0);

  // Calculate dimensions to fit A4
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  // Add image to PDF
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight), undefined, 'FAST');

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
