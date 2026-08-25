'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileSpreadsheet,
  Building2,
  Calendar,
  DollarSign,
  FileCheck2,
  Upload,
  Download,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Receipt,
  Landmark,
  Save,
} from 'lucide-react';
import StageBadge from '@/components/StageBadge';

export default function ServicioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [servicio, setServicio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for updates
  const [formData, setFormData] = useState({
    nroOrdenServicio: '',
    nroSiaf: '',
    fechaOrden: '',
    plazoEjecucionDias: '',
    fechaInforme: '',
    nroConformidad: '',
    fechaConformidad: '',
    nroFactura: '',
    fechaFactura: '',
    montoFacturado: '',
    fechaPago: '',
    nroOperacion: '',
    montoPagado: '',
    estado: '',
    tdrPdf: '',
    cotizacionPdf: '',
    ordenServicioPdf: '',
    informePdf: '',
    conformidadPdf: '',
    facturaPdf: '',
    pagoPdf: '',
    detraccionPdf: '',
  });

  const fetchServicio = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/servicios/${id}`);
      const data = await res.json();
      if (data.success) {
        setServicio(data.data);
        setFormData({
          nroOrdenServicio: data.data.nroOrdenServicio || '',
          nroSiaf: data.data.nroSiaf || '',
          fechaOrden: data.data.fechaOrden ? data.data.fechaOrden.substring(0, 10) : '',
          plazoEjecucionDias: data.data.plazoEjecucionDias ? String(data.data.plazoEjecucionDias) : '',
          fechaInforme: data.data.fechaInforme ? data.data.fechaInforme.substring(0, 10) : '',
          nroConformidad: data.data.nroConformidad || '',
          fechaConformidad: data.data.fechaConformidad ? data.data.fechaConformidad.substring(0, 10) : '',
          nroFactura: data.data.nroFactura || '',
          fechaFactura: data.data.fechaFactura ? data.data.fechaFactura.substring(0, 10) : '',
          montoFacturado: data.data.montoFacturado ? String(data.data.montoFacturado) : '',
          fechaPago: data.data.fechaPago ? data.data.fechaPago.substring(0, 10) : '',
          nroOperacion: data.data.nroOperacion || '',
          montoPagado: data.data.montoPagado ? String(data.data.montoPagado) : '',
          estado: data.data.estado || 'COTIZACION',
          tdrPdf: data.data.tdrPdf || '',
          cotizacionPdf: data.data.cotizacionPdf || '',
          ordenServicioPdf: data.data.ordenServicioPdf || '',
          informePdf: data.data.informePdf || '',
          conformidadPdf: data.data.conformidadPdf || '',
          facturaPdf: data.data.facturaPdf || '',
          pagoPdf: data.data.pagoPdf || '',
          detraccionPdf: data.data.detraccionPdf || '',
        });

        // Set default active tab based on status
        if (data.data.estado === 'COTIZACION') setActiveTab(2);
        else if (data.data.estado === 'ACEPTADO_ORDEN') setActiveTab(4);
        else if (data.data.estado === 'EN_EJECUCION') setActiveTab(5);
        else if (data.data.estado === 'CONFORME') setActiveTab(6);
        else if (data.data.estado === 'FACTURADO') setActiveTab(7);
        else if (data.data.estado === 'PAGADO') setActiveTab(8);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicio();
  }, [id]);

  const handleSave = async (newState?: string) => {
    setSaving(true);
    try {
      const payload: any = { ...formData };
      if (newState) {
        payload.estado = newState;
        setFormData((prev) => ({ ...prev, estado: newState }));
      }

      const res = await fetch(`/api/servicios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setServicio(data.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSimulateUpload = (field: string, defaultName: string) => {
    const dummyUrl = `/uploads/${defaultName}`;
    setFormData((prev) => ({ ...prev, [field]: dummyUrl }));
    alert(`Documento "${defaultName}" adjuntado al expediente.`);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 max-w-7xl mx-auto">
        Cargando trazabilidad del servicio...
      </div>
    );
  }

  if (!servicio) {
    return (
      <div className="p-12 text-center text-rose-500 max-w-7xl mx-auto">
        Servicio no encontrado.{' '}
        <Link href="/servicios" className="underline font-bold">
          Volver al listado
        </Link>
      </div>
    );
  }

  const statusLevels: { [key: string]: number } = {
    COTIZACION: 2,
    ACEPTADO_ORDEN: 4,
    EN_EJECUCION: 5,
    CONFORME: 6,
    FACTURADO: 7,
    PAGADO: 8,
  };
  const currentLevel = statusLevels[servicio.estado] || 2;

  const stages = [
    { id: 1, key: 'tdr', name: '1. Convocatoria', sub: 'TDRs', completed: true },
    { id: 2, key: 'cotizacion', name: '2. Cotización', sub: 'Código Interno', completed: true },
    { id: 3, key: 'expediente', name: '3. Expediente', sub: 'Preparación Docs', completed: currentLevel >= 3 || Boolean(servicio.expedientePostulacionPdf || servicio.nroOrdenServicio) },
    { id: 4, key: 'orden', name: '4. Orden de Servicio', sub: 'O/S y SIAF', completed: currentLevel >= 4 || Boolean(servicio.nroOrdenServicio && servicio.nroSiaf) },
    { id: 5, key: 'informe', name: '5. Informe', sub: 'Entregable Final', completed: currentLevel >= 5 || Boolean(servicio.fechaInforme || servicio.informePdf) },
    { id: 6, key: 'conformidad', name: '6. Conformidad', sub: 'Acta de Entidad', completed: currentLevel >= 6 || Boolean(servicio.nroConformidad || servicio.fechaConformidad) },
    { id: 7, key: 'factura', name: '7. Facturación', sub: 'Factura Electrónica', completed: currentLevel >= 7 || Boolean(servicio.nroFactura) },
    { id: 8, key: 'pago', name: '8. Pago SIAF', sub: 'Detracción & Cobro', completed: currentLevel >= 8 || Boolean(servicio.fechaPago || servicio.nroOperacion) },
  ];

  const handleMarcarHastaFacturacion = async () => {
    const updatedData = {
      nroOrdenServicio: formData.nroOrdenServicio || '0000701',
      nroSiaf: formData.nroSiaf || '0000001761',
      fechaOrden: formData.fechaOrden || '2026-08-17',
      plazoEjecucionDias: formData.plazoEjecucionDias || '10',
      fechaInforme: formData.fechaInforme || '2026-08-25',
      informePdf: formData.informePdf || '/uploads/Informe_Final.pdf',
      nroConformidad: formData.nroConformidad || 'ACTA-CONF-2026-701',
      fechaConformidad: formData.fechaConformidad || '2026-08-26',
      conformidadPdf: formData.conformidadPdf || '/uploads/Acta_Conformidad.pdf',
      nroFactura: formData.nroFactura || 'E001-000155',
      fechaFactura: formData.fechaFactura || '2026-08-26',
      montoFacturado: formData.montoFacturado || String(servicio.montoTotal || 17000),
      facturaPdf: formData.facturaPdf || '/uploads/Factura_Electronica.pdf',
      estado: 'FACTURADO',
    };
    setFormData((prev) => ({ ...prev, ...updatedData }));
    setSaving(true);
    try {
      const res = await fetch(`/api/servicios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) {
        setServicio(data.data);
        setActiveTab(7);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista de Servicios
        </Link>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle className="w-4 h-4" /> Cambios guardados
            </span>
          )}

          {servicio.estado !== 'FACTURADO' && servicio.estado !== 'PAGADO' && (
            <button
              onClick={handleMarcarHastaFacturacion}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Poner en verde hasta Facturación
            </button>
          )}

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Datos'}
          </button>
        </div>
      </div>

      {/* Main Service Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold">
                {servicio.codigoInterno}
              </span>
              {servicio.nroOrdenServicio && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold font-mono">
                  ORDEN DE SERVICIO N° {servicio.nroOrdenServicio}
                </span>
              )}
              {servicio.nroSiaf && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold font-mono">
                  EXPEDIENTE SIAF: {servicio.nroSiaf}
                </span>
              )}
              <StageBadge status={servicio.estado} size="md" />
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {servicio.objetoContratacion}
            </h1>

            <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
              {servicio.descripcionDetallada}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Empresa Contratista</span>
                <span className="font-bold text-slate-800">{servicio.empresa?.razonSocial}</span>
                <span className="text-slate-400 block">RUC: {servicio.empresa?.ruc}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Entidad Pública</span>
                <span className="font-bold text-slate-800">{servicio.entidad}</span>
                {servicio.unidadEjecutora && (
                  <span className="text-slate-400 block">UE: {servicio.unidadEjecutora}</span>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Rubro Acreditado</span>
                <span className="font-bold text-indigo-600 uppercase">{servicio.rubro || 'SERVICIOS GENERALES'}</span>
              </div>
            </div>
          </div>

          {/* Card Monto */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shrink-0 min-w-[240px] text-right space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Monto Total Contratado
            </span>
            <div className="text-2xl font-black text-emerald-400">
              S/ {servicio.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-300 font-normal">
              Sin IGV: S/ {servicio.montoSinIgv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
              IGV (18%): S/ {servicio.montoIgv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Stepper de 8 Hitos Documentales */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stages.map((stage) => {
            const isSelected = activeTab === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveTab(stage.id)}
                className={`p-3 rounded-xl text-left border transition-all relative ${
                  stage.completed
                    ? isSelected
                      ? 'border-emerald-600 bg-emerald-100 shadow-sm ring-2 ring-emerald-500/30'
                      : 'border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/80'
                    : isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center ${
                      stage.completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {stage.completed ? '✓' : stage.id}
                  </span>
                  {stage.completed && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Listo
                    </span>
                  )}
                </div>
                <div
                  className={`text-xs font-bold truncate ${
                    stage.completed ? 'text-emerald-950' : isSelected ? 'text-blue-900' : 'text-slate-800'
                  }`}
                >
                  {stage.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{stage.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle del Hito Seleccionado */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* HITO 1: Convocatoria */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">1. Convocatoria / Invitación (Términos de Referencia)</h3>
              <p className="text-xs text-slate-500">Documento base donde la entidad solicita la cotización técnica y económica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Entidad Convocante:</span>
                  <span className="text-slate-900">{servicio.entidad}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Objeto del Requerimiento:</span>
                  <span className="text-slate-900">{servicio.objetoContratacion}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Rubro de Postulación:</span>
                  <span className="text-slate-900 font-semibold">{servicio.rubro}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">PDF de Términos de Referencia (TDR)</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSimulateUpload('tdrPdf', 'TDR_SUSALUD_Alfombras.pdf')}
                    className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    Subir TDR (PDF)
                  </button>
                  {formData.tdrPdf && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      ✓ TDR adjuntado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HITO 2: Cotización */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">2. Cotización y Propuesta Económica</h3>
              <p className="text-xs text-slate-500">Manejo del código único interno hasta recibir la orden de servicio</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">N° de Cotización</label>
                <input
                  type="text"
                  value={formData.nroOrdenServicio ? servicio.nroCotizacion || servicio.codigoInterno : formData.nroOrdenServicio}
                  placeholder="Ej. 00175-26"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monto Ofertado (Con IGV)</label>
                <input
                  type="text"
                  value={`S/ ${servicio.montoTotal.toFixed(2)}`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Código Interno</label>
                <input
                  type="text"
                  value={servicio.codigoInterno}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  readOnly
                />
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-amber-900">¿La entidad aprobó la cotización?</h4>
                <p className="text-[11px] text-amber-700">
                  Al recibir la Orden de Servicio, avanza de fase para registrar el N° de Orden y N° SIAF.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab(4);
                  handleSave('ACEPTADO_ORDEN');
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Cotización Aceptada $\rightarrow$ Registrar O/S
              </button>
            </div>
          </div>
        )}

        {/* HITO 3: Preparación de Documentación */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">3. Preparación de Documentación (Expediente de Postulación)</h3>
              <p className="text-xs text-slate-500">Empaqueta RNP, Ficha RUC, Declaraciones Juradas, CCI y Técnicos en un solo PDF foliado</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Generador de Expediente Integrado</h4>
                <p className="text-xs text-slate-500">
                  Usa nuestro compilador de PDF con foliación automática para armar el paquete de postulación.
                </p>
              </div>
              <Link
                href="/empaquetador"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30"
              >
                Ir al Empaquetador de Expedientes $\rightarrow$
              </Link>
            </div>
          </div>
        )}

        {/* HITO 4: Orden de Servicio & SIAF */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">4. Orden de Servicio & Expediente SIAF</h3>
                <p className="text-xs text-slate-500">Identificadores oficiales de la contratación pública en Perú</p>
              </div>
              {formData.nroOrdenServicio && formData.nroSiaf && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl">
                  ✓ Orden Registrada
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">N° Orden de Servicio</label>
                <input
                  type="text"
                  placeholder="Ej. 0000701"
                  value={formData.nroOrdenServicio}
                  onChange={(e) => setFormData({ ...formData, nroOrdenServicio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">N° Expediente SIAF</label>
                <input
                  type="text"
                  placeholder="Ej. 0000001761"
                  value={formData.nroSiaf}
                  onChange={(e) => setFormData({ ...formData, nroSiaf: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Notificación / Emisión</label>
                <input
                  type="date"
                  value={formData.fechaOrden}
                  onChange={(e) => setFormData({ ...formData, fechaOrden: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plazo de Ejecución (Días)</label>
                <input
                  type="number"
                  placeholder="Ej. 10"
                  value={formData.plazoEjecucionDias}
                  onChange={(e) => setFormData({ ...formData, plazoEjecucionDias: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">PDF Oficial de la Orden de Servicio (SIGA / OSCE)</span>
                <span className="text-[11px] text-slate-500">Documento sellado por la Oficina de Logística</span>
              </div>
              <button
                onClick={() => handleSimulateUpload('ordenServicioPdf', 'Orden_Servicio_0000701_SUSALUD.pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                <Upload className="w-4 h-4" />
                Subir O/S (PDF)
              </button>
            </div>
          </div>
        )}

        {/* HITO 5: Informe del Contratista */}
        {activeTab === 5 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">5. Informe Técnico Final del Servicio</h3>
              <p className="text-xs text-slate-500">Entregable con registro fotográfico, metrados y garantías</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Presentación a Mesa de Partes</label>
                <input
                  type="date"
                  value={formData.fechaInforme}
                  onChange={(e) => setFormData({ ...formData, fechaInforme: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Informe Final + Panel Fotográfico</span>
                  <span className="text-[11px] text-slate-500">PDF con sustento de actividades ejecutadas</span>
                </div>
                <button
                  onClick={() => handleSimulateUpload('informePdf', 'Informe_Final_Servicio.pdf')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                >
                  <Upload className="w-4 h-4" />
                  Subir Informe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HITO 6: Conformidad de la Entidad */}
        {activeTab === 6 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">6. Acta de Conformidad de la Prestación</h3>
              <p className="text-xs text-slate-500">Emitida por el área usuaria / Jefe de Logística de la entidad</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">N° de Acta / Constancia de Conformidad</label>
                <input
                  type="text"
                  placeholder="Ej. ACTA-CONF-2026-701 o Constancia 012-2026"
                  value={formData.nroConformidad}
                  onChange={(e) => setFormData({ ...formData, nroConformidad: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Emisión de Conformidad</label>
                <input
                  type="date"
                  value={formData.fechaConformidad}
                  onChange={(e) => setFormData({ ...formData, fechaConformidad: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">PDF del Acta de Conformidad Firmada</span>
                <span className="text-[11px] text-emerald-700">Documento obligatorio para emitir la factura</span>
              </div>
              <button
                onClick={() => handleSimulateUpload('conformidadPdf', 'Acta_Conformidad_Firmada.pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <Upload className="w-4 h-4" />
                Subir Acta Conformidad
              </button>
            </div>
          </div>
        )}

        {/* HITO 7: Facturación */}
        {activeTab === 7 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">7. Facturación Electrónica</h3>
              <p className="text-xs text-slate-500">Emisión del comprobante de pago electrónico tras la conformidad</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">N° de Factura Electrónica</label>
                <input
                  type="text"
                  placeholder="Ej. E001-150"
                  value={formData.nroFactura}
                  onChange={(e) => setFormData({ ...formData, nroFactura: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Emisión de Factura</label>
                <input
                  type="date"
                  value={formData.fechaFactura}
                  onChange={(e) => setFormData({ ...formData, fechaFactura: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monto Facturado (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={String(servicio.montoTotal)}
                  value={formData.montoFacturado}
                  onChange={(e) => setFormData({ ...formData, montoFacturado: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-teal-900 block">PDF / XML de Factura Electrónica SUNAT</span>
                <span className="text-[11px] text-teal-700">Evidencia para acreditar experiencia en licitaciones</span>
              </div>
              <button
                onClick={() => handleSimulateUpload('facturaPdf', 'Factura_E001_150_SUNAT.pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <Upload className="w-4 h-4" />
                Subir Factura (PDF)
              </button>
            </div>
          </div>
        )}

        {/* HITO 8: Pago & Conformidad de Pago */}
        {activeTab === 8 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">8. Conformidad de Pago & Expediente SIAF Pagado</h3>
              <p className="text-xs text-slate-500">Cierre del ciclo: abono en CCI, constancia de detracción y reporte SIAF</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Abono / Pago</label>
                <input
                  type="date"
                  value={formData.fechaPago}
                  onChange={(e) => setFormData({ ...formData, fechaPago: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">N° Operación / Constancia Detracción</label>
                <input
                  type="text"
                  placeholder="Ej. 284329542"
                  value={formData.nroOperacion}
                  onChange={(e) => setFormData({ ...formData, nroOperacion: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monto Pagado / Cobrado (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={String(servicio.montoTotal)}
                  value={formData.montoPagado}
                  onChange={(e) => setFormData({ ...formData, montoPagado: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-green-700 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Constancia Detracción SUNAT</span>
                  <span className="text-[11px] text-slate-500">Depósito en Banco de la Nación</span>
                </div>
                <button
                  onClick={() => handleSimulateUpload('detraccionPdf', 'Constancia_Detraccion.pdf')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Subir
                </button>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-green-900 block">Reporte de Consulta SIAF Pagado</span>
                  <span className="text-[11px] text-green-700">Estado "Giré / Pagado"</span>
                </div>
                <button
                  onClick={() => handleSimulateUpload('pagoPdf', 'Consulta_SIAF_Pagado.pdf')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Subir
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleSave('PAGADO')}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs shadow-md shadow-green-600/30 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar Servicio como 100% Pagado y Concluido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
