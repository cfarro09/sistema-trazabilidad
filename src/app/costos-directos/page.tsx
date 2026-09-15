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
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Truck,
} from 'lucide-react';
import {
  VALOR_M2_GRUPOS,
  PARTIDAS_PRESUPUESTO,
  PARTIDAS_OE_HU,
  INSUMOS_PRECIOS,
  INDICE_GRUPOS_INSUMOS,
  PROVEEDORES_DIRECTORIO,
  APU_CATALOGO,
  ValorM2Grupo,
  PartidaPresupuesto,
  PartidaUnitarioOEHU,
  InsumoPrecio,
  GrupoIndiceInsumo,
  ProveedorInfo,
  APUItem,
} from '@/lib/costos-directos-data';

export default function CostosDirectosPage() {
  const [activeTab, setActiveTab] = useState<'insumos' | 'valorm2' | 'partidas' | 'apu' | 'proveedores'>('insumos');
  const [search, setSearch] = useState('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<string>('ALL');
  const [selectedTipoInsumo, setSelectedTipoInsumo] = useState<string>('ALL');
  const [selectedLetra, setSelectedLetra] = useState<string>('ALL');
  const [vistaInsumos, setVistaInsumos] = useState<'tabla' | 'indice'>('tabla');
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

  // Filtrado de Partidas Unitarias OE & HU
  const filteredPartidasOEHU = PARTIDAS_OE_HU.filter((p) => {
    const matchesEspecialidad =
      selectedEspecialidad === 'ALL' || p.especialidad === selectedEspecialidad;
    const matchesSearch =
      !search ||
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.partida.toLowerCase().includes(search.toLowerCase()) ||
      p.subcategoria.toLowerCase().includes(search.toLowerCase()) ||
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

  // Filtrado de Proveedores
  const filteredProveedores = PROVEEDORES_DIRECTORIO.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(term) ||
      (p.direccion && p.direccion.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      p.pagina.includes(term)
    );
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

  // Totales de Valor m2
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
            Base técnica completa: Suplemento Técnico Marzo 2025 • Costos Perú • TC: S/ 3.683 por US$ 1.00
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
          1. Valor m² de Construcción & Presupuesto (35 Grupos)
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
          <Wrench className="w-4 h-4" />
          4. Análisis de Precios Unitarios (APU)
        </button>

        <button
          onClick={() => setActiveTab('proveedores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'proveedores'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-4 h-4" />
          Directorio Proveedores
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'insumos'
                ? 'Buscar material, perno, cemento, ladrillo, pág...'
                : activeTab === 'partidas'
                ? 'Buscar partida OE/HU, excavación, concreto...'
                : activeTab === 'proveedores'
                ? 'Buscar proveedor, contacto, dirección...'
                : 'Buscar grupo, partida...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Filtros específicos según pestaña */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {activeTab === 'insumos' && (
            <>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setVistaInsumos('tabla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    vistaInsumos === 'tabla'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Catálogo con Precios
                </button>
                <button
                  onClick={() => setVistaInsumos('indice')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    vistaInsumos === 'indice'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  Índice A - Z (Págs 3.1 - 3.31)
                </button>
              </div>

              {vistaInsumos === 'tabla' && (
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedTipoInsumo}
                    onChange={(e) => setSelectedTipoInsumo(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">Todos los Tipos</option>
                    <option value="MATERIAL">Materiales</option>
                    <option value="MANO_DE_OBRA">Mano de Obra (CAPECO)</option>
                    <option value="EQUIPO">Maquinaria y Equipos</option>
                  </select>
                </div>
              )}
            </>
          )}

          {(activeTab === 'partidas' || activeTab === 'apu') && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedEspecialidad}
                onChange={(e) => setSelectedEspecialidad(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Todas las Especialidades</option>
                <option value="OE">OE - Obras de Edificación</option>
                <option value="HU">HU - Habilitación Urbana</option>
                <option value="ARQUITECTURA">Arquitectura</option>
                <option value="ESTRUCTURAS">Estructuras</option>
                <option value="SANITARIAS">Inst. Sanitarias</option>
                <option value="ELECTRICAS">Inst. Eléctricas</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* CONTENIDO TAB 3: PRECIOS DE INSUMOS */}
      {activeTab === 'insumos' && (
        <div className="space-y-6">
          {/* Banner Oficial Sección 3 */}
          <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-5 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-3xl border border-white/20">
                3
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-sky-200">
                  SECCIÓN 3 • SUPLEMENTO TÉCNICO MARZO 2025
                </span>
                <h2 className="text-lg font-black tracking-tight">
                  PRECIOS DE RECURSOS & INSUMOS (Páginas 3.01 a 3.31)
                </h2>
                <p className="text-xs text-sky-100 mt-0.5">
                  Materiales de Construcción • Mano de Obra (CAPECO) • Tarifas Alquiler Maquinaria Pesada
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 bg-white/20 rounded-xl text-xs font-bold font-mono">
                {vistaInsumos === 'tabla' ? `${filteredInsumos.length} Insumos` : `${filteredIndice.length} Grupos A-Z`}
              </span>
            </div>
          </div>

          {/* VISTA 1: TABLA DE PRECIOS DETALLADOS */}
          {vistaInsumos === 'tabla' ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-3 px-4 w-28 text-center">CÓDIGO</th>
                      <th className="py-3 px-4">DESCRIPCIÓN DEL INSUMO / RECURSO</th>
                      <th className="py-3 px-4 w-36">GRUPO / PROVEEDOR</th>
                      <th className="py-3 px-4 text-center w-16">PÁG.</th>
                      <th className="py-3 px-4 text-center w-16">UND</th>
                      <th className="py-3 px-4 text-right w-28">P. SIN IGV</th>
                      <th className="py-3 px-4 text-right w-28">INC. IGV</th>
                      <th className="py-3 px-4 text-center w-24">COPIAR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredInsumos.map((i) => (
                      <tr key={i.codigo} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-sky-700 bg-slate-50/50">
                          {i.codigo}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="font-bold text-slate-900 block">{i.descripcion}</span>
                          {i.marca && (
                            <span className="text-[10px] text-slate-400 font-semibold">Marca: {i.marca}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="text-[11px] font-bold text-slate-700 block">{i.grupo}</span>
                          {i.proveedor && (
                            <span className="text-[10px] text-blue-600 block line-clamp-1">🏢 {i.proveedor}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded">
                            {i.pagina || '3.X'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-500">
                          {i.unidad}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                          {i.moneda === 'USD' ? '$' : 'S/'} {i.precioSinIgv.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-black text-sky-700 bg-sky-50/30">
                          {i.moneda === 'USD' ? '$' : 'S/'} {i.precioConIgv.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() =>
                              handleCopy(
                                `${i.descripcion} | Und: ${i.unidad} | ${i.moneda === 'USD' ? '$' : 'S/'} ${i.precioSinIgv}`,
                                i.codigo
                              )
                            }
                            className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold inline-flex items-center gap-1"
                          >
                            {copiedCode === i.codigo ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedCode === i.codigo ? 'Listo' : 'Copiar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* VISTA 2: ÍNDICE DE LA A A LA Z */
            <div className="space-y-4">
              {/* Barra de Letras A-Z */}
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1 items-center shadow-xs">
                <button
                  onClick={() => setSelectedLetra('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    selectedLetra === 'ALL'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  TODOS
                </button>
                {letrasDisponibles.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLetra(l)}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                      selectedLetra === l
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Columnas de Directorio */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(gruposPorLetra).sort().map((letra) => (
                  <div
                    key={letra}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                  >
                    <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center font-black text-xs text-white">
                          {letra}
                        </span>
                        <span className="font-extrabold text-xs tracking-wider">GRUPO {letra}</span>
                      </div>
                      <span className="text-[10px] text-slate-300 font-mono">
                        {gruposPorLetra[letra].length} grupos
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {gruposPorLetra[letra].map((g, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSearch(g.grupo);
                            setVistaInsumos('tabla');
                          }}
                          className="p-3 hover:bg-sky-50/60 cursor-pointer transition-colors flex items-center justify-between gap-2 group"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700 block">
                              {g.grupo}
                            </span>
                            {g.descripcion && (
                              <span className="text-[11px] text-slate-500 block line-clamp-1">
                                {g.descripcion}
                              </span>
                            )}
                          </div>
                          <span className="shrink-0 px-2 py-1 bg-slate-100 group-hover:bg-sky-100 text-slate-700 group-hover:text-sky-800 text-[10px] font-mono font-bold rounded-lg border border-slate-200">
                            Pág. {g.pagina}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO TAB 1: VALOR M2 DE CONSTRUCCIÓN & PRESUPUESTO */}
      {activeTab === 'valorm2' && (
        <div className="space-y-6">
          {/* TABLA PRINCIPAL: 35 GRUPOS DE PARTIDA OFICIALES */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">
                  1. VALOR m² DE CONSTRUCCIÓN — TIPOLOGÍA A: VIVIENDA UNIFAMILIAR ECONÓMICA
                </h3>
                <p className="text-xs text-indigo-200">
                  Total Modelo: S/. 1,654.37 / m² ($ 449.19 / m²) • Costo Directo Total: S/ 330,873.03 (200 m² techados)
                </p>
              </div>
              <span className="text-xs bg-indigo-500/30 text-indigo-200 font-mono px-3 py-1 rounded-lg border border-indigo-400/20 font-bold">
                {VALOR_M2_GRUPOS.length} GRUPOS OFICIALES
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
                      TOTAL GENERAL COSTO DIRECTO
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

          {/* TABLA 2: PRESUPUESTO DETALLADO POR METRADOS (PÁGINAS 1.2 Y 1.3) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">
                  PRESUPUESTO DESGLOSADO POR METRADOS Y PRECIOS UNITARIOS
                </h3>
                <p className="text-xs text-slate-300">
                  Desglose de partidas 01 a 20 con metrado, P.U. y subtotal parcial
                </p>
              </div>
              <span className="text-xs bg-slate-700 font-mono px-3 py-1 rounded-lg">
                {filteredPartidasPresupuesto.length} Ítems Desglosados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 w-20 text-center">ITEM</th>
                    <th className="py-3 px-4">PARTIDA</th>
                    <th className="py-3 px-4 text-center w-16">UND</th>
                    <th className="py-3 px-4 text-right w-24">METRADO</th>
                    <th className="py-3 px-4 text-right w-28">PRECIO (S/)</th>
                    <th className="py-3 px-4 text-right w-32">PARCIAL (S/)</th>
                    <th className="py-3 px-4 text-center w-24">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPartidasPresupuesto.map((p) => (
                    <tr key={p.item} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-600 bg-slate-50/50">
                        {p.item}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">
                        {p.partida}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-500">
                        {p.unidad}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                        {p.metrado.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-indigo-700 bg-indigo-50/20">
                        S/ {p.precioUnitario.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-black text-slate-900">
                        S/ {p.parcial.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => handleCopy(`${p.partida} | Metrado: ${p.metrado} ${p.unidad} | S/ ${p.precioUnitario}`, p.item)}
                          className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold inline-flex items-center gap-1"
                        >
                          {copiedCode === p.item ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedCode === p.item ? 'Listo' : 'Copiar'}
                        </button>
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
                Desglose oficial de Mano de Obra (M.O.), Materiales (MAT.) y Equipos (EQU.) por unidad de medida
              </p>
            </div>
            <span className="text-xs bg-indigo-500/30 text-indigo-200 font-mono px-3 py-1 rounded-lg border border-indigo-400/20 font-bold">
              {filteredPartidasOEHU.length} PARTIDAS DISPONIBLES
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-28 text-center">CÓDIGO</th>
                  <th className="py-3 px-4">DESCRIPCIÓN DE LA PARTIDA</th>
                  <th className="py-3 px-4 w-36">SUBCATEGORÍA</th>
                  <th className="py-3 px-4 text-center w-14">UND</th>
                  <th className="py-3 px-4 text-right w-20">M.O. (S/)</th>
                  <th className="py-3 px-4 text-right w-20">MAT. (S/)</th>
                  <th className="py-3 px-4 text-right w-20">EQU. (S/)</th>
                  <th className="py-3 px-4 text-right w-28">P.U. TOTAL (S/)</th>
                  <th className="py-3 px-4 text-center w-24">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPartidasOEHU.map((p) => (
                  <tr key={p.codigo} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-700 bg-slate-50">
                      {p.codigo}
                    </td>
                    <td className="py-2.5 px-4 text-slate-900 font-bold">
                      {p.partida}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                      {p.subcategoria}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-500">
                      {p.unidad}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {p.manoDeObra > 0 ? p.manoDeObra.toFixed(2) : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {p.materiales > 0 ? p.materiales.toFixed(2) : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {p.equipos > 0 ? p.equipos.toFixed(2) : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-black text-indigo-700 bg-indigo-50/30">
                      S/ {p.precioUnitario.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => handleCopy(`${p.partida} | Und: ${p.unidad} | S/ ${p.precioUnitario}`, p.codigo)}
                        className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold inline-flex items-center gap-1"
                      >
                        {copiedCode === p.codigo ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedCode === p.codigo ? 'Listo' : 'Copiar'}
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
                    <span className="text-[10px] text-slate-400 block uppercase">Costo Unitario Total</span>
                    <span className="text-lg font-mono font-black text-emerald-400">
                      S/ {apu.costoUnitarioTotal.toFixed(2)} / {apu.unidad}
                    </span>
                    <span className="text-[10px] text-indigo-200 block font-mono">
                      Rend: {apu.rendimiento}
                    </span>
                  </div>
                </div>

                {/* Tablas Desglosadas */}
                <div className="p-4 space-y-4">
                  {/* Mano de Obra */}
                  {apu.manoDeObra.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <HardHat className="w-3.5 h-3.5 text-amber-600" /> Mano de Obra
                      </h5>
                      <div className="overflow-x-auto border border-slate-100 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold text-[10px]">
                            <tr>
                              <th className="py-2 px-3">Recurso</th>
                              <th className="py-2 px-3 text-center">Cuadrilla</th>
                              <th className="py-2 px-3 text-center">Und</th>
                              <th className="py-2 px-3 text-right">Cantidad</th>
                              <th className="py-2 px-3 text-right">Precio S/</th>
                              <th className="py-2 px-3 text-right">Parcial S/</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {apu.manoDeObra.map((m, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2 px-3 font-bold text-slate-800">{m.recurso}</td>
                                <td className="py-2 px-3 text-center font-mono">{m.cuadrilla.toFixed(2)}</td>
                                <td className="py-2 px-3 text-center font-mono">{m.unidad}</td>
                                <td className="py-2 px-3 text-right font-mono">{m.cantidad.toFixed(4)}</td>
                                <td className="py-2 px-3 text-right font-mono">S/ {m.precio.toFixed(2)}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                  S/ {m.parcial.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Materiales */}
                  {apu.materiales.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Hammer className="w-3.5 h-3.5 text-blue-600" /> Materiales
                      </h5>
                      <div className="overflow-x-auto border border-slate-100 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold text-[10px]">
                            <tr>
                              <th className="py-2 px-3">Recurso</th>
                              <th className="py-2 px-3 text-center">Und</th>
                              <th className="py-2 px-3 text-right">Cantidad</th>
                              <th className="py-2 px-3 text-right">Precio S/</th>
                              <th className="py-2 px-3 text-right">Parcial S/</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {apu.materiales.map((mat, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2 px-3 font-bold text-slate-800">{mat.recurso}</td>
                                <td className="py-2 px-3 text-center font-mono">{mat.unidad}</td>
                                <td className="py-2 px-3 text-right font-mono">{mat.cantidad.toFixed(4)}</td>
                                <td className="py-2 px-3 text-right font-mono">S/ {mat.precio.toFixed(2)}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                  S/ {mat.parcial.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Equipos */}
                  {apu.equipos.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-indigo-600" /> Equipos y Herramientas
                      </h5>
                      <div className="overflow-x-auto border border-slate-100 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold text-[10px]">
                            <tr>
                              <th className="py-2 px-3">Recurso</th>
                              <th className="py-2 px-3 text-center">Cuadrilla</th>
                              <th className="py-2 px-3 text-center">Und</th>
                              <th className="py-2 px-3 text-right">Cantidad</th>
                              <th className="py-2 px-3 text-right">Precio S/</th>
                              <th className="py-2 px-3 text-right">Parcial S/</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {apu.equipos.map((eq, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2 px-3 font-bold text-slate-800">{eq.recurso}</td>
                                <td className="py-2 px-3 text-center font-mono">{eq.cuadrilla.toFixed(2)}</td>
                                <td className="py-2 px-3 text-center font-mono">{eq.unidad}</td>
                                <td className="py-2 px-3 text-right font-mono">{eq.cantidad.toFixed(4)}</td>
                                <td className="py-2 px-3 text-right font-mono">S/ {eq.precio.toFixed(2)}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                  S/ {eq.parcial.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 5: DIRECTORIO DE PROVEEDORES (PÁGINAS 3.3 Y 3.4) */}
      {activeTab === 'proveedores' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold">DIRECTORIO DE PROVEEDORES & EMPRESAS COLABORADORAS</h3>
              <p className="text-xs text-slate-300">
                Páginas 3.3 y 3.4 del Suplemento Técnico: datos de contacto, teléfonos y enlaces
              </p>
            </div>
            <span className="text-xs bg-slate-700 px-3 py-1 rounded-lg font-bold font-mono">
              {filteredProveedores.length} Empresas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProveedores.map((p, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{p.nombre}</h4>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold rounded">
                    Pág. {p.pagina}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  {p.direccion && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{p.direccion}</span>
                    </div>
                  )}
                  {p.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{p.telefono}</span>
                    </div>
                  )}
                  {p.celular && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Cel. {p.celular}</span>
                    </div>
                  )}
                  {p.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </div>
                  )}
                  {p.web && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="text-sky-600 font-semibold truncate">{p.web}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
