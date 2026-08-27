'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Search,
  Building2,
  Layers,
  Wrench,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Tag,
  Hammer,
  HardHat,
  Filter,
  Check,
  Copy,
} from 'lucide-react';
import {
  VALOR_M2_GRUPOS,
  PARTIDAS_PRESUPUESTO,
  INSUMOS_PRECIOS,
  APU_CATALOGO,
  ValorM2Grupo,
  PartidaPresupuesto,
  InsumoPrecio,
  APUItem,
} from '@/lib/costos-directos-data';

export default function CostosDirectosPage() {
  const [activeTab, setActiveTab] = useState<'valorm2' | 'partidas' | 'insumos' | 'apu'>('valorm2');
  const [search, setSearch] = useState('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<string>('ALL');
  const [selectedTipoInsumo, setSelectedTipoInsumo] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtrado de Valor m2
  const filteredGrupos = VALOR_M2_GRUPOS.filter(
    (g) =>
      g.item.includes(search) ||
      g.grupo.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPartidasPresupuesto = PARTIDAS_PRESUPUESTO.filter(
    (p) =>
      p.item.toLowerCase().includes(search.toLowerCase()) ||
      p.partida.toLowerCase().includes(search.toLowerCase()) ||
      p.grupoItem.includes(search)
  );

  // Filtrado de Partidas OE & HU
  const filteredPartidas = PARTIDAS_PRESUPUESTO.filter((p) => {
    const matchesEspecialidad =
      selectedEspecialidad === 'ALL' || p.especialidad === selectedEspecialidad;
    const matchesSearch =
      !search ||
      p.item.toLowerCase().includes(search.toLowerCase()) ||
      p.partida.toLowerCase().includes(search.toLowerCase()) ||
      p.unidad.toLowerCase().includes(search.toLowerCase());
    return matchesEspecialidad && matchesSearch;
  });

  // Filtrado de Insumos
  const filteredInsumos = INSUMOS_PRECIOS.filter((i) => {
    const matchesTipo = selectedTipoInsumo === 'ALL' || i.tipo === selectedTipoInsumo;
    const matchesSearch =
      !search ||
      i.codigo.toLowerCase().includes(search.toLowerCase()) ||
      i.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      i.grupo.toLowerCase().includes(search.toLowerCase()) ||
      (i.proveedor && i.proveedor.toLowerCase().includes(search.toLowerCase())) ||
      (i.marca && i.marca.toLowerCase().includes(search.toLowerCase()));
    return matchesTipo && matchesSearch;
  });

  // Filtrado de APU
  const filteredAPUs = APU_CATALOGO.filter((a) => {
    const matchesEspecialidad =
      selectedEspecialidad === 'ALL' || a.especialidad === selectedEspecialidad;
    const matchesSearch =
      !search ||
      a.codigo.toLowerCase().includes(search.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(search.toLowerCase());
    return matchesEspecialidad && matchesSearch;
  });

  // Totales
  const totalParcialSoles = VALOR_M2_GRUPOS.reduce((acc, g) => acc + g.parcialSoles, 0);
  const totalValorM2Soles = VALOR_M2_GRUPOS.reduce((acc, g) => acc + g.valorM2Soles, 0);
  const totalValorM2Dolares = VALOR_M2_GRUPOS.reduce((acc, g) => acc + g.valorM2Dolares, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calculator className="w-7 h-7 text-indigo-600" />
            Módulo de Costos Directos & Precios Unitarios
          </h1>
          <p className="text-sm text-slate-500">
            Base de datos referencial de costos por m², análisis de precios unitarios (APU) e insumos para presupuestos del Estado
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cotizaciones/nueva"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Crear Cotización con estos Costos
          </Link>
        </div>
      </div>

      {/* KPI Banner: Valor m2 Tipología A */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            Tipología Referencial
          </span>
          <div className="mt-1 text-sm font-bold text-slate-100">
            Vivienda Unifamiliar Económica
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-400">
            S/ {totalValorM2Soles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-indigo-200">/ m²</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Valor m² en Dólares (USD)</span>
          <div className="mt-2 text-2xl font-black text-emerald-600">
            $ {totalValorM2Dolares.toFixed(2)} <span className="text-xs text-slate-400">/ m²</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">T.C. estimado ref. S/ 3.68</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Costo Directo Total Modelo</span>
          <div className="mt-2 text-2xl font-black text-slate-800">
            S/ {totalParcialSoles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">29 Grupos de partidas analizadas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Insumos & Rendimientos</span>
          <div className="mt-2 text-2xl font-black text-blue-600">
            {INSUMOS_PRECIOS.length + PARTIDAS_PRESUPUESTO.length} Registros
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Materiales, Mano de Obra y Equipos</p>
        </div>
      </div>

      {/* Navegación por Pestañas Principales */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('valorm2')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'valorm2'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          1. Valor m² de Construcción & Presupuesto
        </button>

        <button
          onClick={() => setActiveTab('partidas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'partidas'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          2. Precios Unitarios Partidas (OE y HU)
        </button>

        <button
          onClick={() => setActiveTab('apu')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'apu'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          3. Análisis de Precios Unitarios (APU)
        </button>

        <button
          onClick={() => setActiveTab('insumos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'insumos'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Hammer className="w-4 h-4" />
          4. Insumos, Mano de Obra & Equipos
        </button>
      </div>

      {/* Barra de Búsqueda Dinámica */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, descripción, material, etc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {(activeTab === 'partidas' || activeTab === 'apu') && (
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Especialidad:
            </span>
            {['ALL', 'ARQUITECTURA', 'ESTRUCTURAS', 'SANITARIAS', 'ELECTRICAS', 'OE'].map((esp) => (
              <button
                key={esp}
                onClick={() => setSelectedEspecialidad(esp)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedEspecialidad === esp
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {esp === 'ALL' ? 'Todas' : esp}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'insumos' && (
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Tipo:
            </span>
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'MATERIAL', label: 'Materiales' },
              { id: 'MANO_DE_OBRA', label: 'Mano de Obra (CAPECO)' },
              { id: 'EQUIPO', label: 'Equipos / Herramientas' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTipoInsumo(t.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedTipoInsumo === t.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONTENIDO TAB 1: VALOR M2 DE CONSTRUCCIÓN & PRESUPUESTO */}
      {activeTab === 'valorm2' && (
        <div className="space-y-6">
          {/* TABLA PRINCIPAL: 29 GRUPOS DE PARTIDA */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">
                  1. VALOR m² DE CONSTRUCCIÓN — TIPOLOGÍA A: VIVIENDA UNIFAMILIAR ECONÓMICA
                </h3>
                <p className="text-xs text-indigo-200">
                  Total Modelo: S/. 1,654.37 / m² ($ 449.56 / m²)
                </p>
              </div>
              <span className="text-xs bg-indigo-500/30 text-indigo-200 font-mono px-3 py-1 rounded-lg border border-indigo-400/20 font-bold">
                29 GRUPOS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 w-16 text-center">ITEM</th>
                    <th className="py-3 px-4">GRUPO DE PARTIDA</th>
                    <th className="py-3 px-4 text-right">PARCIAL S/</th>
                    <th className="py-3 px-4 text-right">VALOR M2 S/</th>
                    <th className="py-3 px-4 text-right">VALOR M2 $</th>
                    <th className="py-3 px-4 text-center w-24">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredGrupos.map((g) => (
                    <tr key={g.item} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-600 bg-slate-50/50">
                        {g.item}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">
                        {g.grupo}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                        S/ {g.parcialSoles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-indigo-700 bg-indigo-50/30">
                        S/ {g.valorM2Soles.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-emerald-700">
                        $ {g.valorM2Dolares.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => handleCopy(`Item ${g.item} - ${g.grupo} (S/ ${g.valorM2Soles}/m2)`, g.item)}
                          className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold inline-flex items-center gap-1"
                        >
                          {copiedCode === g.item ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedCode === g.item ? 'Copiado' : 'Copiar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-bold text-xs">
                    <td colSpan={2} className="py-3.5 px-4 text-right tracking-wider uppercase">
                      TOTAL GENERAL VALOR m²
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-indigo-300 text-sm">
                      S/ {totalParcialSoles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-indigo-300 text-sm">
                      S/ {totalValorM2Soles.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-400 text-sm">
                      $ {totalValorM2Dolares.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* TABLA SECUNDARIA: DESGLOSE PRESUPUESTAL DE PARTIDAS */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">
                  2. PRESUPUESTO DESGLOSADO DE PARTIDAS (VALOR m² DE CONSTRUCCIÓN)
                </h3>
                <p className="text-xs text-slate-300">
                  Desagregado por Metrado, Precio Unitario (S/) y Parcial (S/)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 w-24 text-center">ITEM</th>
                    <th className="py-3 px-4">PARTIDA</th>
                    <th className="py-3 px-4 text-center w-16">UND</th>
                    <th className="py-3 px-4 text-right w-24">METRADO</th>
                    <th className="py-3 px-4 text-right w-28">PRECIO (S/)</th>
                    <th className="py-3 px-4 text-right w-28">PARCIAL (S/)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPartidasPresupuesto.map((p) => (
                    <tr key={p.item} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-600 bg-slate-50">
                        {p.item}
                      </td>
                      <td className="py-2.5 px-4 text-slate-900 font-medium">
                        {p.partida}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-500 font-bold">
                        {p.unidad}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                        {p.metrado.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-800">
                        S/ {p.precioUnitario.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-indigo-700 bg-indigo-50/20">
                        S/ {p.parcial.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 2: PRECIOS UNITARIOS PARTIDAS OE & HU */}
      {activeTab === 'partidas' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                PRECIOS UNITARIOS DE PARTIDAS — OBRAS DE EDIFICACIÓN (OE) Y HABILITACIÓN URBANA (HU)
              </h3>
              <p className="text-xs text-indigo-200">
                Costos unitarios directos normalizados por unidad de medida
              </p>
            </div>
            <span className="text-xs bg-indigo-500/30 text-indigo-200 font-mono px-3 py-1 rounded-lg border border-indigo-400/20 font-bold">
              {filteredPartidas.length} PARTIDAS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-24 text-center">CÓDIGO</th>
                  <th className="py-3 px-4">DESCRIPCIÓN DE LA PARTIDA</th>
                  <th className="py-3 px-4 text-center w-20">ESP.</th>
                  <th className="py-3 px-4 text-center w-16">UND</th>
                  <th className="py-3 px-4 text-right w-28">P. UNITARIO (S/)</th>
                  <th className="py-3 px-4 text-center w-36">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPartidas.map((p) => (
                  <tr key={p.item} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-600 bg-slate-50">
                      {p.item}
                    </td>
                    <td className="py-2.5 px-4 text-slate-900 font-bold">
                      {p.partida}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                        {p.especialidad}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-500">
                      {p.unidad}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-extrabold text-indigo-700 bg-indigo-50/30">
                      S/ {p.precioUnitario.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => handleCopy(`${p.partida} | Und: ${p.unidad} | S/ ${p.precioUnitario}`, p.item)}
                        className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold inline-flex items-center gap-1"
                      >
                        {copiedCode === p.item ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedCode === p.item ? 'Copiado' : 'Copiar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 3: ANÁLISIS DE PRECIOS UNITARIOS (APU) */}
      {activeTab === 'apu' && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold">ANÁLISIS DE PRECIOS UNITARIOS (APU) POR ESPECIALIDAD</h3>
              <p className="text-xs text-indigo-200">
                Desglose analítico de Mano de Obra, Materiales, Equipos y Rendimiento Diario
              </p>
            </div>
            <span className="text-xs bg-indigo-700 px-3 py-1 rounded-lg font-bold">
              CAPECO / Costos Perú
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredAPUs.map((apu) => (
              <div
                key={apu.codigo}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                {/* APU Header */}
                <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-600 text-[10px] font-mono font-bold rounded">
                        {apu.codigo}
                      </span>
                      <span className="text-xs text-indigo-300 font-bold">
                        {apu.especialidad}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{apu.descripcion}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">
                      Rendimiento: <strong className="text-slate-200">{apu.rendimiento}</strong>
                    </div>
                    <div className="text-base font-black text-indigo-400 font-mono">
                      Costo Unitario: S/ {apu.costoUnitarioTotal.toFixed(2)} / {apu.unidad}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  {/* Mano de Obra */}
                  <div>
                    <h5 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-indigo-900">
                      <HardHat className="w-3.5 h-3.5 text-indigo-600" /> Mano de Obra
                    </h5>
                    <table className="w-full text-left border-collapse bg-slate-50 rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                          <th className="py-2 px-3">Recurso</th>
                          <th className="py-2 px-3 text-center">Cuadrilla</th>
                          <th className="py-2 px-3 text-center">Und</th>
                          <th className="py-2 px-3 text-right">Cantidad</th>
                          <th className="py-2 px-3 text-right">Precio S/</th>
                          <th className="py-2 px-3 text-right">Parcial S/</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {apu.manoDeObra.map((mo, idx) => (
                          <tr key={idx}>
                            <td className="py-1.5 px-3 font-medium text-slate-800">{mo.recurso}</td>
                            <td className="py-1.5 px-3 text-center font-mono">{mo.cuadrilla.toFixed(2)}</td>
                            <td className="py-1.5 px-3 text-center font-mono text-slate-500">{mo.unidad}</td>
                            <td className="py-1.5 px-3 text-right font-mono">{mo.cantidad.toFixed(4)}</td>
                            <td className="py-1.5 px-3 text-right font-mono">S/ {mo.precio.toFixed(2)}</td>
                            <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">S/ {mo.parcial.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Materiales */}
                  <div>
                    <h5 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-emerald-900">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> Materiales
                    </h5>
                    <table className="w-full text-left border-collapse bg-slate-50 rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                          <th className="py-2 px-3">Material / Insumo</th>
                          <th className="py-2 px-3 text-center">Und</th>
                          <th className="py-2 px-3 text-right">Cantidad</th>
                          <th className="py-2 px-3 text-right">Precio S/</th>
                          <th className="py-2 px-3 text-right">Parcial S/</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {apu.materiales.map((mat, idx) => (
                          <tr key={idx}>
                            <td className="py-1.5 px-3 font-medium text-slate-800">{mat.recurso}</td>
                            <td className="py-1.5 px-3 text-center font-mono text-slate-500">{mat.unidad}</td>
                            <td className="py-1.5 px-3 text-right font-mono">{mat.cantidad.toFixed(3)}</td>
                            <td className="py-1.5 px-3 text-right font-mono">S/ {mat.precio.toFixed(2)}</td>
                            <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">S/ {mat.parcial.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Equipos */}
                  <div>
                    <h5 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-amber-900">
                      <Wrench className="w-3.5 h-3.5 text-amber-600" /> Equipos y Herramientas
                    </h5>
                    <table className="w-full text-left border-collapse bg-slate-50 rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                          <th className="py-2 px-3">Equipo / Maquinaria</th>
                          <th className="py-2 px-3 text-center">Cuadrilla</th>
                          <th className="py-2 px-3 text-center">Und</th>
                          <th className="py-2 px-3 text-right">Cantidad</th>
                          <th className="py-2 px-3 text-right">Precio S/</th>
                          <th className="py-2 px-3 text-right">Parcial S/</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {apu.equipos.map((eq, idx) => (
                          <tr key={idx}>
                            <td className="py-1.5 px-3 font-medium text-slate-800">{eq.recurso}</td>
                            <td className="py-1.5 px-3 text-center font-mono">{eq.cuadrilla.toFixed(2)}</td>
                            <td className="py-1.5 px-3 text-center font-mono text-slate-500">{eq.unidad}</td>
                            <td className="py-1.5 px-3 text-right font-mono">{eq.cantidad.toFixed(4)}</td>
                            <td className="py-1.5 px-3 text-right font-mono">S/ {eq.precio.toFixed(2)}</td>
                            <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">S/ {eq.parcial.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 4: PRECIOS DE INSUMOS, MANO DE OBRA Y EQUIPOS */}
      {activeTab === 'insumos' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                LISTA REFERENCIAL DE INSUMOS — MATERIALES, MANO DE OBRA Y EQUIPOS
              </h3>
              <p className="text-xs text-indigo-200">
                Considera grupos de insumos, marcas y proveedores de Lima y Provincias (Páginas 3.01 a 3.31)
              </p>
            </div>
            <span className="text-xs bg-indigo-500/30 text-indigo-200 font-mono px-3 py-1 rounded-lg border border-indigo-400/20 font-bold">
              {filteredInsumos.length} INSUMOS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-24 text-center">CÓDIGO</th>
                  <th className="py-3 px-4">DESCRIPCIÓN DEL INSUMO</th>
                  <th className="py-3 px-4">GRUPO / CATEGORÍA</th>
                  <th className="py-3 px-4">MARCA / PROVEEDOR</th>
                  <th className="py-3 px-4 text-center w-16">UND</th>
                  <th className="py-3 px-4 text-right w-28">SIN IGV (S/)</th>
                  <th className="py-3 px-4 text-right w-28">CON IGV (S/)</th>
                  <th className="py-3 px-4 text-center w-24">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInsumos.map((i) => (
                  <tr key={i.codigo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-600 bg-slate-50">
                      {i.codigo}
                    </td>
                    <td className="py-2.5 px-4 text-slate-900 font-bold">
                      {i.descripcion}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium">
                        {i.grupo}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 text-[11px]">
                      {i.proveedor || i.marca || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-500">
                      {i.unidad}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                      S/ {i.precioSinIgv.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-extrabold text-indigo-700 bg-indigo-50/30">
                      S/ {i.precioConIgv.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => handleCopy(`${i.descripcion} | S/ ${i.precioConIgv}`, i.codigo)}
                        className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold inline-flex items-center gap-1"
                      >
                        {copiedCode === i.codigo ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedCode === i.codigo ? 'Copiado' : 'Copiar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
