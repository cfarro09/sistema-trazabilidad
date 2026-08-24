import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { numeroALetrasSoles } from '@/lib/number-to-letters';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const empresaId = searchParams.get('empresaId');
    const estado = searchParams.get('estado');
    const search = searchParams.get('search');

    const where: any = {};

    if (empresaId && empresaId !== 'ALL') {
      where.empresaId = empresaId;
    }

    if (estado && estado !== 'ALL') {
      where.estado = estado;
    }

    if (search) {
      where.OR = [
        { numero: { contains: search } },
        { codigoInterno: { contains: search } },
        { entidad: { contains: search } },
        { objetoServicio: { contains: search } },
      ];
    }

    const cotizaciones = await prisma.quote.findMany({
      where,
      include: {
        empresa: true,
        items: {
          orderBy: { orden: 'asc' },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    return NextResponse.json({ success: true, data: cotizaciones });
  } catch (error: any) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener cotizaciones' },
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
      atencion,
      fecha,
      objetoServicio,
      ubicacion,
      validezOferta,
      tiempoEjecucion,
      garantia,
      formaPago,
      lugarEjecucion,
      numero,
      items,
      esAntigua,
      archivoPdf,
    } = body;

    // Calcular montos de ítems
    let costoDirecto = 0;
    const formattedItems = (items || []).map((it: any, index: number) => {
      const cantidad = parseFloat(it.cantidad) || 1;
      const precioUnitario = parseFloat(it.precioUnitario) || 0;
      const precioParcial = it.esTitulo ? 0 : Math.round(cantidad * precioUnitario * 100) / 100;
      if (!it.esTitulo) {
        costoDirecto += precioParcial;
      }

      return {
        item: it.item || String(index + 1),
        descripcion: it.descripcion,
        unidad: it.unidad || 'Global',
        cantidad,
        precioUnitario,
        precioParcial,
        esTitulo: Boolean(it.esTitulo),
        orden: index + 1,
      };
    });

    // Si es antigua o montos ingresados manualmente
    let totalDirecto = costoDirecto;
    if (body.montoCostoDirecto !== undefined && parseFloat(body.montoCostoDirecto) > 0) {
      totalDirecto = parseFloat(body.montoCostoDirecto);
    } else if (body.montoTotal !== undefined && parseFloat(body.montoTotal) > 0 && totalDirecto === 0) {
      totalDirecto = Math.round((parseFloat(body.montoTotal) / 1.18) * 100) / 100;
    }

    const montoIgv = Math.round(totalDirecto * 0.18 * 100) / 100;
    const montoTotal = Math.round((totalDirecto + montoIgv) * 100) / 100;
    const montoLetras = numeroALetrasSoles(montoTotal);

    // Generar correlativo
    const count = await prisma.quote.count();
    const year = new Date().getFullYear();
    const shortYear = String(year).slice(-2);
    const formattedNumero = numero || `Nº ${String(count + 1).padStart(5, '0')} - ${shortYear}`;
    const codigoInterno = `COT-${year}-${String(count + 1).padStart(5, '0')}`;

    const quote = await prisma.quote.create({
      data: {
        numero: formattedNumero,
        codigoInterno,
        empresaId,
        entidad,
        atencion: atencion || 'Unidad de Logística',
        fecha: fecha ? new Date(fecha) : new Date(),
        objetoServicio,
        ubicacion,
        validezOferta: validezOferta || '30 días',
        tiempoEjecucion: tiempoEjecucion || '10 días calendarios',
        garantia: garantia || '12 meses',
        formaPago: formaPago || 'Contado Comercial',
        lugarEjecucion: lugarEjecucion || ubicacion,
        montoCostoDirecto: totalDirecto,
        montoIgv,
        montoTotal,
        montoLetras,
        estado: 'ENVIADA',
        esAntigua: Boolean(esAntigua),
        archivoPdf,
        items: formattedItems.length > 0 ? { create: formattedItems } : undefined,
      },
      include: {
        empresa: true,
        items: true,
      },
    });

    return NextResponse.json({ success: true, data: quote });
  } catch (error: any) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al registrar cotización' },
      { status: 500 }
    );
  }
}
