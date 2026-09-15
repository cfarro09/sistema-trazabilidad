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

export interface CotizacionPdfData {
  numero: string;
  fecha: Date | string;
  entidad: string;
  atencion?: string | null;
  objetoServicio: string;
  ubicacion?: string | null;
  validezOferta?: string | null;
  tiempoEjecucion?: string | null;
  garantia?: string | null;
  formaPago?: string | null;
  lugarEjecucion?: string | null;
  montoCostoDirecto: number;
  montoIgv: number;
  montoTotal: number;
  montoLetras?: string | null;
  empresa: {
    razonSocial: string;
    nombreComercial?: string | null;
    ruc: string;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
    representanteLegal?: string | null;
    dniRepresentante?: string | null;
  };
  items: Array<{
    item: string;
    descripcion: string;
    unidad: string;
    cantidad: number;
    precioUnitario: number;
    precioParcial: number;
    esTitulo: boolean;
  }>;
}

function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-')
    .replace(/[\u2026]/g, '...')
    .replace(/[^\x00-\xFF]/g, '')
    .trim();
}

function wrapText(text: string, maxChars: number): string[] {
  const cleaned = cleanText(text);
  if (!cleaned) return [''];
  const words = cleaned.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    if ((current + (current ? ' ' : '') + w).length <= maxChars) {
      current = current + (current ? ' ' : '') + w;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

function formatMoney(amount: number): string {
  return Number(amount || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(d: Date | string): string {
  try {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return String(d || '');
  }
}

/**
 * Genera un PDF formal de Cotización en hoja A4 de alta definición
 */
export async function generateCotizacionPdf(quote: CotizacionPdfData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN_LEFT = 38;
  const TABLE_WIDTH = 519;

  // Anchos de columnas
  const wItem = 38;
  const wDesc = 247;
  const wUnd = 36;
  const wCant = 42;
  const wPunit = 74;
  const wParcial = 82;

  const xItem = MARGIN_LEFT;
  const xDesc = xItem + wItem;
  const xUnd = xDesc + wDesc;
  const xCant = xUnd + wUnd;
  const xPunit = xCant + wCant;
  const xParcial = xPunit + wPunit;
  const xEnd = MARGIN_LEFT + TABLE_WIDTH;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let currentY = PAGE_HEIGHT - 35;

  // --- DIBUJA CABECERA PRINCIPAL (PÁGINA 1) ---
  const drawPage1Header = () => {
    // Folio en rojo / gris top-right
    page.drawText('0001', {
      x: PAGE_WIDTH - 65,
      y: PAGE_HEIGHT - 25,
      size: 9,
      font: fontBold,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Nombre de la Empresa
    const companyTitle = cleanText(quote.empresa.nombreComercial || quote.empresa.razonSocial).toUpperCase();
    page.drawText(companyTitle, {
      x: MARGIN_LEFT,
      y: currentY,
      size: 13,
      font: fontBold,
      color: rgb(0.08, 0.12, 0.2),
    });

    currentY -= 14;
    const direccion = cleanText(quote.empresa.direccion || 'Lima, Perú');
    page.drawText(direccion, {
      x: MARGIN_LEFT,
      y: currentY,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.35, 0.35, 0.35),
    });

    currentY -= 11;
    const email = cleanText(quote.empresa.email || '');
    page.drawText(email, {
      x: MARGIN_LEFT,
      y: currentY,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.35, 0.35, 0.35),
    });

    currentY -= 11;
    const telefono = `Telf.: ${cleanText(quote.empresa.telefono || '332-3455 / 983446851')}`;
    page.drawText(telefono, {
      x: MARGIN_LEFT,
      y: currentY,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.35, 0.35, 0.35),
    });

    // Caja Roja Cotización a la derecha
    const boxWidth = 145;
    const boxHeight = 44;
    const boxX = PAGE_WIDTH - MARGIN_LEFT - boxWidth;
    const boxY = PAGE_HEIGHT - 35 - boxHeight;

    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      color: rgb(0.76, 0.12, 0.16),
    });

    page.drawText('COTIZACIÓN', {
      x: boxX + (boxWidth - fontBold.widthOfTextAtSize('COTIZACIÓN', 8.5)) / 2,
      y: boxY + 27,
      size: 8.5,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    const numeroText = cleanText(quote.numero);
    page.drawText(numeroText, {
      x: boxX + (boxWidth - fontBold.widthOfTextAtSize(numeroText, 13)) / 2,
      y: boxY + 10,
      size: 13,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // Línea separadora gruesa inferior de cabecera
    currentY = boxY - 12;
    page.drawLine({
      start: { x: MARGIN_LEFT, y: currentY },
      end: { x: xEnd, y: currentY },
      thickness: 1.5,
      color: rgb(0.1, 0.1, 0.1),
    });

    // --- BLOQUE CLIENTE / DATOS DEL SERVICIO ---
    currentY -= 8;
    const infoBoxHeight = 62;
    const infoBoxY = currentY - infoBoxHeight;

    page.drawRectangle({
      x: MARGIN_LEFT,
      y: infoBoxY,
      width: TABLE_WIDTH,
      height: infoBoxHeight,
      color: rgb(0.97, 0.98, 0.99),
      borderColor: rgb(0.85, 0.88, 0.91),
      borderWidth: 0.75,
    });

    // Fila 1: Señores + Fecha
    let textY = infoBoxY + infoBoxHeight - 14;
    page.drawText('Señores:', { x: MARGIN_LEFT + 8, y: textY, size: 8, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    const entidadText = cleanText(quote.entidad).toUpperCase();
    page.drawText(entidadText.substring(0, 58), { x: MARGIN_LEFT + 52, y: textY, size: 8, font: fontBold, color: rgb(0.15, 0.15, 0.15) });

    page.drawText('FECHA:', { x: xEnd - 120, y: textY, size: 8, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(formatDate(quote.fecha), { x: xEnd - 76, y: textY, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });

    // Fila 2: Atención
    textY -= 13;
    page.drawText('Atención:', { x: MARGIN_LEFT + 8, y: textY, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    const atencionText = cleanText(quote.atencion || 'Unidad de Logística');
    page.drawText(atencionText, { x: MARGIN_LEFT + 52, y: textY, size: 7.5, font: fontRegular, color: rgb(0.25, 0.25, 0.25) });

    // Fila 3: Objeto del Servicio
    textY -= 13;
    page.drawText('OBRA/SERV:', { x: MARGIN_LEFT + 8, y: textY, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    const objetoText = cleanText(quote.objetoServicio).toUpperCase();
    page.drawText(objetoText.substring(0, 85), { x: MARGIN_LEFT + 62, y: textY, size: 7.5, font: fontBold, color: rgb(0.2, 0.2, 0.2) });

    // Fila 4: Ubicación
    if (quote.ubicacion) {
      textY -= 12;
      page.drawText('UBICAC:', { x: MARGIN_LEFT + 8, y: textY, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(cleanText(quote.ubicacion).substring(0, 85), { x: MARGIN_LEFT + 52, y: textY, size: 7.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
    }

    currentY = infoBoxY - 12;
  };

  // --- CABECERA DE TABLA DE PARTIDAS ---
  const drawTableHeader = () => {
    const thHeight = 17;
    const thY = currentY - thHeight;

    page.drawRectangle({
      x: MARGIN_LEFT,
      y: thY,
      width: TABLE_WIDTH,
      height: thHeight,
      color: rgb(0.92, 0.94, 0.96),
      borderColor: rgb(0.15, 0.15, 0.15),
      borderWidth: 1,
    });

    // Líneas verticales de cabecera
    const vLines = [xDesc, xUnd, xCant, xPunit, xParcial];
    for (const vx of vLines) {
      page.drawLine({
        start: { x: vx, y: thY },
        end: { x: vx, y: thY + thHeight },
        thickness: 0.75,
        color: rgb(0.2, 0.2, 0.2),
      });
    }

    const ty = thY + 5;
    page.drawText('ITEM', { x: xItem + 8, y: ty, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('DESCRIPCION', { x: xDesc + 8, y: ty, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('UND', { x: xUnd + 7, y: ty, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('CANT.', { x: xCant + 6, y: ty, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('P.UNIT (S/)', { x: xPunit + 10, y: ty, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('P.PARCIAL (S/)', { x: xParcial + 8, y: ty, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

    currentY = thY;
  };

  // Cabecera inicial de página 1
  drawPage1Header();
  drawTableHeader();

  // --- FILAS DE PARTIDAS / ÍTEMS ---
  const pages: typeof page[] = [page];

  for (const it of quote.items) {
    if (it.esTitulo) {
      // Fila de Título de Especialidad / Sección
      const rowHeight = 16;

      if (currentY - rowHeight < 140) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        pages.push(page);
        currentY = PAGE_HEIGHT - 40;
        // Cabecera compacta en página continuación
        page.drawText(`COTIZACIÓN N° ${quote.numero} — ${quote.empresa.razonSocial}`, {
          x: MARGIN_LEFT,
          y: currentY,
          size: 8,
          font: fontBold,
          color: rgb(0.3, 0.3, 0.3),
        });
        currentY -= 12;
        drawTableHeader();
      }

      const rowY = currentY - rowHeight;
      page.drawRectangle({
        x: MARGIN_LEFT,
        y: rowY,
        width: TABLE_WIDTH,
        height: rowHeight,
        color: rgb(0.88, 0.9, 0.93),
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 0.5,
      });

      // Línea divisoria del item
      page.drawLine({
        start: { x: xDesc, y: rowY },
        end: { x: xDesc, y: rowY + rowHeight },
        thickness: 0.5,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(cleanText(it.item), {
        x: xItem + 6,
        y: rowY + 4.5,
        size: 7.5,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page.drawText(cleanText(it.descripcion).toUpperCase(), {
        x: xDesc + 8,
        y: rowY + 4.5,
        size: 7.5,
        font: fontBold,
        color: rgb(0.08, 0.12, 0.2),
      });

      currentY = rowY;
    } else {
      // Fila normal de Partida
      const descLines = wrapText(it.descripcion, 48);
      const rowHeight = Math.max(16, descLines.length * 9.5 + 6);

      if (currentY - rowHeight < 140) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        pages.push(page);
        currentY = PAGE_HEIGHT - 40;
        page.drawText(`COTIZACIÓN N° ${quote.numero} — ${quote.empresa.razonSocial}`, {
          x: MARGIN_LEFT,
          y: currentY,
          size: 8,
          font: fontBold,
          color: rgb(0.3, 0.3, 0.3),
        });
        currentY -= 12;
        drawTableHeader();
      }

      const rowY = currentY - rowHeight;

      // Fondo de la celda
      page.drawRectangle({
        x: MARGIN_LEFT,
        y: rowY,
        width: TABLE_WIDTH,
        height: rowHeight,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.25, 0.25, 0.25),
        borderWidth: 0.5,
      });

      // Líneas verticales de columnas
      const vLines = [xDesc, xUnd, xCant, xPunit, xParcial];
      for (const vx of vLines) {
        page.drawLine({
          start: { x: vx, y: rowY },
          end: { x: vx, y: rowY + rowHeight },
          thickness: 0.5,
          color: rgb(0.25, 0.25, 0.25),
        });
      }

      // ITEM
      page.drawText(cleanText(it.item), {
        x: xItem + 6,
        y: rowY + rowHeight - 11,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });

      // DESCRIPCION (multilínea)
      let lineY = rowY + rowHeight - 10.5;
      for (const line of descLines) {
        page.drawText(line, {
          x: xDesc + 6,
          y: lineY,
          size: 7,
          font: fontRegular,
          color: rgb(0.1, 0.1, 0.1),
        });
        lineY -= 9.5;
      }

      // UNIDAD
      page.drawText(cleanText(it.unidad), {
        x: xUnd + 5,
        y: rowY + rowHeight - 11,
        size: 7,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3),
      });

      // CANTIDAD
      const cantStr = String(it.cantidad);
      page.drawText(cantStr, {
        x: xCant + 6,
        y: rowY + rowHeight - 11,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });

      // PRECIO UNITARIO (S/)
      const puStr = `S/ ${formatMoney(it.precioUnitario)}`;
      const puWidth = fontRegular.widthOfTextAtSize(puStr, 7.5);
      page.drawText(puStr, {
        x: xParcial - puWidth - 6,
        y: rowY + rowHeight - 11,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });

      // PRECIO PARCIAL (S/)
      const parcialStr = `S/ ${formatMoney(it.precioParcial)}`;
      const parcialWidth = fontBold.widthOfTextAtSize(parcialStr, 7.5);
      page.drawText(parcialStr, {
        x: xEnd - parcialWidth - 6,
        y: rowY + rowHeight - 11,
        size: 7.5,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      currentY = rowY;
    }
  }

  // --- FILAS DE TOTALES ---
  // Si no entra el bloque de totales + condiciones, crear nueva página
  if (currentY - 140 < 40) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    currentY = PAGE_HEIGHT - 40;
  }

  const totalsY = currentY;

  // 1. Costo Directo
  const drawTotalRow = (label: string, value: number, isFinal: boolean = false) => {
    const h = isFinal ? 17 : 15;
    const y = currentY - h;

    page.drawRectangle({
      x: MARGIN_LEFT,
      y,
      width: TABLE_WIDTH,
      height: h,
      color: isFinal ? rgb(0.92, 0.94, 0.97) : rgb(1, 1, 1),
      borderColor: rgb(0.15, 0.15, 0.15),
      borderWidth: isFinal ? 1 : 0.5,
    });

    page.drawLine({
      start: { x: xParcial, y },
      end: { x: xParcial, y: y + h },
      thickness: 0.5,
      color: rgb(0.2, 0.2, 0.2),
    });

    const fontToUse = isFinal ? fontBold : fontRegular;
    const labelX = xParcial - fontToUse.widthOfTextAtSize(label, 7.5) - 10;
    page.drawText(label, {
      x: labelX,
      y: y + 4.5,
      size: 7.5,
      font: fontToUse,
      color: rgb(0.1, 0.1, 0.1),
    });

    const valStr = `S/ ${formatMoney(value)}`;
    const valWidth = fontBold.widthOfTextAtSize(valStr, isFinal ? 8.5 : 7.5);
    page.drawText(valStr, {
      x: xEnd - valWidth - 6,
      y: y + 4.5,
      size: isFinal ? 8.5 : 7.5,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentY = y;
  };

  drawTotalRow('COSTO DIRECTO', quote.montoCostoDirecto);
  drawTotalRow('I.G.V. (18%)', quote.montoIgv);
  drawTotalRow('TOTAL GENERAL', quote.montoTotal, true);

  // --- MONTO EN LETRAS ---
  currentY -= 6;
  const letrasHeight = 16;
  const letrasY = currentY - letrasHeight;

  page.drawRectangle({
    x: MARGIN_LEFT,
    y: letrasY,
    width: TABLE_WIDTH,
    height: letrasHeight,
    color: rgb(0.95, 0.96, 0.97),
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 0.75,
  });

  const textoLetras = cleanText(quote.montoLetras || 'SON: DIECISIETE MIL CON 00/100 SOLES').toUpperCase();
  page.drawText(textoLetras, {
    x: MARGIN_LEFT + (TABLE_WIDTH - fontBold.widthOfTextAtSize(textoLetras, 7.5)) / 2,
    y: letrasY + 4.5,
    size: 7.5,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  currentY = letrasY - 10;

  // --- CONDICIONES COMERCIALES (IZQUIERDA) & FIRMA (DERECHA) ---
  const boxCondW = 280;
  const boxCondH = 75;
  const condY = currentY - boxCondH;

  // Cuadro de condiciones comerciales
  page.drawRectangle({
    x: MARGIN_LEFT,
    y: condY,
    width: boxCondW,
    height: boxCondH,
    color: rgb(0.99, 0.96, 0.96),
    borderColor: rgb(0.9, 0.7, 0.72),
    borderWidth: 0.75,
  });

  let cy = condY + boxCondH - 12;
  page.drawText(`R.U.C.: ${cleanText(quote.empresa.ruc)}`, {
    x: MARGIN_LEFT + 8,
    y: cy,
    size: 7.5,
    font: fontBold,
    color: rgb(0.7, 0.1, 0.15),
  });

  cy -= 11;
  page.drawText(`Validez de la oferta: ${cleanText(quote.validezOferta || '30 días')}`, {
    x: MARGIN_LEFT + 8,
    y: cy,
    size: 7,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  cy -= 10;
  page.drawText(`Tiempo de Ejecución: ${cleanText(quote.tiempoEjecucion || '10 días calendarios')}`, {
    x: MARGIN_LEFT + 8,
    y: cy,
    size: 7,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  cy -= 10;
  page.drawText(`Garantía: ${cleanText(quote.garantia || '12 meses')}`, {
    x: MARGIN_LEFT + 8,
    y: cy,
    size: 7,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  cy -= 10;
  page.drawText(`Forma de Pago: ${cleanText(quote.formaPago || 'Contado Comercial')}`, {
    x: MARGIN_LEFT + 8,
    y: cy,
    size: 7,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  cy -= 10;
  const lugarText = cleanText(quote.lugarEjecucion || 'Conforme a TDR');
  page.drawText(`Lugar de Ejecución: ${lugarText.substring(0, 48)}`, {
    x: MARGIN_LEFT + 8,
    y: cy,
    size: 7,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Cuadro de Firma (Derecha)
  const signW = TABLE_WIDTH - boxCondW - 15;
  const signX = MARGIN_LEFT + boxCondW + 15;
  const signLineY = condY + 28;

  page.drawLine({
    start: { x: signX + 15, y: signLineY },
    end: { x: signX + signW - 15, y: signLineY },
    thickness: 1,
    color: rgb(0.2, 0.2, 0.2),
  });

  const repName = cleanText(quote.empresa.representanteLegal || 'REPRESENTANTE LEGAL').toUpperCase();
  const repNameWidth = fontBold.widthOfTextAtSize(repName, 7.5);
  page.drawText(repName, {
    x: signX + (signW - repNameWidth) / 2,
    y: signLineY - 11,
    size: 7.5,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText('Gerente General', {
    x: signX + (signW - fontRegular.widthOfTextAtSize('Gerente General', 7)) / 2,
    y: signLineY - 21,
    size: 7,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Numeración de páginas en pie de página para todas las páginas
  const totalPages = pages.length;
  for (let i = 0; i < totalPages; i++) {
    const p = pages[i];
    const footerText = `Página ${i + 1} de ${totalPages}`;
    p.drawText(footerText, {
      x: PAGE_WIDTH - MARGIN_LEFT - fontRegular.widthOfTextAtSize(footerText, 7.5),
      y: 18,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.45, 0.45, 0.45),
    });

    p.drawText('Documento oficial generado por el Sistema de Cotizaciones y Licitaciones', {
      x: MARGIN_LEFT,
      y: 18,
      size: 6.5,
      font: fontRegular,
      color: rgb(0.55, 0.55, 0.55),
    });
  }

  return await pdfDoc.save();
}
