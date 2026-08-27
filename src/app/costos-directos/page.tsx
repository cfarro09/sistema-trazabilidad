'use client';

import React, { useState } from 'react';
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
  BookOpen,
  ListFilter,
  Grid3X3,
  List,
} from 'lucide-react';
import {
  VALOR_M2_GRUPOS,
  PARTIDAS_PRESUPUESTO,
  INSUMOS_PRECIOS,
  INDICE_GRUPOS_INSUMOS,
  APU_CATALOGO,
  ValorM2Grupo,
  PartidaPresupuesto,
  InsumoPrecio,
  GrupoIndiceInsumo,
  APUItem,
} from '@/lib/costos-directos-data';

export default function CostosDirectosPage() {
  const [activeTab, setActiveTab] = useState<'valorm2' | 'partidas' | 'insumos' | 'apu'>('insumos');
  const [search, setSearch] = useState('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<string>('ALL');
  const [selectedTipoInsumo, setSelectedTipoInsumo] = useState<string>('ALL');
  const [selectedLetra, setSelectedLetra] = useState<string>('ALL');
  const [vistaInsumos, setVistaInsumos] = useState<'indice' | 'tabla'>('indice');
  const [selectedGrupoModal, setSelectedGrupoModal] = useState<GrupoIndiceInsumo | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Letras disponibles en el índice
  const letrasDisponibles = Array.from(new Set(INDICE_GRUPOS_INSUMOS.map((i) => i.letra))).sort();

  // Filtrado de Índice de Grupos de Insumos
  const filteredIndice = INDICE_GRUPOS_INSUMOS.filter((g) => {
    const matchesLetra = selectedLetra === 'ALL' || g.letra === selectedLetra;
    const matchesSearch =
      !search ||
      g.grupo.toLowerCase().includes(search.toLowerCase()) ||
      g.pagina.includes(search) ||
      (g.descripcion && g.descripcion.toLowerCase().includes(search.toLowerCase()));
    return matchesLetra && matchesSearch;
  });

  // Agrupado por letra para la vista de columnas
  const gruposPorLetra: { [letra: string]: GrupoIndiceInsumo[] } = {};
  filteredIndice.forEach((item) => {
    if (!gruposPorLetra[item.letra]) {
      gruposPorLetra[item.letra] = [];
    }
    gruposPorLetra[item.letra].push(item);
  });

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

  // Filtrado de Insumos (Tabla)
  const filteredInsumos = INSUMOS_PRECIOS.filter((i) => {
    const matchesTipo = selectedTipoInsumo === 'ALL' || i.tipo === selectedTipoInsumo;
    const matchesSearch =
      !search ||
      i.codigo.toLowerCase().includes(search.toLowerCase()) ||
      i.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      i.grupo.toLowerCase().includes(search.toLowerCase()) ||
      (i.pagina && i.pagina.includes(search)) ||
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calculator className="w-7 h-7 text-indigo-600" />
            Módulo de Costos Directos & Precios Unitarios
          </h1>
          <p className="text-sm text-slate-500">
            Base de datos referencial de precios de insumos (Pág. 3.01 a 3.31), partidas OE/HU y análisis de precios unitarios (APU)
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

      {/* Navegación por Pestañas Principales */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('insumos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'insumos'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          3. Precios de Insumos (Materiales, Mano de Obra, Equipos)
        </button>

        <button
          onClick={() => setActiveTab('valorm2')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'valorm2'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          4. Análisis de Precios Unitarios (APU)
        </button>
      </div>

      {/* Barra de Búsqueda Dinámica */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'insumos'
                ? "Buscar grupo o página (ej. Abrazadera, Cemento, Travex, 3.17, 3.23...)"
                : "Buscar por código, descripción, material, etc..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-medium"
          />
        </div>

        {activeTab === 'insumos' && (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setVistaInsumos('indice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  vistaInsumos === 'indice'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                Directorio por Grupos (Pág 3.1 - 3.31)
              </button>
              <button
                onClick={() => setVistaInsumos('tabla')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  vistaInsumos === 'tabla'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Tabla Detallada con Precios S/
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONTENIDO TAB: 3. PRECIOS DE INSUMOS (MATERIALES - MANO DE OBRA - EQUIPOS) */}
      {activeTab === 'insumos' && (
        <div className="space-y-6">
          {/* BANNER IDENTICO AL DEL DOCUMENTO CON NÚMERO 3 AZUL */}
          <div className="bg-sky-500 rounded-2xl p-6 text-white shadow-md flex items-center gap-6">
            <div className="w-20 h-20 bg-sky-700 rounded-2xl flex items-center justify-center text-white font-black text-5xl shrink-0 shadow-inner border border-sky-400/30">
              3
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                PRECIOS DE INSUMOS
              </h2>
              <p className="text-sm font-bold text-sky-100 uppercase tracking-wide mt-0.5">
                MATERIALES DE CONSTRUCCIÓN - MANO DE OBRA - EQUIPOS
              </p>
              <p className="text-xs text-sky-200 mt-1">
                Catálogo general de costos de insumos clasificados por grupos de la A a la Z (Páginas 3.01 a 3.31)
              </p>
            </div>
          </div>

          {/* VISTA 1: DIRECTORIO E ÍNDICE DE GRUPOS EXACTAMENTE COMO EN LA FOTO */}
          {vistaInsumos === 'indice' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Barra de Filtro Rápido por Letra A-Z */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Filtrar Letra:</span>
                <button
                  onClick={() => setSelectedLetra('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedLetra === 'ALL'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  TODOS
                </button>
                {letrasDisponibles.map((letra) => (
                  <button
                    key={letra}
                    onClick={() => setSelectedLetra(letra)}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition-all flex items-center justify-center ${
                      selectedLetra === letra
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {letra}
                  </button>
                ))}
              </div>

              {/* Columnas del Directorio (GRUPO | PAG.) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(gruposPorLetra)
                  .sort()
                  .map((letra) => (
                    <div
                      key={letra}
                      className="bg-slate-50/60 rounded-2xl border border-slate-200 overflow-hidden flex flex-col"
                    >
                      {/* Cabecera de Columna Azul estilo CAPECO */}
                      <div className="bg-sky-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                        <span>GRUPO</span>
                        <span>PAG.</span>
                      </div>

                      <div className="p-3">
                        <div className="text-base font-black text-sky-700 px-2 py-1 mb-1 border-b border-sky-200/60 flex items-center justify-between">
                          <span>{letra}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {gruposPorLetra[letra].length} grupos
                          </span>
                        </div>

                        <div className="divide-y divide-slate-200/60">
                          {gruposPorLetra[letra].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                const matched = INSUMOS_PRECIOS.filter(
                                  (i) => i.grupo === item.grupo || i.pagina === item.pagina
                                );
                                setSelectedGrupoModal(item);
                              }}
                              className="py-2 px-2 hover:bg-sky-100/50 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs group"
                            >
                              <div className="flex-1">
                                <span className="font-bold text-slate-800 group-hover:text-sky-700 transition-colors block text-[11px]">
                                  {item.grupo}
                                </span>
                                {item.descripcion && (
                                  <span className="text-[10px] text-slate-400 block line-clamp-1">
                                    {item.descripcion}
                                  </span>
                                )}
                              </div>
                              <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded text-[11px] shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                {item.pagina}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VISTA 2: TABLA DETALLADA CON PRECIOS S/ SIN IGV Y CON IGV */}
          {vistaInsumos === 'tabla' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-wide">
                    TABLA DETALLADA DE PRECIOS DE INSUMOS & MATERIALES
                  </h3>
                  <p className="text-xs text-slate-300">
                    Incluye precios referenciales en Soles (S/) sin IGV y con IGV para presupuestos
                  </p>
                </div>
                <span className="text-xs bg-sky-600 text-white font-mono px-3 py-1 rounded-lg font-bold">
                  {filteredInsumos.length} Insumos Registrados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-3 px-4 w-24 text-center">CÓDIGO</th>
                      <th className="py-3 px-4">DESCRIPCIÓN DEL INSUMO</th>
                      <th className="py-3 px-4">GRUPO</th>
                      <th className="py-3 px-4 text-center w-16">PÁG.</th>
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
                          {i.marca && <span className="text-slate-400 font-normal ml-1">({i.marca})</span>}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 text-[11px]">
                          {i.grupo}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-sky-600">
                          {i.pagina || '3.01'}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-500">
                          {i.unidad}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                          S/ {i.precioSinIgv.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-extrabold text-sky-700 bg-sky-50/40">
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
      )}

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

      {/* CONTENIDO TAB 4: ANÁLISIS DE PRECIOS UNITARIOS (APU) */}
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

      {/* MODAL DETALLE DE GRUPO SELECCIONADO */}
      {selectedGrupoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-black text-lg">
                  {selectedGrupoModal.letra}
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-wide">
                    {selectedGrupoModal.grupo}
                  </h3>
                  <p className="text-xs text-sky-100 font-mono font-bold">
                    Catálogo CAPECO — Página {selectedGrupoModal.pagina}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGrupoModal(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-sky-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Descripción del Grupo / Partidas Incluidas
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedGrupoModal.descripcion}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-2">Insumos Registrados en este Grupo:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {INSUMOS_PRECIOS.filter(
                    (i) => i.grupo === selectedGrupoModal.grupo || i.pagina === selectedGrupoModal.pagina
                  ).length > 0 ? (
                    INSUMOS_PRECIOS.filter(
                      (i) => i.grupo === selectedGrupoModal.grupo || i.pagina === selectedGrupoModal.pagina
                    ).map((ins) => (
                      <div
                        key={ins.codigo}
                        className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{ins.descripcion}</div>
                          <div className="text-[11px] text-slate-500">
                            Und: {ins.unidad} | Prov: {ins.proveedor || ins.marca || 'Estándar'}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-slate-400">Precio con IGV</div>
                          <div className="text-sm font-black text-sky-700 font-mono">
                            S/ {ins.precioConIgv.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-slate-50 text-slate-500 text-center rounded-xl">
                      Grupo referenciado en el catálogo (Pág. {selectedGrupoModal.pagina}). Puedes cotizarlo usando el botón en Cotizaciones.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/cotizaciones/nueva"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Cotizar este Grupo
                </Link>
                <button
                  onClick={() => setSelectedGrupoModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
