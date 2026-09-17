import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { numeroALetrasSoles } from '@/lib/number-to-letters';
import { getNextCotizacionNumero, generateUniqueCodigoInterno } from '@/lib/correlativo-cotizacion';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    // 1. Buscar la cotización origen con todos sus items
    const sourceQuote = await prisma.quote.findUnique({
      where: { id },
      include: {
        empresa: true,
        items: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    if (!sourceQuote) {
      return NextResponse.json(
        { success: false, error: 'Cotización origen no encontrada' },
        { status: 404 }
      );
    }

    // 2. Normalizar las empresas destino y sus configuraciones
    // Soporta:
    // a) targetEmpresas: [{ empresaId: string, variacionPorcentaje?: number, numero?: string }]
    // b) empresaId: string (simple)
    let targets: Array<{ empresaId: string; variacionPorcentaje?: number; numero?: string }> = [];

    if (Array.isArray(body.targetEmpresas) && body.targetEmpresas.length > 0) {
      targets = body.targetEmpresas.filter((t: any) => t && t.empresaId);
    } else if (body.empresaId) {
      targets = [
        {
          empresaId: body.empresaId,
          variacionPorcentaje: body.variacionPorcentaje,
          numero: body.numero,
        },
      ];
    }

    if (targets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debes seleccionar al menos una empresa destino para duplicar' },
        { status: 400 }
      );
    }

    const targetDate = body.fecha ? new Date(body.fecha) : new Date();
    const year = targetDate.getFullYear();

    const createdQuotes = [];

    for (const target of targets) {
      // Verificar empresa existente
      const company = await prisma.company.findUnique({
        where: { id: target.empresaId },
      });

      if (!company) {
        continue;
      }

      // Generar correlativo automático si no fue especificado manualmente
      let finalNumero = target.numero ? target.numero.trim() : '';
      if (!finalNumero) {
        const autoCorrelativo = await getNextCotizacionNumero(targetDate);
        finalNumero = autoCorrelativo.numero;
      }

      const codigoInterno = await generateUniqueCodigoInterno(finalNumero, year);

      // Calcular variación porcentual de precios si aplica
      const pct = parseFloat(String(target.variacionPorcentaje || 0)) || 0;
      const factor = 1 + pct / 100;

      let costoDirecto = 0;
      let newItems: any[] = [];

      if (sourceQuote.items && sourceQuote.items.length > 0) {
        newItems = sourceQuote.items.map((it, idx) => {
          const cantidad = it.cantidad ?? 1;
          let precioUnitario = it.precioUnitario ?? 0;
          let precioParcial = 0;

          if (!it.esTitulo) {
            if (pct !== 0) {
              precioUnitario = Math.round(precioUnitario * factor * 100) / 100;
            }
            precioParcial = Math.round(cantidad * precioUnitario * 100) / 100;
            costoDirecto += precioParcial;
          }

          return {
            item: it.item || `${idx + 1}.00`,
            descripcion: it.descripcion,
            unidad: it.unidad || 'Global',
            cantidad,
            precioUnitario,
            precioParcial,
            esTitulo: Boolean(it.esTitulo),
            orden: it.orden || idx + 1,
          };
        });
      } else {
        // Si no tenía items (ej. cotización antigua escaneada con monto global)
        costoDirecto = sourceQuote.montoCostoDirecto;
        if (pct !== 0) {
          costoDirecto = Math.round(costoDirecto * factor * 100) / 100;
        }
      }

      costoDirecto = Math.round(costoDirecto * 100) / 100;
      const montoIgv = Math.round(costoDirecto * 0.18 * 100) / 100;
      const montoTotal = Math.round((costoDirecto + montoIgv) * 100) / 100;
      const montoLetras = numeroALetrasSoles(montoTotal);

      // Crear la nueva cotización
      const newQuote = await prisma.quote.create({
        data: {
          numero: finalNumero,
          codigoInterno,
          empresaId: target.empresaId,
          entidad: sourceQuote.entidad,
          atencion: sourceQuote.atencion,
          fecha: targetDate,
          objetoServicio: sourceQuote.objetoServicio,
          ubicacion: sourceQuote.ubicacion,
          validezOferta: sourceQuote.validezOferta,
          tiempoEjecucion: sourceQuote.tiempoEjecucion,
          garantia: sourceQuote.garantia,
          formaPago: sourceQuote.formaPago,
          lugarEjecucion: sourceQuote.lugarEjecucion,
          montoCostoDirecto: costoDirecto,
          montoIgv,
          montoTotal,
          montoLetras,
          estado: 'ENVIADA',
          esAntigua: false,
          archivoPdf: null,
          servicioId: null,
          items: newItems.length > 0 ? { create: newItems } : undefined,
        },
        include: {
          empresa: true,
          items: true,
        },
      });

      createdQuotes.push(newQuote);
    }

    if (createdQuotes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se pudo crear ninguna cotización para las empresas indicadas' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Cotización duplicada con éxito para ${createdQuotes.length} empresa(s)`,
      data: {
        createdQuotes,
        firstQuoteId: createdQuotes[0].id,
      },
    });
  } catch (error: any) {
    console.error('Error duplicating quote:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al duplicar la cotización' },
      { status: 500 }
    );
  }
}
