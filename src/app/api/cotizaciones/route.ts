import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { numeroALetrasSoles } from '@/lib/number-to-letters';
import { getNextCotizacionNumero, generateUniqueCodigoInterno } from '@/lib/correlativo-cotizacion';

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

    // Resolver empresaId válida para evitar P2003 Foreign Key constraint violation
    let validEmpresaId = empresaId;
    let company = null;

    if (validEmpresaId) {
      company = await prisma.company.findUnique({
        where: { id: validEmpresaId },
      });
    }

    if (!company) {
      company = await prisma.company.findFirst();
      if (!company) {
        return NextResponse.json(
          { success: false, error: 'No hay empresas registradas en la base de datos' },
          { status: 400 }
        );
      }
      validEmpresaId = company.id;
    }

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
        item: String(it.item || `${index + 1}.00`),
        descripcion: String(it.descripcion || (it.esTitulo ? 'SECCIÓN' : 'PARTIDA SIN DESCRIPCIÓN')).trim(),
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

    // Generar correlativo con Año-Mes-N° si no fue provisto
    const quoteDate = fecha ? new Date(fecha) : new Date();
    const year = quoteDate.getFullYear();
    let finalNumero = numero ? numero.trim() : '';

    if (!finalNumero) {
      const autoCorrelativo = await getNextCotizacionNumero(quoteDate);
      finalNumero = autoCorrelativo.numero;
    }

    const codigoInterno = await generateUniqueCodigoInterno(finalNumero, year);

    const quote = await prisma.quote.create({
      data: {
        numero: finalNumero,
        codigoInterno,
        empresaId: validEmpresaId,
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
