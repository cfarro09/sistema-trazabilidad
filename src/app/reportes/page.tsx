'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Building,
  DollarSign,
  FileSpreadsheet,
  PieChart,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  ExternalLink,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import StageBadge from '@/components/StageBadge';

const MESES = [
  { valor: 'ALL', label: 'Todos los Meses' },
  { valor: '0', label: 'Enero' },
  { valor: '1', label: 'Febrero' },
  { valor: '2', label: 'Marzo' },
  { valor: '3', label: 'Abril' },
  { valor: '4', label: 'Mayo' },
  { valor: '5', label: 'Junio' },
  { valor: '6', label: 'Julio' },
  { valor: '7', label: 'Agosto' },
  { valor: '8', label: 'Setiembre' },
  { valor: '9', label: 'Octubre' },
  { valor: '10', label: 'Noviembre' },
  { valor: '11', label: 'Diciembre' },
];

export default function ReportesPage() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedEstado, setSelectedEstado] = useState<string>('ALL');
  const [selectedRubro, setSelectedRubro] = useState<string>('ALL');

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/servicios');
      const data = await res.json();
      if (data.success) {
        setServicios(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  // Extraer lista de años únicos
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    servicios.forEach((s) => {
      const dateStr = s.fechaOrden || s.fechaFactura || s.fechaCotizacion || s.createdAt;
      if (dateStr) {
        const year = new Date(dateStr).getFullYear().toString();
        if (!isNaN(Number(year))) years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [servicios]);

  // Extraer lista de rubros únicos
  const availableRubros = useMemo(() => {
    const rubros = new Set<string>();
    servicios.forEach((s) => {
      if (s.rubro) rubros.add(s.rubro);
    });
    return Array.from(rubros).sort();
  }, [servicios]);

  // Filtrado reactivo en tiempo real
  const filteredServicios = useMemo(() => {
    return servicios.filter((s) => {
      // Fecha base de evaluación
      const dateStr = s.fechaOrden || s.fechaFactura || s.fechaCotizacion || s.createdAt;
      const itemDate = dateStr ? new Date(dateStr) : null;

      // Filtro Año
      if (selectedYear !== 'ALL' && itemDate) {
        if (itemDate.getFullYear().toString() !== selectedYear) return false;
      }

      // Filtro Mes
      if (selectedMonth !== 'ALL' && itemDate) {
        if (itemDate.getMonth().toString() !== selectedMonth) return false;
      }

      // Filtro Estado
      if (selectedEstado !== 'ALL' && s.estado !== selectedEstado) {
        return false;
      }

      // Filtro Rubro
      if (selectedRubro !== 'ALL' && s.rubro !== selectedRubro) {
        return false;
      }

      // Filtro de Búsqueda por texto (Código, O/S, SIAF, Factura, Entidad, Objeto)
      if (search) {
        const term = search.toLowerCase().trim();
        const matchesCode = s.codigoInterno?.toLowerCase().includes(term);
        const matchesOS = s.nroOrdenServicio?.toLowerCase().includes(term);
        const matchesSIAF = s.nroSiaf?.toLowerCase().includes(term);
        const matchesFactura = s.nroFactura?.toLowerCase().includes(term);
        const matchesCotiz = s.nroCotizacion?.toLowerCase().includes(term);
        const matchesEntidad = s.entidad?.toLowerCase().includes(term);
        const matchesObjeto = s.objetoContratacion?.toLowerCase().includes(term);
        const matchesEmpresa = s.empresa?.razonSocial?.toLowerCase().includes(term);

        if (
          !matchesCode &&
          !matchesOS &&
          !matchesSIAF &&
          !matchesFactura &&
          !matchesCotiz &&
          !matchesEntidad &&
          !matchesObjeto &&
          !matchesEmpresa
        ) {
          return false;
        }
      }

      return true;
    });
  }, [servicios, search, selectedYear, selectedMonth, selectedEstado, selectedRubro]);

  // Cálculos de Totales y KPIs
  const kpis = useMemo(() => {
    let totalContratado = 0;
    let totalFacturado = 0;
    let totalPagado = 0;

    filteredServicios.forEach((s) => {
      const monto = s.montoTotal || 0;
      totalContratado += monto;
      if (['FACTURADO', 'CONFORME', 'PAGADO'].includes(s.estado)) {
        totalFacturado += s.montoFacturado || monto;
      }
      if (s.estado === 'PAGADO') {
        totalPagado += s.montoPagado || monto;
      }
    });

    const saldoPendiente = totalContratado - totalPagado;

    return {
      totalContratado,
      totalFacturado,
      totalPagado,
      saldoPendiente,
      count: filteredServicios.length,
    };
  }, [filteredServicios]);

  // Distribución por Rubro
  const rubrosDistribucion = useMemo(() => {
    const map: { [key: string]: { count: number; total: number } } = {};
    filteredServicios.forEach((s) => {
      const rubro = s.rubro || 'OTROS';
      const monto = s.montoTotal || 0;
      if (!map[rubro]) map[rubro] = { count: 0, total: 0 };
      map[rubro].count += 1;
      map[rubro].total += monto;
    });
    return map;
  }, [filteredServicios]);

  // Distribución por Entidad
  const entidadesDistribucion = useMemo(() => {
    const map: { [key: string]: { count: number; total: number } } = {};
    filteredServicios.forEach((s) => {
      const ent = s.entidad || 'SIN ENTIDAD';
      const monto = s.montoTotal || 0;
      if (!map[ent]) map[ent] = { count: 0, total: 0 };
      map[ent].count += 1;
      map[ent].total += monto;
    });
    return map;
  }, [filteredServicios]);

  // Exportar a CSV
  const handleExportCSV = () => {
    if (filteredServicios.length === 0) {
      alert('No hay registros para exportar');
      return;
    }

    const headers = [
      'Codigo Interno',
      'Entidad Convocante',
      'Objeto de Contratacion',
      'Rubro',
      'Nro Orden Servicio',
      'Nro SIAF',
      'Nro Factura',
      'Fecha Emision/Orden',
      'Monto Total (S/)',
      'Estado',
      'Empresa',
    ];

    const rows = filteredServicios.map((s) => [
      `"${s.codigoInterno || ''}"`,
      `"${(s.entidad || '').replace(/"/g, '""')}"`,
      `"${(s.objetoContratacion || '').replace(/"/g, '""')}"`,
      `"${s.rubro || ''}"`,
      `"${s.nroOrdenServicio || ''}"`,
      `"${s.nroSiaf || ''}"`,
      `"${s.nroFactura || ''}"`,
      `"${s.fechaOrden ? new Date(s.fechaOrden).toISOString().split('T')[0] : ''}"`,
      s.montoTotal?.toFixed(2) || '0.00',
      `"${s.estado || ''}"`,
      `"${(s.empresa?.razonSocial || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_Trazabilidad_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Módulo de Reportes & Consultas Históricas
          </h1>
          <p className="text-sm text-slate-500">
            Filtros por año, mes, código, N° de O/S, SIAF y exportación consolidada de la trazabilidad
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Excel/CSV
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* PANEL DE FILTROS AVANZADOS (AÑO, MES, CÓDIGO, ESTADO, RUBRO) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-600" />
            Filtros de Búsqueda & Consulta
          </div>
          {(selectedYear !== 'ALL' ||
            selectedMonth !== 'ALL' ||
            selectedEstado !== 'ALL' ||
            selectedRubro !== 'ALL' ||
            search !== '') && (
            <button
              onClick={() => {
                setSelectedYear('ALL');
                setSelectedMonth('ALL');
                setSelectedEstado('ALL');
                setSelectedRubro('ALL');
                setSearch('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Limpiar Filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Buscador por Código / O/S / SIAF / Entidad */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Buscar por Código / O.S. / SIAF / Entidad
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ej. COT-2026-00175, 0000701, SUSALUD..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Filtro por Año */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Año</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Todos los Años</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  Año {y}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Mes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Mes</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {MESES.map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Estado</label>
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="COTIZACION">Cotización</option>
              <option value="ACEPTADO_ORDEN">Orden de Servicio</option>
              <option value="EN_EJECUCION">En Ejecución</option>
              <option value="FACTURADO">Facturado</option>
              <option value="CONFORME">Conforme</option>
              <option value="PAGADO">100% Pagado</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI GENERALES DINÁMICOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Monto Total Contratado
          </span>
          <div className="text-xl font-black text-slate-900 mt-1.5 font-mono">
            S/ {kpis.totalContratado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            En <strong>{kpis.count}</strong> servicio(s) encontrados
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block">
            Total Facturado
          </span>
          <div className="text-xl font-black text-teal-700 mt-1.5 font-mono">
            S/ {kpis.totalFacturado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Con comprobante emitido</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Total Cobrado / Pagado
          </span>
          <div className="text-xl font-black text-emerald-600 mt-1.5 font-mono">
            S/ {kpis.totalPagado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Abonado en cuenta / SIAF</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
            Saldo Pendiente de Cobro
          </span>
          <div className="text-xl font-black text-amber-600 mt-1.5 font-mono">
            S/ {kpis.saldoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">En proceso o ejecución</div>
        </div>
      </div>

      {/* TABLA DE RESULTADOS DE CONSULTA HISTÓRICA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold tracking-wide">
              Expedientes & Contratos Encontrados ({filteredServicios.length})
            </h2>
          </div>
          <span className="text-[11px] text-slate-300 font-mono">
            Filtro: {selectedYear !== 'ALL' ? `Año ${selectedYear}` : 'Histórico completo'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-3 px-4 w-32">CÓDIGO</th>
                <th className="py-3 px-4">ENTIDAD & OBJETO</th>
                <th className="py-3 px-4 w-28">O/S & SIAF</th>
                <th className="py-3 px-4 w-28">RUBRO</th>
                <th className="py-3 px-4 text-right w-32">MONTO (S/)</th>
                <th className="py-3 px-4 text-center w-28">ESTADO</th>
                <th className="py-3 px-4 text-center w-24">EXPEDIENTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Cargando consultas...
                  </td>
                </tr>
              ) : filteredServicios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No se encontraron contratos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredServicios.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-blue-700">{s.codigoInterno}</div>
                      <div className="text-[10px] text-slate-400">
                        {s.fechaOrden
                          ? new Date(s.fechaOrden).toLocaleDateString('es-PE')
                          : s.createdAt
                          ? new Date(s.createdAt).toLocaleDateString('es-PE')
                          : '-'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1">{s.entidad}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {s.objetoContratacion}
                      </div>
                      {s.empresa?.razonSocial && (
                        <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                          🏢 {s.empresa.razonSocial}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {s.nroOrdenServicio ? (
                        <div>
                          <span className="font-bold text-slate-800">O/S: {s.nroOrdenServicio}</span>
                          {s.nroSiaf && (
                            <span className="text-[10px] text-slate-400 block">SIAF: {s.nroSiaf}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sin O/S</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                        {s.rubro || 'GENERAL'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      S/ {s.montoTotal?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <StageBadge status={s.estado} />
                    </td>

                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/servicios/${s.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold transition-colors"
                      >
                        <span>Ver</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISTRIBUCIÓN POR RUBRO Y POR ENTIDAD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Rubro */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            Distribución por Especialidad / Rubro
          </h3>

          <div className="space-y-3">
            {Object.entries(rubrosDistribucion).map(([rubro, data]) => {
              const porcentaje =
                kpis.totalContratado > 0 ? (data.total / kpis.totalContratado) * 100 : 0;
              return (
                <div key={rubro} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{rubro}</span>
                    <span className="font-black text-slate-900 font-mono">
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
                    {data.count} servicio(s) • {porcentaje.toFixed(1)}% del periodo filtrado
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Por Entidad */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Principales Entidades Contratantes
          </h3>

          <div className="divide-y divide-slate-100 text-xs max-h-80 overflow-y-auto">
            {Object.entries(entidadesDistribucion).map(([entidad, data]) => (
              <div key={entidad} className="py-2.5 flex items-center justify-between">
                <div className="pr-3">
                  <div className="font-bold text-slate-800 line-clamp-1">{entidad}</div>
                  <div className="text-[10px] text-slate-400">{data.count} contratación(es)</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-slate-900 font-mono">
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
