'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  FileCheck,
  Building2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

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

  useEffect(() => {
    fetch(`/api/cotizaciones/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setQuote(data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
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
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF
          </button>

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
          <div className="bg-rose-700 text-white px-6 py-3 rounded-lg text-center font-bold tracking-wider shadow-sm shrink-0">
            <div className="text-xs uppercase">Cotización</div>
            <div className="text-lg md:text-xl font-mono">{quote.numero}</div>
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
    </div>
  );
}
