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
  Search,
  X,
  Hammer,
  Layers,
  HardHat,
  Wrench,
} from 'lucide-react';
import { numeroALetrasSoles } from '@/lib/number-to-letters';
import { PARTIDAS_PRESUPUESTO, PARTIDAS_OE_HU, INSUMOS_PRECIOS } from '@/lib/costos-directos-data';

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

  // Modal Costos Directos
  const [modalCostosOpen, setModalCostosOpen] = useState(false);
  const [targetRowIdForCostos, setTargetRowIdForCostos] = useState<string | null>(null);
  const [searchCostos, setSearchCostos] = useState('');
  const [filtroCostos, setFiltroCostos] = useState<string>('ALL');

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

  const handleSelectCostosItem = (item: {
    codigo?: string;
    descripcion: string;
    unidad: string;
    precioUnitario: number;
  }) => {
    if (targetRowIdForCostos) {
      // Update existing row
      updateItem(targetRowIdForCostos, 'descripcion', item.descripcion);
      updateItem(targetRowIdForCostos, 'unidad', item.unidad);
      updateItem(targetRowIdForCostos, 'precioUnitario', item.precioUnitario);
      if (item.codigo) updateItem(targetRowIdForCostos, 'item', item.codigo);
    } else {
      // Append new row
      const newId = String(Date.now());
      const nextNum = `1.0${items.filter((i) => !i.esTitulo).length + 1}`;
      setItems((prev) => [
        ...prev,
        {
          id: newId,
          item: item.codigo || nextNum,
          descripcion: item.descripcion,
          unidad: item.unidad,
          cantidad: 1,
          precioUnitario: item.precioUnitario,
          precioParcial: item.precioUnitario,
          esTitulo: false,
        },
      ]);
    }
    setModalCostosOpen(false);
    setTargetRowIdForCostos(null);
  };

  const openCostosModal = (targetRowId: string | null = null) => {
    setTargetRowIdForCostos(targetRowId);
    setSearchCostos('');
    setModalCostosOpen(true);
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openCostosModal(null)}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              🔍 Buscar en Costos Directos
            </button>
            <button
              type="button"
              onClick={addGroupTitle}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              + Agregar Título / Grupo
            </button>
            <button
              type="button"
              onClick={addItem}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
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
                <th className="p-2.5 w-16 text-center">ACCIONES</th>
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
                          className="w-full text-center bg-transparent font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td colSpan={5} className="p-2 border-r border-slate-200">
                        <input
                          type="text"
                          value={row.descripcion}
                          onChange={(e) => updateItem(row.id, 'descripcion', e.target.value)}
                          className="w-full bg-transparent font-black tracking-wider uppercase text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(row.id)}
                          className="p-1.5 bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-300 transition-colors"
                          title="Eliminar título"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.item}
                        onChange={(e) => updateItem(row.id, 'item', e.target.value)}
                        placeholder="1.01"
                        className="w-full text-center font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200 relative">
                      <div className="flex items-start gap-1.5">
                        <textarea
                          rows={2}
                          value={row.descripcion}
                          onChange={(e) => updateItem(row.id, 'descripcion', e.target.value)}
                          placeholder="Descripción de la partida..."
                          className="w-full text-xs text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-1 resize-none"
                        ></textarea>
                        <button
                          type="button"
                          title="Buscar precio referencial en catálogo de Costos Directos"
                          onClick={() => openCostosModal(row.id)}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          <Search className="w-3 h-3 text-indigo-600" />
                          <span className="text-[10px]">Costos</span>
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.unidad}
                        onChange={(e) => updateItem(row.id, 'unidad', e.target.value)}
                        className="w-full text-center text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded font-bold"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="number"
                        step="0.01"
                        value={row.cantidad}
                        onChange={(e) => updateItem(row.id, 'cantidad', e.target.value)}
                        className="w-full text-center font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={row.precioUnitario}
                        onChange={(e) => updateItem(row.id, 'precioUnitario', e.target.value)}
                        className="w-full text-right font-mono font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200 text-right font-black text-slate-900 font-mono">
                      S/ {row.precioParcial.toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title="Buscar en catálogo"
                          onClick={() => openCostosModal(row.id)}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg border border-slate-200 transition-colors"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Eliminar fila"
                          onClick={() => removeItem(row.id)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

      {/* MODAL: BUSCADOR DE PRECIOS Y COSTOS DIRECTOS */}
      {modalCostosOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 max-h-[88vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Banco de Precios Unitarios & Costos Directos
                  </h3>
                  <p className="text-xs text-indigo-200">
                    {targetRowIdForCostos
                      ? 'Selecciona una partida o insumo para actualizar la fila seleccionada'
                      : 'Selecciona una partida o insumo para insertarla en la cotización'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalCostosOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Escribe para buscar (ej. Pintura látex, Tarrajeo, Concreto, Inodoro, Tubería, Peón, Operario...)"
                  value={searchCostos}
                  onChange={(e) => setSearchCostos(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'ALL', label: 'Todos' },
                  { id: 'OE', label: 'Obras Edificación (OE)' },
                  { id: 'ARQUITECTURA', label: 'Arquitectura' },
                  { id: 'ESTRUCTURAS', label: 'Estructuras' },
                  { id: 'SANITARIAS', label: 'Sanitarias' },
                  { id: 'ELECTRICAS', label: 'Eléctricas' },
                  { id: 'MATERIAL', label: 'Materiales' },
                  { id: 'MANO_DE_OBRA', label: 'Mano de Obra (CAPECO)' },
                  { id: 'EQUIPO', label: 'Equipos / Maquinarias' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFiltroCostos(f.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                      filtroCostos === f.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Results List */}
            <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-1">
              {/* Partidas matches */}
              {PARTIDAS_PRESUPUESTO.filter((p) => {
                const matchesFiltro =
                  filtroCostos === 'ALL' ||
                  filtroCostos === 'OE' ||
                  p.especialidad === filtroCostos;
                const matchesText =
                  !searchCostos ||
                  p.item.toLowerCase().includes(searchCostos.toLowerCase()) ||
                  p.partida.toLowerCase().includes(searchCostos.toLowerCase());
                return matchesFiltro && matchesText;
              }).map((p) => (
                <div
                  key={`partida-${p.item}`}
                  className="py-2.5 px-3 rounded-xl hover:bg-indigo-50/50 transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {p.item}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {p.especialidad}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{p.partida}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Unidad: {p.unidad}</div>
                      <div className="text-sm font-black text-indigo-700 font-mono">
                        S/ {p.precioUnitario.toFixed(2)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectCostosItem({
                          codigo: p.item,
                          descripcion: p.partida,
                          unidad: p.unidad,
                          precioUnitario: p.precioUnitario,
                        })
                      }
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all group-hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {targetRowIdForCostos ? 'Usar en Fila' : 'Agregar'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Partidas OE / HU matches */}
              {PARTIDAS_OE_HU.filter((p) => {
                const matchesFiltro =
                  filtroCostos === 'ALL' ||
                  filtroCostos === 'OE' ||
                  filtroCostos === p.especialidad;
                const matchesText =
                  !searchCostos ||
                  p.codigo.toLowerCase().includes(searchCostos.toLowerCase()) ||
                  p.partida.toLowerCase().includes(searchCostos.toLowerCase()) ||
                  p.subcategoria.toLowerCase().includes(searchCostos.toLowerCase());
                return matchesFiltro && matchesText;
              }).map((p) => (
                <div
                  key={`oehu-${p.codigo}`}
                  className="py-2.5 px-3 rounded-xl hover:bg-blue-50/50 transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {p.codigo}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {p.subcategoria}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{p.partida}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Und: {p.unidad}</div>
                      <div className="text-sm font-black text-blue-700 font-mono">
                        S/ {p.precioUnitario.toFixed(2)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectCostosItem({
                          codigo: p.codigo,
                          descripcion: p.partida,
                          unidad: p.unidad,
                          precioUnitario: p.precioUnitario,
                        })
                      }
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all group-hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {targetRowIdForCostos ? 'Usar en Fila' : 'Agregar'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Insumos matches */}
              {INSUMOS_PRECIOS.filter((i) => {
                const matchesFiltro =
                  filtroCostos === 'ALL' ||
                  filtroCostos === i.tipo;
                const matchesText =
                  !searchCostos ||
                  i.codigo.toLowerCase().includes(searchCostos.toLowerCase()) ||
                  i.descripcion.toLowerCase().includes(searchCostos.toLowerCase()) ||
                  i.grupo.toLowerCase().includes(searchCostos.toLowerCase());
                return matchesFiltro && matchesText;
              }).map((i) => (
                <div
                  key={`insumo-${i.codigo}`}
                  className="py-2.5 px-3 rounded-xl hover:bg-emerald-50/50 transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {i.codigo}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {i.tipo === 'MANO_DE_OBRA' ? 'MANO DE OBRA' : i.tipo}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{i.descripcion}</span>
                      {i.marca && (
                        <span className="text-[10px] text-slate-400 italic">({i.marca})</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Unidad: {i.unidad}</div>
                      <div className="text-sm font-black text-emerald-700 font-mono">
                        S/ {i.precioConIgv.toFixed(2)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectCostosItem({
                          codigo: i.codigo,
                          descripcion: i.descripcion,
                          unidad: i.unidad,
                          precioUnitario: i.precioConIgv,
                        })
                      }
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all group-hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {targetRowIdForCostos ? 'Usar en Fila' : 'Agregar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>
                💡 Puedes buscar por nombre de material, código o actividad y presionar <strong>Agregar</strong> para insertarlo automáticamente con su precio unitario oficial.
              </span>
              <button
                type="button"
                onClick={() => setModalCostosOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
