'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Building,
  Printer,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  FileCheck,
  DollarSign,
  Layers,
  Upload,
  Download,
} from 'lucide-react';
import Modal from '@/components/Modal';

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('ALL');
  const [selectedEstado, setSelectedEstado] = useState('ALL');

  // Modal subir antigua
  const [modalAntiguaOpen, setModalAntiguaOpen] = useState(false);
  const [formAntigua, setFormAntigua] = useState({
    empresaId: '',
    entidad: '',
    numero: '',
    fecha: '',
    objetoServicio: '',
    montoTotal: '',
    pdfUrl: '',
  });

  const fetchCotizaciones = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedEmpresa !== 'ALL') params.append('empresaId', selectedEmpresa);
      if (selectedEstado !== 'ALL') params.append('estado', selectedEstado);
      if (search) params.append('search', search);

      const res = await fetch(`/api/cotizaciones?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCotizaciones(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/empresas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmpresas(data.data);
          if (data.data.length > 0) {
            setFormAntigua((prev) => ({ ...prev, empresaId: data.data[0].id }));
          }
        }
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCotizaciones();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, selectedEmpresa, selectedEstado]);

  const handleCreateAntigua = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formAntigua,
          esAntigua: true,
          estado: 'ACEPTADA',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalAntiguaOpen(false);
        fetchCotizaciones();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvertir = async (quoteId: string) => {
    if (!confirm('¿Deseas convertir esta cotización en una Orden de Servicio activa en Trazabilidad?')) {
      return;
    }
    try {
      const res = await fetch(`/api/cotizaciones/${quoteId}/convertir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchCotizaciones();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Módulo de Cotizaciones & Presupuestos
          </h1>
          <p className="text-sm text-slate-500">
            Elaboración formal de propuestas con partidas desagregadas, cálculo de IGV, formato oficial imprimible y conversión a Orden.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalAntiguaOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-950 font-bold text-xs border-2 border-amber-300 hover:border-amber-400 transition-all shadow-xs cursor-pointer"
          >
            <History className="w-4 h-4 text-amber-600" />
            Subir Cotización Antigua (Imagen/PDF)
          </button>

          <Link
            href="/cotizaciones/nueva"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Cotización Desagregada
          </Link>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por N° Cotización, Entidad, Objeto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedEmpresa}
              onChange={(e) => setSelectedEmpresa(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">🏢 Todas las Empresas</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.razonSocial}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { key: 'ALL', label: 'Todas' },
              { key: 'ENVIADA', label: 'Enviadas' },
              { key: 'ACEPTADA', label: 'Aceptadas (Ganadas)' },
              { key: 'BORRADOR', label: 'Borradores' },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setSelectedEstado(st.key)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedEstado === st.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Cotizaciones */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">N° Cotización</th>
                <th className="px-5 py-3.5">Empresa</th>
                <th className="px-5 py-3.5">Entidad Solicitante</th>
                <th className="px-5 py-3.5">Objeto del Servicio / Partidas</th>
                <th className="px-5 py-3.5 text-right">Monto Total</th>
                <th className="px-5 py-3.5 text-center">Estado</th>
                <th className="px-5 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Cargando cotizaciones...
                  </td>
                </tr>
              ) : cotizaciones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <p className="font-bold">No se encontraron cotizaciones.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Crea una nueva cotización detallada para comenzar.
                    </p>
                  </td>
                </tr>
              ) : (
                cotizaciones.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {c.numero}
                        </span>
                        {c.esAntigua && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            Histórica
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {new Date(c.fecha).toLocaleDateString('es-PE')}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">
                        {c.empresa?.nombreComercial || c.empresa?.razonSocial}
                      </div>
                      <div className="text-[10px] text-slate-400">RUC: {c.empresa?.ruc}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700 max-w-xs truncate">
                      {c.entidad}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-md">
                      <p className="font-medium text-slate-900 line-clamp-1">{c.objetoServicio}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {c.items?.length || 0} partidas desglosadas • Plazo: {c.tiempoEjecucion}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right font-black text-slate-900 whitespace-nowrap">
                      <div>S/ {c.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        Directo: S/ {c.montoCostoDirecto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          c.estado === 'ACEPTADA'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : c.estado === 'ENVIADA'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.estado === 'ACEPTADA' ? '✓ Aceptada (Orden)' : c.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={`/api/cotizaciones/${c.id}/pdf`}
                          download={`Cotizacion_${c.numero.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200 shadow-2xs"
                          title="Descargar Hoja Oficial PDF (A4)"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </a>

                        <Link
                          href={`/cotizaciones/${c.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                          title="Ver Formato Oficial Imprimible"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Ver
                        </Link>

                        {c.estado !== 'ACEPTADA' && (
                          <button
                            onClick={() => handleConvertir(c.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-emerald-200"
                            title="Convertir a Orden de Servicio"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            Aceptar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Subir Cotización Antigua */}
      <Modal
        isOpen={modalAntiguaOpen}
        onClose={() => setModalAntiguaOpen(false)}
        title="📥 Registrar Cotización Antigua (Digitalización de Históricos)"
        subtitle="Sube una cotización pasada para que quede registrada como antecedente del grupo"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateAntigua} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Empresa</label>
              <select
                required
                value={formAntigua.empresaId}
                onChange={(e) => setFormAntigua({ ...formAntigua, empresaId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
              >
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.razonSocial}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">N° de Cotización</label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const f = formAntigua.fecha || new Date().toISOString().substring(0, 10);
                      const res = await fetch(`/api/cotizaciones/correlativo?fecha=${f}`);
                      const data = await res.json();
                      if (data.success && data.data?.numero) {
                        setFormAntigua((prev) => ({ ...prev, numero: data.data.numero }));
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="text-[10px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded cursor-pointer transition-all"
                  title="Generar correlativo Año-Mes-N° según la fecha ingresada"
                >
                  🪄 Auto Año-Mes
                </button>
              </div>
              <input
                type="text"
                placeholder="Ej. Nº 00175 - 26 (o vacío para automático)"
                value={formAntigua.numero}
                onChange={(e) => setFormAntigua({ ...formAntigua, numero: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Entidad Solicitante</label>
              <input
                type="text"
                required
                placeholder="Ej. SUPERINTENDENCIA NACIONAL DE SALUD"
                value={formAntigua.entidad}
                onChange={(e) => setFormAntigua({ ...formAntigua, entidad: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de la Cotización</label>
              <input
                type="date"
                value={formAntigua.fecha}
                onChange={(e) => setFormAntigua({ ...formAntigua, fecha: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Objeto / Descripción del Servicio</label>
            <textarea
              required
              rows={3}
              placeholder="Descripción del trabajo ofertado..."
              value={formAntigua.objetoServicio}
              onChange={(e) => setFormAntigua({ ...formAntigua, objetoServicio: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Monto Total Ofertado (S/ con IGV)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ej. 17000.00"
              value={formAntigua.montoTotal}
              onChange={(e) => setFormAntigua({ ...formAntigua, montoTotal: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">PDF de la Cotización Escaneada (Opcional)</span>
              <span className="text-[11px] text-slate-500">
                {formAntigua.pdfUrl ? '✓ Archivo adjuntado' : 'Selecciona el PDF desde tu computadora'}
              </span>
            </div>
            <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{formAntigua.pdfUrl ? 'Cambiar PDF' : 'Seleccionar Archivo'}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const uploadData = new FormData();
                    uploadData.append('file', file);
                    uploadData.append('folder', 'cotizaciones');
                    const res = await fetch('/api/upload', {
                      method: 'POST',
                      body: uploadData,
                    });
                    const resData = await res.json();
                    if (resData.success) {
                      setFormAntigua((prev) => ({ ...prev, pdfUrl: resData.url }));
                      alert(`Archivo "${file.name}" cargado exitosamente.`);
                    } else {
                      alert('Error: ' + resData.error);
                    }
                  } catch (err) {
                    alert('Error al subir archivo');
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalAntiguaOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 cursor-pointer"
            >
              Guardar Cotización
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
