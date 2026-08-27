import { NextRequest, NextResponse } from 'next/server';
import {
  VALOR_M2_GRUPOS,
  PARTIDAS_PRESUPUESTO,
  INSUMOS_PRECIOS,
  APU_CATALOGO,
} from '@/lib/costos-directos-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'valorm2';
    const query = searchParams.get('q')?.toLowerCase() || '';
    const especialidad = searchParams.get('especialidad');
    const tipo = searchParams.get('tipo');

    if (tab === 'valorm2') {
      let grupos = VALOR_M2_GRUPOS;
      let partidas = PARTIDAS_PRESUPUESTO;

      if (query) {
        grupos = grupos.filter(
          (g) =>
            g.item.includes(query) ||
            g.grupo.toLowerCase().includes(query)
        );
        partidas = partidas.filter(
          (p) =>
            p.item.includes(query) ||
            p.partida.toLowerCase().includes(query) ||
            p.grupoItem.includes(query)
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          tipologia: 'TIPOLOGÍA A - VIVIENDA UNIFAMILIAR ECONÓMICA',
          valorM2TotalSoles: 1654.37,
          grupos,
          partidas,
        },
      });
    }

    if (tab === 'partidas') {
      let partidas = PARTIDAS_PRESUPUESTO;
      if (especialidad && especialidad !== 'ALL') {
        partidas = partidas.filter((p) => p.especialidad === especialidad);
      }
      if (query) {
        partidas = partidas.filter(
          (p) =>
            p.item.toLowerCase().includes(query) ||
            p.partida.toLowerCase().includes(query) ||
            p.unidad.toLowerCase().includes(query)
        );
      }
      return NextResponse.json({ success: true, data: partidas });
    }

    if (tab === 'insumos') {
      let insumos = INSUMOS_PRECIOS;
      if (tipo && tipo !== 'ALL') {
        insumos = insumos.filter((i) => i.tipo === tipo);
      }
      if (query) {
        insumos = insumos.filter(
          (i) =>
            i.codigo.toLowerCase().includes(query) ||
            i.descripcion.toLowerCase().includes(query) ||
            i.grupo.toLowerCase().includes(query) ||
            (i.proveedor && i.proveedor.toLowerCase().includes(query)) ||
            (i.marca && i.marca.toLowerCase().includes(query))
        );
      }
      return NextResponse.json({ success: true, data: insumos });
    }

    if (tab === 'apu') {
      let apus = APU_CATALOGO;
      if (especialidad && especialidad !== 'ALL') {
        apus = apus.filter((a) => a.especialidad === especialidad);
      }
      if (query) {
        apus = apus.filter(
          (a) =>
            a.codigo.toLowerCase().includes(query) ||
            a.descripcion.toLowerCase().includes(query)
        );
      }
      return NextResponse.json({ success: true, data: apus });
    }

    // Default: Return search results across all items (ideal for the Lupa modal in Cotizaciones)
    const matchedPartidas = PARTIDAS_PRESUPUESTO.filter(
      (p) =>
        p.item.toLowerCase().includes(query) ||
        p.partida.toLowerCase().includes(query)
    );
    const matchedInsumos = INSUMOS_PRECIOS.filter(
      (i) =>
        i.codigo.toLowerCase().includes(query) ||
        i.descripcion.toLowerCase().includes(query)
    );

    return NextResponse.json({
      success: true,
      data: {
        partidas: matchedPartidas,
        insumos: matchedInsumos,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error en costos directos' },
      { status: 500 }
    );
  }
}
