import { NextRequest, NextResponse } from 'next/server';
import {
  VALOR_M2_GRUPOS,
  PARTIDAS_PRESUPUESTO,
  PARTIDAS_OE_HU,
  INSUMOS_PRECIOS,
  INDICE_GRUPOS_INSUMOS,
  PROVEEDORES_DIRECTORIO,
  APU_CATALOGO,
} from '@/lib/costos-directos-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'valorm2';
    const query = searchParams.get('q')?.toLowerCase().trim() || '';
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
          totalCostoDirecto: 330873.03,
          valorM2TotalSoles: 1654.37,
          valorM2TotalDolares: 449.19,
          tipoCambio: 3.683,
          grupos,
          partidas,
        },
      });
    }

    if (tab === 'partidas') {
      let partidasOEHU = PARTIDAS_OE_HU;
      if (especialidad && especialidad !== 'ALL') {
        partidasOEHU = partidasOEHU.filter((p) => p.especialidad === especialidad);
      }
      if (query) {
        partidasOEHU = partidasOEHU.filter(
          (p) =>
            p.codigo.toLowerCase().includes(query) ||
            p.partida.toLowerCase().includes(query) ||
            p.subcategoria.toLowerCase().includes(query) ||
            p.unidad.toLowerCase().includes(query)
        );
      }
      return NextResponse.json({ success: true, data: partidasOEHU });
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
            (i.marca && i.marca.toLowerCase().includes(query)) ||
            (i.pagina && i.pagina.includes(query))
        );
      }
      return NextResponse.json({ success: true, data: insumos });
    }

    if (tab === 'proveedores') {
      let proveedores = PROVEEDORES_DIRECTORIO;
      if (query) {
        proveedores = proveedores.filter(
          (p) =>
            p.nombre.toLowerCase().includes(query) ||
            (p.direccion && p.direccion.toLowerCase().includes(query)) ||
            (p.pagina && p.pagina.includes(query))
        );
      }
      return NextResponse.json({ success: true, data: proveedores });
    }

    if (tab === 'indice') {
      let indice = INDICE_GRUPOS_INSUMOS;
      if (query) {
        indice = indice.filter(
          (g) =>
            g.grupo.toLowerCase().includes(query) ||
            g.pagina.includes(query) ||
            (g.descripcion && g.descripcion.toLowerCase().includes(query))
        );
      }
      return NextResponse.json({ success: true, data: indice });
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

    // Default: Búsqueda cruzada para la lupa en Cotizaciones
    const matchedPresupuesto = PARTIDAS_PRESUPUESTO.filter(
      (p) =>
        p.item.toLowerCase().includes(query) ||
        p.partida.toLowerCase().includes(query)
    );
    const matchedOEHU = PARTIDAS_OE_HU.filter(
      (p) =>
        p.codigo.toLowerCase().includes(query) ||
        p.partida.toLowerCase().includes(query)
    );
    const matchedInsumos = INSUMOS_PRECIOS.filter(
      (i) =>
        i.codigo.toLowerCase().includes(query) ||
        i.descripcion.toLowerCase().includes(query) ||
        i.grupo.toLowerCase().includes(query)
    );

    return NextResponse.json({
      success: true,
      data: {
        partidas: [...matchedPresupuesto, ...matchedOEHU.map(o => ({
          item: o.codigo,
          grupoItem: o.especialidad,
          partida: o.partida,
          unidad: o.unidad,
          metrado: 1,
          precioUnitario: o.precioUnitario,
          parcial: o.precioUnitario,
          especialidad: o.especialidad as any,
        }))],
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
