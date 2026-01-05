import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image-more';

export async function exportToPdf(element: HTMLElement, filename: string): Promise<void> {
  // Find A4 page within the element or use element itself
  const pageElement = element.querySelector('.a4-page') as HTMLElement || element;

  // Get the dimensions
  const width = pageElement.offsetWidth;
  const height = pageElement.offsetHeight;

  // Convert element to PNG image using dom-to-image-more
  const dataUrl = await domtoimage.toPng(pageElement, {
    quality: 1,
    width: width,
    height: height,
    style: {
      transform: 'none',
    },
    bgcolor: '#ffffff',
  });

  // Create PDF with A4 dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [width, height],
  });

  // Add image to PDF
  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);

  // Save the PDF
  pdf.save(filename);
}

export async function exportToImage(element: HTMLElement): Promise<string> {
  const pageElement = element.querySelector('.a4-page') as HTMLElement || element;

  return await domtoimage.toPng(pageElement, {
    quality: 1,
    bgcolor: '#ffffff',
  });
}
