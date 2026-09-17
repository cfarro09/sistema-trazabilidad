'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Wrench,
  Edit3,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Copy,
} from 'lucide-react';
import { numeroALetrasSoles } from '@/lib/number-to-letters';
import { PARTIDAS_PRESUPUESTO, PARTIDAS_OE_HU, INSUMOS_PRECIOS } from '@/lib/costos-directos-data';
import DuplicateQuoteModal from '@/components/DuplicateQuoteModal';

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

function CotizacionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit') || searchParams.get('id');
  const isEditing = Boolean(editId);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);

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
  const [isManualNumero, setIsManualNumero] = useState(false);
  const [autoNumero, setAutoNumero] = useState('');
  const [loadingNumero, setLoadingNumero] = useState(false);
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
      unidad: 'm2',
      cantidad: 1,
      precioUnitario: 0,
      precioParcial: 0,
      esTitulo: false,
    },
  ]);

  const fetchCorrelativo = async (targetFecha?: string) => {
    setLoadingNumero(true);
    try {
      const f = targetFecha || fecha || new Date().toISOString().substring(0, 10);
      const res = await fetch(`/api/cotizaciones/correlativo?fecha=${f}`);
      const data = await res.json();
      if (data.success && data.data?.numero) {
        setAutoNumero(data.data.numero);
        if (!isManualNumero) {
          setNumero(data.data.numero);
        }
      }
    } catch (e) {
      console.error('Error al cargar correlativo automático:', e);
    } finally {
      setLoadingNumero(false);
    }
  };

  useEffect(() => {
    fetch('/api/empresas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setEmpresas(data.data);
          if (!editId) {
            setEmpresaId((prev) => prev || data.data[0].id);
          }
        }
      });
  }, [editId]);

  useEffect(() => {
    if (!editId) return;
    setLoadingEdit(true);
    fetch(`/api/cotizaciones/${editId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const q = data.data;
          if (q.empresaId) setEmpresaId(q.empresaId);
          if (q.numero) {
            setNumero(q.numero);
            setIsManualNumero(true);
          }
          if (q.entidad) setEntidad(q.entidad);
          if (q.atencion) setAtencion(q.atencion);
          if (q.fecha) setFecha(new Date(q.fecha).toISOString().substring(0, 10));
          if (q.objetoServicio) setObjetoServicio(q.objetoServicio);
          if (q.ubicacion) setUbicacion(q.ubicacion);
          if (q.validezOferta) setValidezOferta(q.validezOferta);
          if (q.tiempoEjecucion) setTiempoEjecucion(q.tiempoEjecucion);
          if (q.garantia) setGarantia(q.garantia);
          if (q.formaPago) setFormaPago(q.formaPago);
          if (q.lugarEjecucion) setLugarEjecucion(q.lugarEjecucion);

          if (q.items && q.items.length > 0) {
            setItems(
              q.items.map((it: any) => ({
                id: it.id || String(Date.now() + Math.random()),
                item: it.item || '',
                descripcion: it.descripcion || '',
                unidad: it.unidad || 'Global',
                cantidad: it.cantidad ?? 1,
                precioUnitario: it.precioUnitario ?? 0,
                precioParcial: it.precioParcial ?? 0,
                esTitulo: Boolean(it.esTitulo),
              }))
            );
          }
        }
      })
      .catch((err) => console.error('Error al cargar cotización para edición:', err))
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  useEffect(() => {
    if (!isManualNumero && !isEditing) {
      fetchCorrelativo(fecha);
    }
  }, [fecha, isManualNumero, isEditing]);

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

  // Calcula el siguiente correlativo para partidas (ej. 1.01, 1.02, 2.01, etc.)
  const getNextItemCorrelativo = (currentItems: ItemRow[]) => {
    let groupIndex = 1;
    let itemIndexInGroup = 0;
    for (const it of currentItems) {
      if (it.esTitulo) {
        const parsed = parseInt(it.item);
        groupIndex = !isNaN(parsed) && parsed > 0 ? parsed : groupIndex + 1;
        itemIndexInGroup = 0;
      } else {
        itemIndexInGroup++;
      }
    }
    return `${groupIndex}.${(itemIndexInGroup + 1).toString().padStart(2, '0')}`;
  };

  // Calcula el siguiente número para títulos / grupos (1.00, 2.00, etc.)
  const getNextTitleCorrelativo = (currentItems: ItemRow[]) => {
    const titleCount = currentItems.filter((i) => i.esTitulo).length;
    return `${titleCount + 1}.00`;
  };

  // Renumeración integral de correlativos (1.00, 1.01, 1.02... / 2.00, 2.01...)
  const recalcularCorrelativos = (customList?: ItemRow[]) => {
    const list = customList || items;
    let currentTitleNum = 0;
    let itemNumInGroup = 0;
    const hasAnyTitle = list.some((i) => i.esTitulo);

    const updated = list.map((row) => {
      if (row.esTitulo) {
        currentTitleNum++;
        itemNumInGroup = 0;
        return {
          ...row,
          item: `${currentTitleNum}.00`,
        };
      } else {
        itemNumInGroup++;
        const titlePrefix = hasAnyTitle ? (currentTitleNum > 0 ? currentTitleNum : 1) : 1;
        return {
          ...row,
          item: `${titlePrefix}.${itemNumInGroup.toString().padStart(2, '0')}`,
        };
      }
    });

    setItems(updated);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const addGroupTitle = () => {
    const newId = String(Date.now());
    const nextNum = getNextTitleCorrelativo(items);
    setItems((prev) => [
      ...prev,
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
    setTimeout(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('input[data-item-title="true"]');
      if (inputs.length > 0) {
        const lastInput = inputs[inputs.length - 1];
        lastInput.focus();
        lastInput.select();
        lastInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const addItem = () => {
    const newId = String(Date.now());
    const nextNum = getNextItemCorrelativo(items);
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        item: nextNum,
        descripcion: '',
        unidad: 'm2',
        cantidad: 1,
        precioUnitario: 0,
        precioParcial: 0,
        esTitulo: false,
      },
    ]);
    setTimeout(() => {
      const textareas = document.querySelectorAll<HTMLTextAreaElement>('textarea[data-item-desc="true"]');
      if (textareas.length > 0) {
        const lastTextarea = textareas[textareas.length - 1];
        lastTextarea.focus();
        lastTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
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
      // Actualiza fila existente manteniendo SIEMPRE su número correlativo
      updateItem(targetRowIdForCostos, 'descripcion', item.descripcion);
      updateItem(targetRowIdForCostos, 'unidad', item.unidad || 'm2');
      updateItem(targetRowIdForCostos, 'precioUnitario', item.precioUnitario);
      // No sobreescribimos 'item' con el código de catálogo (01.01.01) para preservar el correlativo
    } else {
      // Agrega nueva fila con el correlativo correspondiente
      const newId = String(Date.now());
      const nextNum = getNextItemCorrelativo(items);
      setItems((prev) => [
        ...prev,
        {
          id: newId,
          item: nextNum,
          descripcion: item.descripcion,
          unidad: item.unidad || 'm2',
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
      const url = isEditing ? `/api/cotizaciones/${editId}` : '/api/cotizaciones';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
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
      if (data.success && data.data?.id) {
        alert(isEditing ? '¡Cotización actualizada exitosamente!' : '¡Cotización guardada exitosamente!');
        router.push(`/cotizaciones/${data.data.id}`);
      } else {
        alert('No se pudo guardar la cotización: ' + (data.error || 'Verifique que los datos requeridos estén completos.'));
      }
    } catch (e: any) {
      console.error(e);
      alert('Error de conexión al guardar la cotización: ' + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/cotizaciones"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Cotizaciones
          </Link>
          {isEditing && (
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1.5 shadow-2xs">
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              Modo Edición: <span className="font-mono font-black">{numero || 'Cargando...'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={() => setDuplicateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              title="Duplicar esta cotización para cotizar con tus otras empresas"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicar para otra Empresa
            </button>
          )}

          <button
            type="submit"
            disabled={saving || loadingEdit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving
              ? 'Guardando...'
              : isEditing
              ? 'Guardar Cambios y Ver Formato PDF'
              : 'Guardar y Ver Formato Oficial PDF'}
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                N° de Cotización
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!isManualNumero) {
                    setIsManualNumero(true);
                  } else {
                    setIsManualNumero(false);
                    if (autoNumero) {
                      setNumero(autoNumero);
                    } else {
                      fetchCorrelativo(fecha);
                    }
                  }
                }}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
                  isManualNumero
                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
                title={
                  isManualNumero
                    ? 'Restaurar correlativo automático generado por Año y Mes'
                    : 'Permitir ingresar cualquier formato o nomenclatura de cotización antigua'
                }
              >
                {isManualNumero ? (
                  <>
                    <RotateCcw className="w-3 h-3 text-blue-600" />
                    Restaurar Automático
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3 h-3 text-amber-600" />
                    Editar / Cotización Antigua
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={numero}
                onChange={(e) => {
                  setNumero(e.target.value);
                  setIsManualNumero(true);
                }}
                placeholder={loadingNumero ? 'Generando correlativo...' : 'Ej. COT-2026-09-001 o Nº 00175 - 26'}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold transition-all focus:outline-none focus:ring-2 ${
                  isManualNumero
                    ? 'bg-white border-amber-300 text-slate-900 focus:ring-amber-500'
                    : 'bg-blue-50/50 border-blue-200 text-blue-800 focus:ring-blue-500'
                }`}
              />
              {loadingNumero && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-600 font-sans font-medium">
                  Generando...
                </span>
              )}
            </div>

            <p className="text-[10.5px] mt-1.5 leading-tight">
              {isManualNumero ? (
                <span className="text-amber-800 font-medium">
                  ✏️ <strong>Modo manual activo:</strong> Puedes escribir el formato que desees para cotizaciones pasadas.
                </span>
              ) : (
                <span className="text-blue-700 font-medium">
                  ✨ <strong>Automático:</strong> Año-Mes-N° (se adapta al año y mes de la fecha elegida).
                </span>
              )}
            </p>
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
        {/* Barra de Controles Sticky (Fija al hacer scroll) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md py-3 -mx-6 px-6 -mt-6 border-b border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-t-3xl transition-all">
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
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              🔍 Buscar en Costos Directos
            </button>
            <button
              type="button"
              onClick={() => recalcularCorrelativos()}
              title="Renumerar automáticamente los correlativos (1.00, 1.01, 1.02... / 2.00, 2.01...)"
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>🔢</span> Renumerar Correlativo
            </button>
            <button
              type="button"
              onClick={addGroupTitle}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              + Agregar Título / Grupo
            </button>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              + Agregar Partida
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 w-20 text-center border-r border-slate-800">ITEM</th>
                <th className="p-2.5 border-r border-slate-800">DESCRIPCIÓN DE LA ACTIVIDAD / MATERIAL</th>
                <th className="p-2.5 w-28 text-center border-r border-slate-800">UND</th>
                <th className="p-2.5 w-20 text-center border-r border-slate-800">CANT.</th>
                <th className="p-2.5 w-28 text-right border-r border-slate-800">P. UNIT (S/)</th>
                <th className="p-2.5 w-28 text-right border-r border-slate-800">P. PARCIAL (S/)</th>
                <th className="p-2.5 w-32 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((row, index) => {
                if (row.esTitulo) {
                  return (
                    <tr key={row.id} className="bg-slate-100 font-bold text-slate-900">
                      <td className="p-2 text-center border-r border-slate-200">
                        <input
                          type="text"
                          value={row.item}
                          onChange={(e) => updateItem(row.id, 'item', e.target.value)}
                          title="Correlativo del Título (puedes editarlo)"
                          className="w-full text-center bg-white/90 border border-slate-300 hover:border-slate-400 focus:border-blue-500 font-mono font-black text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg py-1 transition-all"
                        />
                      </td>
                      <td colSpan={5} className="p-2 border-r border-slate-200">
                        <input
                          type="text"
                          data-item-title="true"
                          value={row.descripcion}
                          onChange={(e) => updateItem(row.id, 'descripcion', e.target.value)}
                          className="w-full bg-transparent font-black tracking-wider uppercase text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            title="Subir posición de la sección"
                            disabled={index === 0}
                            onClick={() => moveItem(index, 'up')}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg border border-slate-300 transition-colors cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Bajar posición de la sección"
                            disabled={index === items.length - 1}
                            onClick={() => moveItem(index, 'down')}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg border border-slate-300 transition-colors cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(row.id)}
                            className="p-1.5 bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                            title="Eliminar título"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                        title="Correlativo de la partida (ej. 1.01, 1.02... puedes editarlo)"
                        className="w-full text-center font-mono font-bold text-xs text-slate-900 bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:bg-white rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200 relative">
                      <div className="flex items-start gap-1.5">
                        <textarea
                          rows={2}
                          data-item-desc="true"
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
                    <td className="p-2 border-r border-slate-200 w-28">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          list="lista-unidades-medida"
                          value={row.unidad}
                          onChange={(e) => updateItem(row.id, 'unidad', e.target.value)}
                          placeholder="m2 / glb"
                          title="Unidad de medida (m2, global, und, etc.) - Escribe o selecciona con la flecha"
                          className="w-full pl-2 pr-6 py-1 text-center bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:bg-white rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              updateItem(row.id, 'unidad', e.target.value);
                            }
                          }}
                          title="Seleccionar unidad (m2, global, und, etc.)"
                          className="absolute right-1 w-5 h-6 text-slate-500 hover:text-blue-600 bg-transparent cursor-pointer focus:outline-none text-xs"
                        >
                          <option value="" disabled>▾</option>
                          <option value="m2">m² (Metro cuadrado)</option>
                          <option value="glb">glb (Global)</option>
                          <option value="global">global (Global)</option>
                          <option value="und">und (Unidad)</option>
                          <option value="ml">ml (Metro lineal)</option>
                          <option value="m3">m³ (Metro cúbico)</option>
                          <option value="kg">kg (Kilogramo)</option>
                          <option value="pza">pza (Pieza)</option>
                          <option value="pto">pto (Punto)</option>
                          <option value="est">est (Estimado)</option>
                          <option value="servicio">servicio (Servicio)</option>
                          <option value="mes">mes (Mes)</option>
                          <option value="dia">día (Día)</option>
                          <option value="jgo">jgo (Juego)</option>
                          <option value="bolsa">bolsa (Bolsa)</option>
                          <option value="ton">ton (Tonelada)</option>
                          <option value="gal">gal (Galón)</option>
                          <option value="lt">lt (Litro)</option>
                          <option value="hh">hh (Hora hombre)</option>
                          <option value="hm">hm (Hora máquina)</option>
                        </select>
                      </div>
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
                          title="Subir posición de la partida"
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Bajar posición de la partida"
                          disabled={index === items.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Buscar en catálogo de Costos Directos"
                          onClick={() => openCostosModal(row.id)}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Eliminar fila"
                          onClick={() => removeItem(row.id)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
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

          {/* Datalist para autocompletar unidades */}
          <datalist id="lista-unidades-medida">
            <option value="m2" />
            <option value="glb" />
            <option value="global" />
            <option value="und" />
            <option value="ml" />
            <option value="m3" />
            <option value="kg" />
            <option value="pza" />
            <option value="pto" />
            <option value="est" />
            <option value="servicio" />
            <option value="mes" />
            <option value="dia" />
            <option value="jgo" />
            <option value="bolsa" />
            <option value="ton" />
            <option value="gal" />
            <option value="lt" />
            <option value="hh" />
            <option value="hm" />
          </datalist>
        </div>

        {/* Controles al pie de la tabla (Para agregar directamente abajo sin tener que subir) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-1 border-t border-slate-200 bg-slate-50/80 p-3.5 rounded-2xl">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Total partidas: <strong className="text-slate-900">{items.filter((i) => !i.esTitulo).length}</strong></span>
            {items.some((i) => i.esTitulo) && (
              <span className="text-slate-400">
                · {items.filter((i) => i.esTitulo).length} títulos / secciones
              </span>
            )}
            <span className="text-slate-400 ml-2 hidden md:inline">| Puedes cambiar el orden con 🔼 y 🔽</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => recalcularCorrelativos()}
              title="Renumerar automáticamente los correlativos (1.00, 1.01, 1.02... / 2.00, 2.01...)"
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>🔢</span> Renumerar Correlativo
            </button>
            <button
              type="button"
              onClick={() => openCostosModal(null)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              🔍 Buscar en Costos Directos
            </button>
            <button
              type="button"
              onClick={addGroupTitle}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              + Agregar Título / Grupo
            </button>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/25 cursor-pointer flex items-center gap-1.5"
              title="Agregar una nueva partida al final"
            >
              <Plus className="w-4 h-4" />
              + Agregar Partida
            </button>
          </div>
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

      {isEditing && editId && (
        <DuplicateQuoteModal
          isOpen={duplicateModalOpen}
          onClose={() => setDuplicateModalOpen(false)}
          quote={{
            id: editId,
            numero,
            objetoServicio,
            entidad,
            empresaId,
            montoTotal: totalGeneral,
            fecha,
          }}
        />
      )}
    </form>
  );
}

export default function NuevaCotizacionPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium">Cargando formulario de cotización...</div>}>
      <CotizacionForm />
    </Suspense>
  );
}
