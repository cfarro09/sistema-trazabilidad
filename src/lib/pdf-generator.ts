import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface MergePdfOptions {
  documentTitles: string[];
  companyName: string;
  addFoliation?: boolean;
  startFolio?: number;
}

/**
 * Genera un PDF de muestra para pruebas con encabezado institucional
 */
export async function createSamplePdf(
  title: string,
  subtitle: string,
  contentLines: string[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  // Encabezado decorativo
  page.drawRectangle({
    x: 40,
    y: height - 60,
    width: width - 80,
    height: 3,
    color: rgb(0.12, 0.23, 0.45),
  });

  page.drawText(title, {
    x: 40,
    y: height - 45,
    size: 16,
    font: fontBold,
    color: rgb(0.12, 0.23, 0.45),
  });

  page.drawText(subtitle, {
    x: 40,
    y: height - 80,
    size: 11,
    font: fontBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  let currentY = height - 110;
  for (const line of contentLines) {
    if (currentY < 60) break;
    page.drawText(line, {
      x: 40,
      y: currentY,
      size: 10,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });
    currentY -= 16;
  }

  // Pie de página
  page.drawText('Documento generado por el Sistema de Trazabilidad y Licitaciones', {
    x: 40,
    y: 30,
    size: 8,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}

/**
 * Combina múltiples documentos PDF en uno solo y aplica foliado correlativo
 */
export async function compileExpedientePdf(
  pdfBuffers: Uint8Array[],
  options: MergePdfOptions
): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  const fontBold = await pdfDocFont(mergedPdf);

  let currentFolio = options.startFolio ?? 1;

  for (const buffer of pdfBuffers) {
    try {
      const sourcePdf = await PDFDocument.load(buffer);
      const copiedPages = await mergedPdf.copyPages(
        sourcePdf,
        sourcePdf.getPageIndices()
      );

      for (const page of copiedPages) {
        mergedPdf.addPage(page);

        if (options.addFoliation !== false) {
          const { width, height } = page.getSize();
          const folioText = String(currentFolio).padStart(4, '0');

          // Estampado de Folio en la esquina superior derecha
          page.drawText(folioText, {
            x: width - 75,
            y: height - 30,
            size: 12,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1),
          });

          currentFolio++;
        }
      }
    } catch (e) {
      console.warn('Error al cargar página PDF para merge:', e);
    }
  }

  return await mergedPdf.save();
}

async function pdfDocFont(pdfDoc: PDFDocument) {
  return await pdfDoc.embedFont(StandardFonts.HelveticaBold);
}
