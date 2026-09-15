import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCotizacionPdf } from '@/lib/pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        empresa: true,
        items: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateCotizacionPdf(quote);
    const cleanNumero = quote.numero.replace(/[^a-zA-Z0-9-_]/g, '_');

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Cotizacion_${cleanNumero}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error al generar PDF de cotización:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al generar PDF' },
      { status: 500 }
    );
  }
}
