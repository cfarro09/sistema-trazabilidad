'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Plus,
  History,
  Search,
  Building,
  Filter,
  ArrowUpDown,
  FileText,
  FileCheck2,
  ExternalLink,
  Upload,
} from 'lucide-react';
import StageBadge from '@/components/StageBadge';
import Modal from '@/components/Modal';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('ALL');
  const [selectedEstado, setSelectedEstado] = useState('ALL');
  const [verHistoricos, setVerHistoricos] = useState('ALL');

  // Modales
  const [modalCotizacionOpen, setModalCotizacionOpen] = useState(false);
  const [modalHistoricoOpen, setModalHistoricoOpen] = useState(false);

  // Form states
  const [formCotizacion, setFormCotizacion] = useState({
    empresaId: '',
    entidad: '',
    unidadEjecutora: '',
    nroCotizacion: '',
    objetoContratacion: '',
    descripcionDetallada: '',
    rubro: 'PINTURA Y ACABADOS',
    montoTotal: '',
    plazoEjecucionDias: '10',
  });

  const [formHistorico, setFormHistorico] = useState({
    empresaId: '',
    entidad: '',
    unidadEjecutora: '',
    nroOrdenServicio: '',
    nroSiaf: '',
    nroFactura: '',
    fechaOrden: '',
    objetoContratacion: '',
    descripcionDetallada: '',
    rubro: 'PINTURA Y ACABADOS',
    montoTotal: '',
  });

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedEmpresa !== 'ALL') params.append('empresaId', selectedEmpresa);
      if (selectedEstado !== 'ALL') params.append('estado', selectedEstado);
      if (verHistoricos !== 'ALL') params.append('esHistorico', verHistoricos);
      if (search) params.append('search', search);

      const res = await fetch(`/api/servicios?${params.toString()}`);
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
    fetch('/api/empresas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmpresas(data.data);
          if (data.data.length > 0) {
            setFormCotizacion((prev) => ({ ...prev, empresaId: data.data[0].id }));
            setFormHistorico((prev) => ({ ...prev, empresaId: data.data[0].id }));
          }
        }
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchServicios();
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, selectedEmpresa, selectedEstado, verHistoricos]);

  const handleCreateCotizacion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formCotizacion,
          estado: 'COTIZACION',
          esHistorico: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalCotizacionOpen(false);
        fetchServicios();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateHistorico = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formHistorico,
          estado: 'PAGADO',
          esHistorico: true,
          montoFacturado: formHistorico.montoTotal,
          montoPagado: formHistorico.montoTotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalHistoricoOpen(false);
        fetchServicios();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-blue-600" />
            Trazabilidad de Contrataciones & Órdenes
          </h1>
          <p className="text-sm text-slate-500">
            Registro, control documental por etapas (TDR $\rightarrow$ SIAF $\rightarrow$ Factura) y
            archivo histórico.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalHistoricoOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <History className="w-4 h-4 text-amber-400" />
            Carga Rápida Histórica (15 años)
          </button>

          <button
            onClick={() => setModalCotizacionOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Cotización
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Búsqueda por Texto Libre */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por N° SIAF, Orden, Entidad, Objeto o palabra clave (ej. pintura)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro Empresa */}
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

          {/* Filtro Tipo Histórico / En curso */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={verHistoricos}
              onChange={(e) => setVerHistoricos(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">📋 Todas (En curso + Históricas)</option>
              <option value="false">🚀 Solo Servicios en curso / Nuevos</option>
              <option value="true">🏛️ Solo Archivo Histórico (15 años)</option>
            </select>
          </div>
        </div>

        {/* Badges de Estados */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Estado:</span>
          {[
            { key: 'ALL', label: 'Todos' },
            { key: 'COTIZACION', label: 'Cotizaciones' },
            { key: 'ACEPTADO_ORDEN', label: 'Con Orden / SIAF' },
            { key: 'EN_EJECUCION', label: 'En Ejecución' },
            { key: 'CONFORME', label: 'Conformes' },
            { key: 'FACTURADO', label: 'Facturados' },
            { key: 'PAGADO', label: 'Pagados' },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setSelectedEstado(st.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
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

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Código / SIAF</th>
                <th className="px-5 py-3">Empresa</th>
                <th className="px-5 py-3">Entidad Pública</th>
                <th className="px-5 py-3">Objeto y Descripción del Servicio</th>
                <th className="px-5 py-3 text-right">Monto Total</th>
                <th className="px-5 py-3 text-center">Estado</th>
                <th className="px-5 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Cargando servicios y órdenes...
                  </td>
                </tr>
              ) : servicios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <p className="font-semibold">No se encontraron servicios con los filtros aplicados.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Intenta con otra palabra clave o agrega una nueva cotización.
                    </p>
                  </td>
                </tr>
              ) : (
                servicios.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{s.nroOrdenServicio ? `O/S: ${s.nroOrdenServicio}` : s.codigoInterno}</span>
                        {s.esHistorico && (
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded">
                            Histórico
                          </span>
                        )}
                      </div>
                      {s.nroSiaf && (
                        <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
                          Exp. SIAF: {s.nroSiaf}
                        </div>
                      )}
                      {s.fechaOrden && (
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {new Date(s.fechaOrden).toLocaleDateString('es-PE')}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">
                        {s.empresa?.nombreComercial || s.empresa?.razonSocial}
                      </div>
                      <div className="text-[10px] text-slate-400">RUC: {s.empresa?.ruc}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700 max-w-xs truncate">
                      {s.entidad}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-md">
                      <div className="font-medium text-slate-900 line-clamp-1">
                        {s.objetoContratacion}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {s.descripcionDetallada}
                      </div>
                      {s.rubro && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          {s.rubro}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right font-black text-slate-900 whitespace-nowrap">
                      <div>S/ {s.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
                      {s.montoSinIgv && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          Sin IGV: S/ {s.montoSinIgv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <StageBadge status={s.estado} />
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <Link
                        href={`/servicios/${s.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        Ver Trazabilidad
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nueva Cotización */}
      <Modal
        isOpen={modalCotizacionOpen}
        onClose={() => setModalCotizacionOpen(false)}
        title="Registrar Nueva Cotización (Punto de Partida)"
        subtitle="Inicia la trazabilidad asignando código interno antes de recibir la orden de servicio"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateCotizacion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Empresa Postulante</label>
              <select
                required
                value={formCotizacion.empresaId}
                onChange={(e) => setFormCotizacion({ ...formCotizacion, empresaId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.razonSocial}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">N° de Cotización</label>
              <input
                type="text"
                placeholder="Ej. 00175-26"
                value={formCotizacion.nroCotizacion}
                onChange={(e) =>
                  setFormCotizacion({ ...formCotizacion, nroCotizacion: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Entidad Pública</label>
              <input
                type="text"
                required
                placeholder="Ej. SUPERINTENDENCIA NACIONAL DE SALUD (SUSALUD)"
                value={formCotizacion.entidad}
                onChange={(e) => setFormCotizacion({ ...formCotizacion, entidad: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rubro / Especialidad</label>
              <select
                value={formCotizacion.rubro}
                onChange={(e) => setFormCotizacion({ ...formCotizacion, rubro: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="PINTURA Y ACABADOS">PINTURA Y ACABADOS</option>
                <option value="ESTRUCTURAS METÁLICAS Y PINTURA">ESTRUCTURAS METÁLICAS</option>
                <option value="ALFOMBRAS Y ACONDICIONAMIENTO">ALFOMBRAS Y PISOS</option>
                <option value="INSTALACIONES ELÉCTRICAS">INSTALACIONES ELÉCTRICAS</option>
                <option value="MANTENIMIENTO INTEGRAL">MANTENIMIENTO INTEGRAL</option>
                <option value="ALBAÑILERÍA Y DRYWALL">ALBAÑILERÍA Y DRYWALL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre / Objeto de la Contratación
            </label>
            <input
              type="text"
              required
              placeholder="Ej. SERVICIO DE PINTADO DE OFICINAS DE ALTA DIRECCIÓN..."
              value={formCotizacion.objetoContratacion}
              onChange={(e) =>
                setFormCotizacion({ ...formCotizacion, objetoContratacion: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Descripción Detallada del Servicio (Clave para búsquedas futuras de experiencia)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detalle todas las partidas y palabras clave: resane, lijado, pintura látex satinado, metros cuadrados, esmalte, etc."
              value={formCotizacion.descripcionDetallada}
              onChange={(e) =>
                setFormCotizacion({ ...formCotizacion, descripcionDetallada: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monto Total Ofertado (S/ con IGV)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ej. 17000.00"
                value={formCotizacion.montoTotal}
                onChange={(e) => setFormCotizacion({ ...formCotizacion, montoTotal: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plazo de Ejecución (Días)</label>
              <input
                type="number"
                value={formCotizacion.plazoEjecucionDias}
                onChange={(e) =>
                  setFormCotizacion({ ...formCotizacion, plazoEjecucionDias: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalCotizacionOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
            >
              Guardar Cotización
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Carga Rápida Histórica (15 años) */}
      <Modal
        isOpen={modalHistoricoOpen}
        onClose={() => setModalHistoricoOpen(false)}
        title="📥 Carga Rápida de Servicio Histórico (15 años de antigüedad)"
        subtitle="Registra servicios antiguos directamente con N° de Orden, SIAF, Factura y Montos para acreditar experiencia"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateHistorico} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Empresa</label>
              <select
                required
                value={formHistorico.empresaId}
                onChange={(e) => setFormHistorico({ ...formHistorico, empresaId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.razonSocial}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Entidad Contratante</label>
              <input
                type="text"
                required
                placeholder="Ej. UGEL 06 VITARTE / DIRTEPOL PNP"
                value={formHistorico.entidad}
                onChange={(e) => setFormHistorico({ ...formHistorico, entidad: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">N° Orden de Servicio</label>
              <input
                type="text"
                placeholder="Ej. 0000827"
                value={formHistorico.nroOrdenServicio}
                onChange={(e) =>
                  setFormHistorico({ ...formHistorico, nroOrdenServicio: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">N° Expediente SIAF</label>
              <input
                type="text"
                placeholder="Ej. 1333"
                value={formHistorico.nroSiaf}
                onChange={(e) => setFormHistorico({ ...formHistorico, nroSiaf: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">N° Factura Emitida</label>
              <input
                type="text"
                placeholder="Ej. 001-002114"
                value={formHistorico.nroFactura}
                onChange={(e) =>
                  setFormHistorico({ ...formHistorico, nroFactura: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha del Servicio</label>
              <input
                type="date"
                value={formHistorico.fechaOrden}
                onChange={(e) => setFormHistorico({ ...formHistorico, fechaOrden: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rubro Principal</label>
              <select
                value={formHistorico.rubro}
                onChange={(e) => setFormHistorico({ ...formHistorico, rubro: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="PINTURA Y ACABADOS">PINTURA Y ACABADOS</option>
                <option value="ESTRUCTURAS METÁLICAS Y PINTURA">ESTRUCTURAS METÁLICAS</option>
                <option value="ALFOMBRAS Y ACONDICIONAMIENTO">ALFOMBRAS Y PISOS</option>
                <option value="INSTALACIONES ELÉCTRICAS">INSTALACIONES ELÉCTRICAS</option>
                <option value="MANTENIMIENTO INTEGRAL">MANTENIMIENTO INTEGRAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monto Total (S/)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ej. 31000.00"
                value={formHistorico.montoTotal}
                onChange={(e) => setFormHistorico({ ...formHistorico, montoTotal: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Descripción Detallada del Servicio (Palabras clave para el buscador de experiencia)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ej. Mantenimiento y pintado en áreas administrativas, resane de muros, aplicación de dos manos de látex satinado en interiores y fachada..."
              value={formHistorico.descripcionDetallada}
              onChange={(e) =>
                setFormHistorico({ ...formHistorico, descripcionDetallada: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalHistoricoOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
            >
              Guardar Histórico
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
