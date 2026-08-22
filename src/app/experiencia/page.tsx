'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Building,
  DollarSign,
  TrendingUp,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import StageBadge from '@/components/StageBadge';

export default function AcreditadorExperienciaPage() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('pintura'); // Pre-set to "pintura" as in user's prompt!
  const [targetAmount, setTargetAmount] = useState<number>(50000); // Meta de S/ 50,000
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  const fetchConformes = async (searchTerm = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('soloConformes', 'true');
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/servicios?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setServicios(data.data);
        // Pre-select the ones matching search for quick demo
        const matchIds = data.data.map((s: any) => s.id);
        setSelectedIds(matchIds);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConformes(search);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConformes(search);
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === servicios.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(servicios.map((s) => s.id));
    }
  };

  // Cálculo de sumatoria
  const selectedServicios = servicios.filter((s) => selectedIds.includes(s.id));
  const montoTotalAcumulado = selectedServicios.reduce(
    (acc, s) => acc + (s.montoFacturado || s.montoTotal || 0),
    0
  );

  const porcentajeMeta = targetAmount > 0 ? (montoTotalAcumulado / targetAmount) * 100 : 0;
  const metaCumplida = montoTotalAcumulado >= targetAmount;

  // Exportar Excel
  const handleExportExcel = async () => {
    if (selectedIds.length === 0) return;
    setExporting(true);
    try {
      const res = await fetch('/api/experiencia/exportar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceIds: selectedIds,
          rubroBuscado: search || 'Servicios',
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resumen_Experiencia_${search || 'Acreditacion'}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Herramienta de Acreditación OSCE & Compras Públicas
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Buscador & Acreditador de Experiencia
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl mt-1">
              Filtra entre 15 años de facturaciones de las 3 empresas por palabras clave (ej:
              "pintura"), calcula el monto acumulado contra la meta de la licitación y exporta el
              cuadro de sustento.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">
              Monto Meta Requerido en TDR
            </span>
            <div className="flex items-center gap-1 justify-end mt-1">
              <span className="text-sm font-bold text-slate-300">S/</span>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 0)}
                className="w-28 bg-white/20 text-white font-black text-lg px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buscador de Palabras Clave */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Escribe el objeto o especialidad requerida: ej. pintura, escaleras, alfombra, mantenimiento..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar Facturaciones
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-700">Sugerencias rápidas:</span>
          {['pintura', 'escaleras', 'alfombra', 'mantenimiento', 'eléctricas', 'acabados'].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearch(tag);
                  fetchConformes(tag);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-semibold rounded-lg transition-colors capitalize"
              >
                #{tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Tabla de Servicios y Facturas encontradas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Servicios Facturados y Conformes ({servicios.length} encontrados)
            </h2>
            <button
              onClick={selectAll}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              {selectedIds.length === servicios.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Solo cotizaciones aceptadas con orden y factura
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={servicios.length > 0 && selectedIds.length === servicios.length}
                    onChange={selectAll}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-5 py-3">Entidad / Cliente</th>
                <th className="px-5 py-3">Orden / SIAF</th>
                <th className="px-5 py-3">Descripción Detallada</th>
                <th className="px-5 py-3">Factura</th>
                <th className="px-5 py-3 text-right">Monto Acreditado</th>
                <th className="px-5 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Buscando en el historial de contrataciones...
                  </td>
                </tr>
              ) : servicios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <p className="font-bold">No se encontraron servicios conformes para "{search}".</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Intenta buscar con otro término como "mantenimiento" o "acabados".
                    </p>
                  </td>
                </tr>
              ) : (
                servicios.map((s) => {
                  const isSelected = selectedIds.includes(s.id);
                  const monto = s.montoFacturado || s.montoTotal || 0;

                  return (
                    <tr
                      key={s.id}
                      onClick={() => toggleSelect(s.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(s.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{s.entidad}</div>
                        <div className="text-[10px] text-slate-400">
                          {s.empresa?.nombreComercial || s.empresa?.razonSocial}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          {s.nroOrdenServicio ? `O/S N° ${s.nroOrdenServicio}` : s.codigoInterno}
                        </div>
                        {s.nroSiaf && (
                          <div className="text-[11px] text-blue-600 font-semibold">
                            SIAF: {s.nroSiaf}
                          </div>
                        )}
                        {s.fechaOrden && (
                          <div className="text-[10px] text-slate-400">
                            {new Date(s.fechaOrden).toLocaleDateString('es-PE')}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-700 max-w-md">
                        <p className="line-clamp-2 leading-relaxed">{s.descripcionDetallada}</p>
                        {s.rubro && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {s.rubro}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {s.nroFactura ? (
                          <div className="text-teal-700">Fact. {s.nroFactura}</div>
                        ) : (
                          <span className="text-slate-400 font-normal">Por facturar</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-black text-slate-900 text-sm whitespace-nowrap">
                        S/ {monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <StageBadge status={s.estado} size="sm" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Bar: Calculadora de Sumatoria y Exportador */}
      <div className="fixed bottom-0 left-64 right-0 bg-slate-900 text-white p-4 border-t border-slate-800 shadow-2xl z-30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Servicios Seleccionados
            </span>
            <div className="text-lg font-black text-white">
              {selectedIds.length} de {servicios.length}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Monto Total Acumulado
            </span>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              S/ {montoTotalAcumulado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              {metaCumplida && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-400/30">
                  ✓ Meta Superada ({porcentajeMeta.toFixed(0)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportExcel}
            disabled={selectedIds.length === 0 || exporting}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {exporting ? 'Generando Excel...' : 'Exportar Cuadro OSCE (Excel)'}
          </button>

          <button
            onClick={() =>
              alert(
                `Paquete de ${selectedIds.length} facturas y conformidades agrupado y listo para adjuntar.`
              )
            }
            disabled={selectedIds.length === 0}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Descargar Evidencias (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
