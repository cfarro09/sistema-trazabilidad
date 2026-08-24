import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { numeroALetrasSoles } from '@/lib/number-to-letters';

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
      return NextResponse.json({ success: false, error: 'Cotización no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: quote });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener cotización' },
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
      estado,
      items,
    } = body;

    // Recalcular montos si vienen items
    let updateData: any = {};
    if (empresaId) updateData.empresaId = empresaId;
    if (entidad) updateData.entidad = entidad;
    if (atencion !== undefined) updateData.atencion = atencion;
    if (fecha) updateData.fecha = new Date(fecha);
    if (objetoServicio) updateData.objetoServicio = objetoServicio;
    if (ubicacion !== undefined) updateData.ubicacion = ubicacion;
    if (validezOferta) updateData.validezOferta = validezOferta;
    if (tiempoEjecucion) updateData.tiempoEjecucion = tiempoEjecucion;
    if (garantia) updateData.garantia = garantia;
    if (formaPago) updateData.formaPago = formaPago;
    if (lugarEjecucion !== undefined) updateData.lugarEjecucion = lugarEjecucion;
    if (estado) updateData.estado = estado;

    if (items && Array.isArray(items)) {
      let costoDirecto = 0;
      const formattedItems = items.map((it: any, index: number) => {
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

      const montoIgv = Math.round(costoDirecto * 0.18 * 100) / 100;
      const montoTotal = Math.round((costoDirecto + montoIgv) * 100) / 100;

      updateData.montoCostoDirecto = costoDirecto;
      updateData.montoIgv = montoIgv;
      updateData.montoTotal = montoTotal;
      updateData.montoLetras = numeroALetrasSoles(montoTotal);

      // Eliminar items antiguos y recrear
      await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
      await prisma.quoteItem.createMany({
        data: formattedItems.map((it: any) => ({ ...it, quoteId: id })),
      });
    }

    const updated = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        empresa: true,
        items: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar cotización' },
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
    await prisma.quote.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Cotización eliminada' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al eliminar cotización' },
      { status: 500 }
    );
  }
}
