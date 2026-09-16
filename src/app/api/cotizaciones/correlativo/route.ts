import { NextRequest, NextResponse } from 'next/server';
import { getNextCotizacionNumero } from '@/lib/correlativo-cotizacion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');

    const result = await getNextCotizacionNumero(fecha);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error al obtener siguiente correlativo de cotización:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener correlativo' },
      { status: 500 }
    );
  }
}
