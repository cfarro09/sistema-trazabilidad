import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        empresa: true,
        items: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ success: false, error: 'Cotización no encontrada' }, { status: 404 });
    }

    // Crear el contrato / servicio en trazabilidad
    const servicio = await prisma.serviceContract.create({
      data: {
        codigoInterno: quote.codigoInterno,
        empresaId: quote.empresaId,
        entidad: quote.entidad,
        unidadEjecutora: body.unidadEjecutora || quote.atencion,
        objetoContratacion: quote.objetoServicio,
        descripcionDetallada: quote.objetoServicio,
        rubro: body.rubro || 'SERVICIOS EN GENERAL',
        montoSinIgv: quote.montoCostoDirecto,
        montoIgv: quote.montoIgv,
        montoTotal: quote.montoTotal,
        moneda: 'S/',
        nroCotizacion: quote.numero,
        fechaCotizacion: quote.fecha,
        nroOrdenServicio: body.nroOrdenServicio || null,
        nroSiaf: body.nroSiaf || null,
        fechaOrden: body.fechaOrden ? new Date(body.fechaOrden) : new Date(),
        plazoEjecucionDias: body.plazoEjecucionDias ? parseInt(body.plazoEjecucionDias) : 10,
        estado: body.nroOrdenServicio ? 'ACEPTADO_ORDEN' : 'COTIZACION',
        esHistorico: false,
      },
    });

    // Actualizar estado de la cotización
    await prisma.quote.update({
      where: { id },
      data: {
        estado: 'ACEPTADA',
        servicioId: servicio.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: { servicioId: servicio.id },
      message: 'Cotización convertida exitosamente a Orden de Servicio en Trazabilidad',
    });
  } catch (error: any) {
    console.error('Error converting quote to service:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al convertir cotización' },
      { status: 500 }
    );
  }
}
