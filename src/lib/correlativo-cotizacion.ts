import { prisma } from '@/lib/prisma';

export interface NextCorrelativoResult {
  numero: string;
  year: number;
  month: string;
  sequence: number;
}

/**
 * Calcula el siguiente número correlativo de cotización con formato Año-Mes-Número:
 * Ej: COT-2026-09-001 (Año: 2026, Mes: 09, Número: 001 en adelante)
 */
export async function getNextCotizacionNumero(targetDate?: Date | string | null): Promise<NextCorrelativoResult> {
  let date = new Date();
  if (targetDate) {
    const parsed = new Date(targetDate);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  // Buscar todas las cotizaciones del mismo año y mes
  const startOfMonth = new Date(year, date.getMonth(), 1);
  const endOfMonth = new Date(year, date.getMonth() + 1, 1);

  const quotes = await prisma.quote.findMany({
    where: {
      OR: [
        { numero: { contains: `${year}-${month}` } },
        { codigoInterno: { contains: `${year}-${month}` } },
        {
          fecha: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      ],
    },
    select: {
      numero: true,
      codigoInterno: true,
    },
  });

  // Encontrar el correlativo más alto dentro de ese año y mes
  let maxSeq = 0;
  const regex = new RegExp(`(?:COT-)?${year}-${month}-(\\d+)`, 'i');

  for (const q of quotes) {
    if (q.numero) {
      const match = q.numero.match(regex);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val > maxSeq) {
          maxSeq = val;
        }
      }
    }
    if (q.codigoInterno) {
      const match = q.codigoInterno.match(regex);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val > maxSeq) {
          maxSeq = val;
        }
      }
    }
  }

  const nextSeq = maxSeq > 0 ? maxSeq + 1 : quotes.length + 1;
  const formattedSeq = String(nextSeq).padStart(3, '0');
  const numero = `COT-${year}-${month}-${formattedSeq}`;

  return {
    numero,
    year,
    month,
    sequence: nextSeq,
  };
}

/**
 * Genera un codigoInterno único para la base de datos que jamás colisione con el @unique constraint
 */
export async function generateUniqueCodigoInterno(
  baseNumero: string,
  year: number,
  currentQuoteId?: string
): Promise<string> {
  const clean = (baseNumero || `COT-${year}-00001`)
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .toUpperCase();

  let candidate = clean.startsWith('COT-') ? clean : `COT-${clean}`;
  if (candidate.length > 40) {
    candidate = candidate.substring(0, 40);
  }

  const existing = await prisma.quote.findUnique({
    where: { codigoInterno: candidate },
  });

  if (!existing || existing.id === currentQuoteId) {
    return candidate;
  }

  // Si ya existe, buscar con sufijo correlativo único
  let suffix = 1;
  while (true) {
    const candidateWithSuffix = `${candidate}-${suffix}`;
    const exists = await prisma.quote.findUnique({
      where: { codigoInterno: candidateWithSuffix },
    });
    if (!exists || exists.id === currentQuoteId) {
      return candidateWithSuffix;
    }
    suffix++;
  }
}
