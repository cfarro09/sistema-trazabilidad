'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Calculator,
  Building2,
  FileSpreadsheet,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { numeroALetrasSoles } from '@/lib/number-to-letters';

interface ItemRow {
  id: string;
  item: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  precioParcial: number;
  esTitulo: boolean;
}

export default function NuevaCotizacionPage() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Form State
  const [empresaId, setEmpresaId] = useState('');
  const [numero, setNumero] = useState('');
  const [entidad, setEntidad] = useState('');
  const [atencion, setAtencion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().substring(0, 10));
  const [objetoServicio, setObjetoServicio] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  // Commercial Conditions
  const [validezOferta, setValidezOferta] = useState('30 días');
  const [tiempoEjecucion, setTiempoEjecucion] = useState('10 días calendarios');
  const [garantia, setGarantia] = useState('12 meses');
  const [formaPago, setFormaPago] = useState('Contado Comercial');
  const [lugarEjecucion, setLugarEjecucion] = useState('');

  // Table of Items (Starts clean)
  const [items, setItems] = useState<ItemRow[]>([
    {
      id: '1',
      item: '1.00',
      descripcion: 'TRABAJOS PRINCIPALES',
      unidad: 'Global',
      cantidad: 1,
      precioUnitario: 0,
      precioParcial: 0,
      esTitulo: true,
    },
    {
      id: '2',
      item: '1.01',
      descripcion: '',
      unidad: 'Global',
      cantidad: 1,
      precioUnitario: 0,
      precioParcial: 0,
      esTitulo: false,
    },
  ]);

  useEffect(() => {
    fetch('/api/empresas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setEmpresas(data.data);
          setEmpresaId(data.data[0].id);
        }
      });
  }, []);

  // Update item field
  const updateItem = (id: string, field: keyof ItemRow, value: any) => {
    setItems((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: value };
        if (field === 'cantidad' || field === 'precioUnitario') {
          const c = field === 'cantidad' ? parseFloat(value) || 0 : row.cantidad;
          const p = field === 'precioUnitario' ? parseFloat(value) || 0 : row.precioUnitario;
          updated.precioParcial = row.esTitulo ? 0 : Math.round(c * p * 100) / 100;
        }
        return updated;
      })
    );
  };

  const addGroupTitle = () => {
    const newId = String(Date.now());
    const nextNum = `${items.filter((i) => i.esTitulo).length + 1}.00`;
    setItems([
      ...items,
      {
        id: newId,
        item: nextNum,
        descripcion: 'NUEVA SECCIÓN / GRUPO',
        unidad: 'Global',
        cantidad: 1,
        precioUnitario: 0,
        precioParcial: 0,
        esTitulo: true,
      },
    ]);
  };

  const addItem = () => {
    const newId = String(Date.now());
    setItems([
      ...items,
      {
        id: newId,
        item: '',
        descripcion: '',
        unidad: 'Global',
        cantidad: 1,
        precioUnitario: 0,
        precioParcial: 0,
        esTitulo: false,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Calculations
  const costoDirecto = items.reduce(
    (acc, row) => acc + (row.esTitulo ? 0 : row.precioParcial || 0),
    0
  );
  const igv = Math.round(costoDirecto * 0.18 * 100) / 100;
  const totalGeneral = Math.round((costoDirecto + igv) * 100) / 100;
  const montoLetras = numeroALetrasSoles(totalGeneral);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaId,
          numero,
          entidad,
          atencion,
          fecha,
          objetoServicio,
          ubicacion,
          validezOferta,
          tiempoEjecucion,
          garantia,
          formaPago,
          lugarEjecucion,
          montoCostoDirecto: costoDirecto,
          montoIgv: igv,
          montoTotal: totalGeneral,
          items,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/cotizaciones/${data.data.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/cotizaciones"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Cotizaciones
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar y Ver Formato Oficial PDF'}
          </button>
        </div>
      </div>

      {/* Datos del Encabezado */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Datos Generales de la Propuesta Económica
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Empresa Emisora</label>
            <select
              required
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.razonSocial} (RUC: {e.ruc})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">N° de Cotización</label>
            <input
              type="text"
              required
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fecha</label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Señores (Entidad Pública)</label>
            <input
              type="text"
              required
              value={entidad}
              onChange={(e) => setEntidad(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Atención (Área Usuaria)</label>
            <input
              type="text"
              value={atencion}
              onChange={(e) => setAtencion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Objeto del Servicio / Obra (Descripción Principal)
          </label>
          <textarea
            required
            rows={2}
            value={objetoServicio}
            onChange={(e) => setObjetoServicio(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      {/* Tabla Desagregada de Partidas */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              Desagregado de Partidas / Ítems de la Cotización
            </h2>
            <p className="text-xs text-slate-500">
              Ingresa los ítems con sus cantidades y precios unitarios. El subtotal e IGV se calculan solos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addGroupTitle}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              + Agregar Título / Grupo
            </button>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors"
            >
              + Agregar Partida
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 w-16 text-center border-r border-slate-800">ITEM</th>
                <th className="p-2.5 border-r border-slate-800">DESCRIPCIÓN DE LA ACTIVIDAD / MATERIAL</th>
                <th className="p-2.5 w-24 text-center border-r border-slate-800">UND</th>
                <th className="p-2.5 w-20 text-center border-r border-slate-800">CANT.</th>
                <th className="p-2.5 w-28 text-right border-r border-slate-800">P. UNIT (S/)</th>
                <th className="p-2.5 w-28 text-right border-r border-slate-800">P. PARCIAL (S/)</th>
                <th className="p-2.5 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((row) => {
                if (row.esTitulo) {
                  return (
                    <tr key={row.id} className="bg-slate-100 font-bold text-slate-900">
                      <td className="p-2 text-center border-r border-slate-200">
                        <input
                          type="text"
                          value={row.item}
                          onChange={(e) => updateItem(row.id, 'item', e.target.value)}
                          className="w-full text-center bg-transparent font-bold focus:outline-none"
                        />
                      </td>
                      <td colSpan={5} className="p-2 border-r border-slate-200">
                        <input
                          type="text"
                          value={row.descripcion}
                          onChange={(e) => updateItem(row.id, 'descripcion', e.target.value)}
                          className="w-full bg-transparent font-black tracking-wider uppercase focus:outline-none"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(row.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.item}
                        onChange={(e) => updateItem(row.id, 'item', e.target.value)}
                        placeholder="1.01"
                        className="w-full text-center font-mono font-bold text-slate-800 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <textarea
                        rows={2}
                        value={row.descripcion}
                        onChange={(e) => updateItem(row.id, 'descripcion', e.target.value)}
                        placeholder="Descripción de la partida..."
                        className="w-full text-xs text-slate-700 bg-transparent focus:outline-none resize-none"
                      ></textarea>
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.unidad}
                        onChange={(e) => updateItem(row.id, 'unidad', e.target.value)}
                        className="w-full text-center text-slate-600 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="number"
                        step="0.01"
                        value={row.cantidad}
                        onChange={(e) => updateItem(row.id, 'cantidad', e.target.value)}
                        className="w-full text-center font-semibold text-slate-800 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={row.precioUnitario}
                        onChange={(e) => updateItem(row.id, 'precioUnitario', e.target.value)}
                        className="w-full text-right font-mono font-semibold text-slate-800 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200 text-right font-black text-slate-900 font-mono">
                      S/ {row.precioParcial.toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(row.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumen de Totales */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-1 flex-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Monto en Letras
            </span>
            <div className="text-xs font-bold text-slate-800 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
              {montoLetras}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl shrink-0 min-w-[280px] text-right space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>COSTO DIRECTO:</span>
              <span className="font-mono font-bold">
                S/. {costoDirecto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>IGV (18%):</span>
              <span className="font-mono font-bold">
                S/. {igv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-base font-black text-emerald-400 pt-2 border-t border-slate-800">
              <span>TOTAL GENERAL:</span>
              <span className="font-mono">
                S/. {totalGeneral.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Condiciones Comerciales */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Condiciones Comerciales de la Oferta
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Validez de la Oferta</label>
            <input
              type="text"
              value={validezOferta}
              onChange={(e) => setValidezOferta(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tiempo de Ejecución</label>
            <input
              type="text"
              value={tiempoEjecucion}
              onChange={(e) => setTiempoEjecucion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Garantía del Servicio</label>
            <input
              type="text"
              value={garantia}
              onChange={(e) => setGarantia(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Forma de Pago</label>
            <input
              type="text"
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Lugar de Ejecución</label>
          <input
            type="text"
            value={lugarEjecucion}
            onChange={(e) => setLugarEjecucion(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>
    </form>
  );
}
