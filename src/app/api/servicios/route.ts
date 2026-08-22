import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const empresaId = searchParams.get('empresaId');
    const estado = searchParams.get('estado');
    const search = searchParams.get('search'); // Full text / keyword search
    const esHistorico = searchParams.get('esHistorico');
    const soloConformes = searchParams.get('soloConformes'); // Para acreditación de experiencia

    const where: any = {};

    if (empresaId && empresaId !== 'ALL') {
      where.empresaId = empresaId;
    }

    if (estado && estado !== 'ALL') {
      where.estado = estado;
    }

    if (esHistorico !== null && esHistorico !== undefined && esHistorico !== '') {
      where.esHistorico = esHistorico === 'true';
    }

    if (soloConformes === 'true') {
      where.estado = { in: ['CONFORME', 'FACTURADO', 'PAGADO'] };
    }

    if (search) {
      where.OR = [
        { descripcionDetallada: { contains: search } },
        { objetoContratacion: { contains: search } },
        { entidad: { contains: search } },
        { rubro: { contains: search } },
        { nroOrdenServicio: { contains: search } },
        { nroSiaf: { contains: search } },
        { codigoInterno: { contains: search } },
        { nroCotizacion: { contains: search } },
        { nroFactura: { contains: search } },
      ];
    }

    const servicios = await prisma.serviceContract.findMany({
      where,
      include: {
        empresa: true,
        documentos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: servicios });
  } catch (error: any) {
    console.error('Error fetching servicios:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      empresaId,
      entidad,
      unidadEjecutora,
      objetoContratacion,
      descripcionDetallada,
      rubro,
      montoSinIgv,
      montoIgv,
      montoTotal,
      nroCotizacion,
      fechaCotizacion,
      nroOrdenServicio,
      nroSiaf,
      fechaOrden,
      plazoEjecucionDias,
      nroFactura,
      fechaFactura,
      montoFacturado,
      nroConformidad,
      fechaConformidad,
      fechaPago,
      nroOperacion,
      montoPagado,
      estado,
      esHistorico,
      tdrPdf,
      ordenServicioPdf,
      informePdf,
      conformidadPdf,
      facturaPdf,
      pagoPdf,
    } = body;

    // Generar código interno único
    const count = await prisma.serviceContract.count();
    const year = new Date().getFullYear();
    const codigoInterno = `COT-${year}-${String(count + 1).padStart(5, '0')}`;

    const parsedMontoTotal = parseFloat(montoTotal) || 0;
    const parsedMontoSinIgv = parseFloat(montoSinIgv) || parsedMontoTotal / 1.18;
    const parsedMontoIgv = parseFloat(montoIgv) || parsedMontoTotal - parsedMontoSinIgv;

    const servicio = await prisma.serviceContract.create({
      data: {
        codigoInterno,
        empresaId,
        entidad,
        unidadEjecutora,
        objetoContratacion: objetoContratacion || descripcionDetallada,
        descripcionDetallada,
        rubro: rubro || 'SERVICIOS EN GENERAL',
        montoSinIgv: Math.round(parsedMontoSinIgv * 100) / 100,
        montoIgv: Math.round(parsedMontoIgv * 100) / 100,
        montoTotal: Math.round(parsedMontoTotal * 100) / 100,
        moneda: 'S/',
        nroCotizacion: nroCotizacion || codigoInterno,
        fechaCotizacion: fechaCotizacion ? new Date(fechaCotizacion) : new Date(),
        nroOrdenServicio,
        nroSiaf,
        fechaOrden: fechaOrden ? new Date(fechaOrden) : null,
        plazoEjecucionDias: plazoEjecucionDias ? parseInt(plazoEjecucionDias) : null,
        nroFactura,
        fechaFactura: fechaFactura ? new Date(fechaFactura) : null,
        montoFacturado: montoFacturado ? parseFloat(montoFacturado) : null,
        nroConformidad,
        fechaConformidad: fechaConformidad ? new Date(fechaConformidad) : null,
        fechaPago: fechaPago ? new Date(fechaPago) : null,
        nroOperacion,
        montoPagado: montoPagado ? parseFloat(montoPagado) : null,
        estado: estado || (esHistorico ? 'PAGADO' : 'COTIZACION'),
        esHistorico: Boolean(esHistorico),
        tdrPdf,
        ordenServicioPdf,
        informePdf,
        conformidadPdf,
        facturaPdf,
        pagoPdf,
      },
      include: {
        empresa: true,
      },
    });

    return NextResponse.json({ success: true, data: servicio });
  } catch (error: any) {
    console.error('Error creating servicio:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al registrar servicio' },
      { status: 500 }
    );
  }
}
