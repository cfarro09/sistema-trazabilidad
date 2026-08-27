import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  FileSpreadsheet,
  Search,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  AlertTriangle,
  FileText,
  FileCheck2,
} from 'lucide-react';
import StageBadge from '@/components/StageBadge';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const servicios = await prisma.serviceContract.findMany({
    include: {
      empresa: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  });

  const allServicios = await prisma.serviceContract.findMany();
  const empresas = await prisma.company.findMany();
  const profesionales = await prisma.professional.findMany();

  // Métricas
  const totalMontoContratado = allServicios.reduce(
    (acc, s) => acc + (s.montoFacturado || s.montoTotal || 0),
    0
  );

  const cotizacionesCount = allServicios.filter((s) => s.estado === 'COTIZACION').length;
  const enEjecucionCount = allServicios.filter(
    (s) => s.estado === 'EN_EJECUCION' || s.estado === 'ACEPTADO_ORDEN'
  ).length;
  const concluidosCount = allServicios.filter(
    (s) => s.estado === 'CONFORME' || s.estado === 'FACTURADO' || s.estado === 'PAGADO'
  ).length;

  const now = new Date();
  const colegiaturasPorVencer = profesionales.filter((p) => {
    if (!p.colegiaturaCaducidad) return false;
    const diff =
      (new Date(p.colegiaturaCaducidad).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 60; // Dentro de los próximos 60 días
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Panel de Control de Licitaciones y Órdenes
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Trazabilidad de Contrataciones Estatales
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Control centralizado desde el TDR, Cotización, Orden de Servicio SIGA y Expediente
              SIAF hasta la Acreditación de Experiencia para las 3 empresas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/experiencia"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <Search className="w-4 h-4" />
              Acreditar Experiencia
            </Link>
            <Link
              href="/empaquetador"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              Armar Expediente PDF
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Monto Total Contratado
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">
            S/ {totalMontoContratado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>En {allServicios.length} órdenes y cotizaciones</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              En Ejecución / Orden
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-indigo-600">{enEjecucionCount}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Con N° O/S y SIAF asignados</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cotizaciones en Trámite
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600">{cotizacionesCount}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Código interno activo</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Concluidos & Conformes
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-600">{concluidosCount}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Listos para acreditar experiencia</span>
          </div>
        </div>
      </div>

      {/* Alerta de Colegiaturas si hay */}
      {colegiaturasPorVencer.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Atención: {colegiaturasPorVencer.length} Profesional(es) con colegiatura por vencer
              </h4>
              <p className="text-xs text-amber-700">
                Verifique las constancias de habilidad antes de incluirlos en nuevos expedientes de
                postulación.
              </p>
            </div>
          </div>
          <Link
            href="/profesionales"
            className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-colors"
          >
            Ver Personal
          </Link>
        </div>
      )}

      {/* Flujo de 8 Hitos Documentales - Infografía Visual */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              Pipeline de Trazabilidad Documental (Hoja de Ruta)
            </h2>
            <p className="text-xs text-slate-500">
              Los 8 hitos reglamentarios que sigue cada contratación con el Estado
            </p>
          </div>
          <Link
            href="/servicios"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Gestionar Órdenes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          {[
            { num: '1', name: 'Convocatoria', sub: 'TDRs', color: 'bg-slate-100 text-slate-700' },
            { num: '2', name: 'Cotización', sub: 'Cód. Interno', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { num: '3', name: 'Expediente', sub: 'PDF Foliado', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { num: '4', name: 'Orden O/S', sub: 'N° SIAF', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
            { num: '5', name: 'Informe Final', sub: 'Entregable', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { num: '6', name: 'Facturación', sub: 'Comprobante', color: 'bg-teal-50 text-teal-700 border-teal-200' },
            { num: '7', name: 'Conformidad', sub: 'Acta Oficial', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { num: '8', name: 'Pago SIAF', sub: 'Detracción', color: 'bg-green-100 text-green-800 border-green-300' },
          ].map((step, idx) => (
            <div
              key={step.num}
              className={`p-3 rounded-xl border text-center relative ${step.color}`}
            >
              <div className="w-5 h-5 mx-auto rounded-full bg-white/80 font-bold text-[10px] flex items-center justify-center shadow-xs mb-1">
                {step.num}
              </div>
              <div className="text-xs font-bold truncate">{step.name}</div>
              <div className="text-[10px] opacity-75">{step.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Servicios Recientes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Servicios y Órdenes Recientes</h2>
            <p className="text-xs text-slate-500">
              Últimas contrataciones registradas en el sistema
            </p>
          </div>
          <Link
            href="/servicios"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Ver todos los servicios <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Referencia / SIAF</th>
                <th className="px-5 py-3">Empresa</th>
                <th className="px-5 py-3">Entidad Pública</th>
                <th className="px-5 py-3">Objeto / Descripción</th>
                <th className="px-5 py-3 text-right">Monto (S/)</th>
                <th className="px-5 py-3 text-center">Estado</th>
                <th className="px-5 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {servicios.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    <div>{s.nroOrdenServicio ? `O/S: ${s.nroOrdenServicio}` : s.codigoInterno}</div>
                    {s.nroSiaf && (
                      <div className="text-[11px] text-blue-600 font-normal">
                        SIAF: {s.nroSiaf}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">
                      {s.empresa?.nombreComercial || s.empresa?.razonSocial}
                    </span>
                    <div className="text-[10px] text-slate-400">RUC: {s.empresa?.ruc}</div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700 max-w-xs truncate">
                    {s.entidad}
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-md">
                    <p className="line-clamp-2">{s.objetoContratacion || s.descripcionDetallada}</p>
                    {s.rubro && (
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {s.rubro}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900 whitespace-nowrap">
                    S/ {s.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <StageBadge status={s.estado} />
                  </td>
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <Link
                      href={`/servicios/${s.id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                    >
                      Trazabilidad
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
