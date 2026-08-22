import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const servicio = await prisma.serviceContract.findUnique({
      where: { id },
      include: {
        empresa: true,
        documentos: true,
      },
    });

    if (!servicio) {
      return NextResponse.json(
        { success: false, error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: servicio });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener servicio' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: any = {};

    // Campos generales
    if (body.entidad !== undefined) data.entidad = body.entidad;
    if (body.unidadEjecutora !== undefined) data.unidadEjecutora = body.unidadEjecutora;
    if (body.objetoContratacion !== undefined) data.objetoContratacion = body.objetoContratacion;
    if (body.descripcionDetallada !== undefined) data.descripcionDetallada = body.descripcionDetallada;
    if (body.rubro !== undefined) data.rubro = body.rubro;
    if (body.estado !== undefined) data.estado = body.estado;
    if (body.empresaId !== undefined) data.empresaId = body.empresaId;

    // Montos
    if (body.montoTotal !== undefined) {
      data.montoTotal = parseFloat(body.montoTotal) || 0;
      data.montoSinIgv = body.montoSinIgv ? parseFloat(body.montoSinIgv) : data.montoTotal / 1.18;
      data.montoIgv = body.montoIgv ? parseFloat(body.montoIgv) : data.montoTotal - data.montoSinIgv;
    }

    // Hito 1 & 2: Convocatoria & Cotización
    if (body.nroCotizacion !== undefined) data.nroCotizacion = body.nroCotizacion;
    if (body.fechaCotizacion !== undefined) data.fechaCotizacion = body.fechaCotizacion ? new Date(body.fechaCotizacion) : null;
    if (body.tdrPdf !== undefined) data.tdrPdf = body.tdrPdf;
    if (body.cotizacionPdf !== undefined) data.cotizacionPdf = body.cotizacionPdf;

    // Hito 3: Expediente
    if (body.expedientePostulacionPdf !== undefined) data.expedientePostulacionPdf = body.expedientePostulacionPdf;

    // Hito 4: Orden de Servicio
    if (body.nroOrdenServicio !== undefined) data.nroOrdenServicio = body.nroOrdenServicio;
    if (body.nroSiaf !== undefined) data.nroSiaf = body.nroSiaf;
    if (body.fechaOrden !== undefined) data.fechaOrden = body.fechaOrden ? new Date(body.fechaOrden) : null;
    if (body.plazoEjecucionDias !== undefined) data.plazoEjecucionDias = body.plazoEjecucionDias ? parseInt(body.plazoEjecucionDias) : null;
    if (body.ordenServicioPdf !== undefined) data.ordenServicioPdf = body.ordenServicioPdf;

    // Hito 5: Informe
    if (body.fechaInforme !== undefined) data.fechaInforme = body.fechaInforme ? new Date(body.fechaInforme) : null;
    if (body.informePdf !== undefined) data.informePdf = body.informePdf;

    // Hito 6: Conformidad
    if (body.nroConformidad !== undefined) data.nroConformidad = body.nroConformidad;
    if (body.fechaConformidad !== undefined) data.fechaConformidad = body.fechaConformidad ? new Date(body.fechaConformidad) : null;
    if (body.conformidadPdf !== undefined) data.conformidadPdf = body.conformidadPdf;

    // Hito 7: Factura
    if (body.nroFactura !== undefined) data.nroFactura = body.nroFactura;
    if (body.fechaFactura !== undefined) data.fechaFactura = body.fechaFactura ? new Date(body.fechaFactura) : null;
    if (body.montoFacturado !== undefined) data.montoFacturado = body.montoFacturado ? parseFloat(body.montoFacturado) : null;
    if (body.facturaPdf !== undefined) data.facturaPdf = body.facturaPdf;

    // Hito 8: Pago
    if (body.fechaPago !== undefined) data.fechaPago = body.fechaPago ? new Date(body.fechaPago) : null;
    if (body.nroOperacion !== undefined) data.nroOperacion = body.nroOperacion;
    if (body.montoPagado !== undefined) data.montoPagado = body.montoPagado ? parseFloat(body.montoPagado) : null;
    if (body.pagoPdf !== undefined) data.pagoPdf = body.pagoPdf;
    if (body.detraccionPdf !== undefined) data.detraccionPdf = body.detraccionPdf;

    const updated = await prisma.serviceContract.update({
      where: { id },
      data,
      include: {
        empresa: true,
        documentos: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating servicio:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar servicio' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.serviceContract.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Servicio eliminado correctamente' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al eliminar servicio' },
      { status: 500 }
    );
  }
}
