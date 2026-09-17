'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Download,
  FileCheck,
  Building2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  FileSpreadsheet,
  Edit3,
  Sparkles,
  RotateCcw,
  Trash2,
  Copy,
} from 'lucide-react';
import Modal from '@/components/Modal';
import DuplicateQuoteModal from '@/components/DuplicateQuoteModal';

export default function CotizacionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Modal para duplicar cotización
  const [modalDuplicateOpen, setModalDuplicateOpen] = useState(false);

  // Modal para editar número de cotización
  const [modalEditNumeroOpen, setModalEditNumeroOpen] = useState(false);
  const [editNumeroVal, setEditNumeroVal] = useState('');
  const [savingNumero, setSavingNumero] = useState(false);
  const [loadingAutoNumero, setLoadingAutoNumero] = useState(false);
  const [errorNumero, setErrorNumero] = useState('');

  const handleDeleteQuote = async () => {
    if (!confirm(`¿Estás seguro de eliminar esta cotización (${quote?.numero})? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/cotizaciones/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Cotización eliminada correctamente');
        router.push('/cotizaciones');
      } else {
        alert('Error al eliminar: ' + (data.error || 'No se pudo eliminar'));
      }
    } catch (e: any) {
      alert('Error de conexión: ' + e.message);
    }
  };

  useEffect(() => {
    fetch(`/api/cotizaciones/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setQuote(data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleOpenEditNumero = () => {
    setEditNumeroVal(quote?.numero || '');
    setErrorNumero('');
    setModalEditNumeroOpen(true);
  };

  const handleSugerirAuto = async () => {
    setLoadingAutoNumero(true);
    try {
      const f = quote?.fecha || new Date().toISOString().substring(0, 10);
      const res = await fetch(`/api/cotizaciones/correlativo?fecha=${f}`);
      const data = await res.json();
      if (data.success && data.data?.numero) {
        setEditNumeroVal(data.data.numero);
      }
    } catch (e) {
      console.error('Error al generar correlativo automático:', e);
    } finally {
      setLoadingAutoNumero(false);
    }
  };

  const handleSaveNumero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNumeroVal.trim()) return;
    setSavingNumero(true);
    setErrorNumero('');
    try {
      const res = await fetch(`/api/cotizaciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero: editNumeroVal.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setQuote((prev: any) => ({ ...prev, numero: editNumeroVal.trim() }));
        setModalEditNumeroOpen(false);
      } else {
        setErrorNumero(data.error || 'No se pudo actualizar el número de cotización');
      }
    } catch (err: any) {
      setErrorNumero(err.message || 'Error al conectar con el servidor');
    } finally {
      setSavingNumero(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!quote) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/cotizaciones/${id}/pdf`);
      if (!res.ok) throw new Error('Error al generar PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanNum = quote.numero.replace(/[^a-zA-Z0-9-_]/g, '_');
      a.download = `Cotizacion_${cleanNum}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Hubo un problema al descargar el PDF. Puedes usar el botón de Imprimir.');
    } finally {
      setDownloading(false);
    }
  };

  const handleConvertir = async () => {
    if (!confirm('¿Deseas convertir esta cotización en una Orden de Servicio activa en Trazabilidad?')) {
      return;
    }
    setConverting(true);
    try {
      const res = await fetch(`/api/cotizaciones/${id}/convertir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        router.push(`/servicios/${data.data.servicioId}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Cargando cotización...</div>;
  }

  if (!quote) {
    return (
      <div className="p-12 text-center text-rose-500">
        Cotización no encontrada.{' '}
        <Link href="/cotizaciones" className="underline font-bold">
          Volver a Cotizaciones
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Action Toolbar (Hidden when printing) */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/cotizaciones"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado de Cotizaciones
        </Link>

        <div className="flex items-center gap-3">
          {/* Botón Editar Toda la Cotización */}
          {quote.estado !== 'ACEPTADA' && (
            <Link
              href={`/cotizaciones/nueva?edit=${quote.id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              title="Editar toda la cotización (partidas, precios y condiciones)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Cotización
            </Link>
          )}

          {/* Botón Duplicar Cotización */}
          <button
            onClick={() => setModalDuplicateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            title="Duplicar cotización para cotizar con tus otras empresas"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicar Cotización
          </button>

          {/* Botón Editar N° */}
          <button
            onClick={handleOpenEditNumero}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all cursor-pointer shadow-xs"
            title="Editar número o correlativo de la cotización"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            Editar N°
          </button>

          {/* Botón Descargar PDF Real */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            title="Descargar archivo PDF oficial en hoja A4"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generando PDF...' : 'Descargar PDF (Hoja Oficial)'}
          </button>

          {/* Botón Imprimir */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            title="Imprimir vista oficial"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>

          {/* Botón Eliminar Cotización */}
          {quote.estado !== 'ACEPTADA' && (
            <button
              onClick={handleDeleteQuote}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-xs border border-rose-200 transition-all cursor-pointer shadow-xs"
              title="Eliminar esta cotización permanentemente"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </button>
          )}

          {quote.estado !== 'ACEPTADA' ? (
            <button
              onClick={handleConvertir}
              disabled={converting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              {converting ? 'Convirtiendo...' : 'Convertir a Orden de Servicio'}
            </button>
          ) : (
            <Link
              href={quote.servicioId ? `/servicios/${quote.servicioId}` : '/servicios'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs hover:bg-blue-100 transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Ver en Trazabilidad
            </Link>
          )}
        </div>
      </div>

      {/* Official Printable Quotation Document (Exact match to PDF Page 1) */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200 text-slate-900 font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none">
        {/* Folio top-right */}
        <div className="text-right font-mono font-bold text-xs text-slate-400 mb-2 print:text-black">
          0001
        </div>

        {/* Encabezado con Logo y N° de Cotización */}
        <div className="flex items-start justify-between gap-6 border-b-2 border-slate-900 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-wider text-slate-900 uppercase">
              {quote.empresa?.nombreComercial || quote.empresa?.razonSocial}
            </h1>
            <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
              <div>{quote.empresa?.direccion}</div>
              <div>{quote.empresa?.email}</div>
              <div>Telf.: {quote.empresa?.telefono || '332-3455 / 983446851'}</div>
            </div>
          </div>

          {/* Red Box for Quote Number */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="bg-rose-700 text-white px-6 py-3 rounded-lg text-center font-bold tracking-wider shadow-sm min-w-[170px]">
              <div className="text-xs uppercase">Cotización</div>
              <div className="text-lg md:text-xl font-mono">{quote.numero}</div>
            </div>
            <button
              type="button"
              onClick={handleOpenEditNumero}
              className="print:hidden inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
              title="Editar número o correlativo de la cotización"
            >
              <Edit3 className="w-3.5 h-3.5 text-rose-600" />
              Editar N°
            </button>
          </div>
        </div>

        {/* Datos del Cliente / Objeto */}
        <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 print:bg-transparent print:border-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <span className="font-bold">Señores:</span>{' '}
              <span className="font-semibold uppercase">{quote.entidad}</span>
            </div>
            <div>
              <span className="font-bold">FECHA:</span>{' '}
              <span>{new Date(quote.fecha).toLocaleDateString('es-PE')}</span>
            </div>
          </div>

          <div>
            <span className="font-bold">Atención:</span> <span>{quote.atencion || 'Unidad de Logística'}</span>
          </div>

          <div>
            <span className="font-bold">OBRA / SERVICIO:</span>{' '}
            <span className="font-semibold uppercase leading-relaxed">{quote.objetoServicio}</span>
          </div>

          {quote.ubicacion && (
            <div>
              <span className="font-bold">UBICAC:</span> <span>{quote.ubicacion}</span>
            </div>
          )}
        </div>

        {/* Tabla Desagregada de Ítems / Partidas */}
        <div className="my-4 overflow-x-auto">
          <table className="w-full text-xs border border-slate-900 border-collapse">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-900 border-b border-slate-900 text-[10px] uppercase">
                <th className="p-2 border-r border-slate-900 w-12 text-center">ITEM</th>
                <th className="p-2 border-r border-slate-900 text-left">DESCRIPCION</th>
                <th className="p-2 border-r border-slate-900 w-16 text-center">UND</th>
                <th className="p-2 border-r border-slate-900 w-14 text-center">CANT.</th>
                <th className="p-2 border-r border-slate-900 w-24 text-right">P.UNIT</th>
                <th className="p-2 w-24 text-right">P. PARCIAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {quote.items?.map((it: any) => {
                if (it.esTitulo) {
                  return (
                    <tr key={it.id} className="bg-slate-200/80 font-black text-slate-900">
                      <td className="p-2 text-center border-r border-slate-900">{it.item}</td>
                      <td colSpan={5} className="p-2 tracking-wide uppercase">
                        {it.descripcion}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={it.id} className="text-slate-800">
                    <td className="p-2 text-center border-r border-slate-900 font-mono font-semibold">
                      {it.item}
                    </td>
                    <td className="p-2 border-r border-slate-900 leading-snug">
                      {it.descripcion}
                    </td>
                    <td className="p-2 text-center border-r border-slate-900">{it.unidad}</td>
                    <td className="p-2 text-center border-r border-slate-900">{it.cantidad}</td>
                    <td className="p-2 text-right border-r border-slate-900 font-mono">
                      S/ {it.precioUnitario.toFixed(2)}
                    </td>
                    <td className="p-2 text-right font-mono font-bold">
                      S/ {it.precioParcial.toFixed(2)}
                    </td>
                  </tr>
                );
              })}

              {/* Fila de Subtotales */}
              <tr className="border-t-2 border-slate-900 font-bold">
                <td colSpan={4} className="border-r border-slate-900"></td>
                <td className="p-2 text-right border-r border-slate-900 bg-slate-50 font-bold uppercase text-[10px]">
                  COSTO DIRECTO
                </td>
                <td className="p-2 text-right font-mono font-bold">
                  S/. {quote.montoCostoDirecto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="font-bold">
                <td colSpan={4} className="border-r border-slate-900"></td>
                <td className="p-2 text-right border-r border-slate-900 bg-slate-50 font-bold uppercase text-[10px]">
                  IGV (18%)
                </td>
                <td className="p-2 text-right font-mono font-bold">
                  S/. {quote.montoIgv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="font-black text-sm bg-slate-100 border-t border-slate-900">
                <td colSpan={4} className="border-r border-slate-900"></td>
                <td className="p-2 text-right border-r border-slate-900 uppercase text-[11px]">
                  TOTAL GENERAL
                </td>
                <td className="p-2 text-right font-mono">
                  S/. {quote.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Monto en Letras Bar */}
        <div className="p-2 bg-slate-100 font-bold text-center text-xs tracking-wider border border-slate-900 my-3 uppercase">
          {quote.montoLetras || 'SON: DIECISIETE MIL CON 00/100 SOLES'}
        </div>

        {/* Condiciones Comerciales & Firma (Bottom Box) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-slate-200">
          {/* Condiciones Box (Red outlined) */}
          <div className="bg-rose-50 border border-rose-300 p-4 rounded-xl text-xs space-y-1 text-slate-900">
            <div className="font-bold text-rose-900">R.U.C.: {quote.empresa?.ruc}</div>
            <div>
              <span className="font-bold">Validez de la oferta:</span> {quote.validezOferta}
            </div>
            <div>
              <span className="font-bold">Tiempo de Ejecución:</span> {quote.tiempoEjecucion}
            </div>
            <div>
              <span className="font-bold">Garantía:</span> {quote.garantia}
            </div>
            <div>
              <span className="font-bold">Forma de Pago:</span> {quote.formaPago}
            </div>
            <div>
              <span className="font-bold">LUGAR DE EJECUCION:</span> {quote.lugarEjecucion}
            </div>
          </div>

          {/* Firma */}
          <div className="flex flex-col items-center justify-end text-center p-4">
            <div className="w-52 border-b border-slate-900 pb-1 mb-2 font-bold text-xs uppercase">
              {quote.empresa?.nombreComercial || quote.empresa?.razonSocial}
            </div>
            <div className="font-bold text-xs">{quote.empresa?.representanteLegal}</div>
            <div className="text-[11px] text-slate-500">Gerente General</div>
          </div>
        </div>
      </div>

      {/* Modal Editar Número de Cotización */}
      <Modal
        isOpen={modalEditNumeroOpen}
        onClose={() => setModalEditNumeroOpen(false)}
        title="Editar N° de Cotización"
        subtitle="Modifica la numeración o asigna un formato antiguo / correlativo oficial"
        maxWidth="md"
      >
        <form onSubmit={handleSaveNumero} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Número de Cotización
              </label>
              <button
                type="button"
                onClick={handleSugerirAuto}
                disabled={loadingAutoNumero}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                title="Generar correlativo Año-Mes-N° según la fecha de esta cotización"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                {loadingAutoNumero ? 'Generando...' : '🪄 Sugerir Auto Año-Mes'}
              </button>
            </div>
            <input
              type="text"
              required
              value={editNumeroVal}
              onChange={(e) => setEditNumeroVal(e.target.value)}
              placeholder="Ej. COT-2026-09-001 o Nº 00175 - 26"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              💡 Puedes ingresar cualquier formato para cotizaciones antiguas (ej. <code>00175 - 26</code>, <code>N° 045-2023</code>) o utilizar el correlativo automático Año-Mes-N°.
            </p>
          </div>

          {errorNumero && (
            <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              {errorNumero}
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalEditNumeroOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingNumero || !editNumeroVal.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
            >
              {savingNumero ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Duplicar Cotización */}
      <DuplicateQuoteModal
        isOpen={modalDuplicateOpen}
        onClose={() => setModalDuplicateOpen(false)}
        quote={quote}
        onDuplicated={() => {
          fetch(`/api/cotizaciones/${id}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success) setQuote(data.data);
            });
        }}
      />
    </div>
  );
}
