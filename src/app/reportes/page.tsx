import React from 'react';
import { prisma } from '@/lib/prisma';
import {
  BarChart3,
  TrendingUp,
  Building,
  DollarSign,
  FileSpreadsheet,
  PieChart,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ReportesPage() {
  const servicios = await prisma.serviceContract.findMany({
    include: { empresa: true },
  });

  const totalFacturado = servicios.reduce(
    (acc, s) => acc + (s.montoFacturado || s.montoTotal || 0),
    0
  );

  // Agrupado por Rubro
  const rubrosMap: { [key: string]: { count: number; total: number } } = {};
  servicios.forEach((s) => {
    const rubro = s.rubro || 'OTROS';
    const monto = s.montoFacturado || s.montoTotal || 0;
    if (!rubrosMap[rubro]) rubrosMap[rubro] = { count: 0, total: 0 };
    rubrosMap[rubro].count += 1;
    rubrosMap[rubro].total += monto;
  });

  // Agrupado por Entidad
  const entidadesMap: { [key: string]: { count: number; total: number } } = {};
  servicios.forEach((s) => {
    const ent = s.entidad;
    const monto = s.montoFacturado || s.montoTotal || 0;
    if (!entidadesMap[ent]) entidadesMap[ent] = { count: 0, total: 0 };
    entidadesMap[ent].count += 1;
    entidadesMap[ent].total += monto;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-blue-600" />
          Reportes & Estadísticas de Licitaciones
        </h1>
        <p className="text-sm text-slate-500">
          Resumen consolidado de montos contratados, distribución por rubros y entidades públicas
        </p>
      </div>

      {/* KPI General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">
            Monto Total Ejecutado / Facturado
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            S/ {totalFacturado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">Acumulado en todas las empresas</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">
            Servicios Registrados
          </span>
          <div className="text-2xl font-black text-blue-600 mt-2">{servicios.length}</div>
          <div className="text-xs text-slate-500 mt-1">Incluye histórico de 15 años</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">
              Herramienta de Acreditación
            </span>
            <div className="text-sm font-bold text-slate-800 mt-1">
              Exportar formato OSCE oficial
            </div>
          </div>
          <Link
            href="/experiencia"
            className="inline-flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Ir al Acreditador de Experiencia
          </Link>
        </div>
      </div>

      {/* Tablas de Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Rubro */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            Distribución por Especialidad / Rubro
          </h2>

          <div className="space-y-3">
            {Object.entries(rubrosMap).map(([rubro, data]) => {
              const porcentaje = (data.total / totalFacturado) * 100;
              return (
                <div key={rubro} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{rubro}</span>
                    <span className="font-black text-slate-900">
                      S/ {data.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    {data.count} servicio(s) • {porcentaje.toFixed(1)}% del total
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Por Entidad */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Principales Entidades Contratantes
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {Object.entries(entidadesMap).map(([entidad, data]) => (
              <div key={entidad} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{entidad}</div>
                  <div className="text-[10px] text-slate-400">{data.count} contratación(es)</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">
                    S/ {data.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
