'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Building,
  FileCheck,
  Users,
  FileText,
  Download,
  Sparkles,
  CheckCircle,
  FilePlus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function EmpaquetadorPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>('');

  // Checkboxes Empresa
  const [includeRuc, setIncludeRuc] = useState(true);
  const [includeRnp, setIncludeRnp] = useState(true);
  const [includeCci, setIncludeCci] = useState(true);
  const [includeAnexos, setIncludeAnexos] = useState(true);

  // Profesionales seleccionados
  const [selectedProfIds, setSelectedProfIds] = useState<string[]>([]);

  // Cotización
  const [includeCotizacion, setIncludeCotizacion] = useState(true);
  const [cotizacionData, setCotizacionData] = useState({
    nroCotizacion: '00175-26',
    entidad: 'SUPERINTENDENCIA NACIONAL DE SALUD (SUSALUD)',
    objeto: 'SERVICIO DE PINTADO DE OFICINAS DE ALTA DIRECCIÓN',
    plazo: '10',
    monto: '17,000.00',
  });

  const [compiling, setCompiling] = useState(false);
  const [compiledSuccess, setCompiledSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/empresas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setEmpresas(data.data);
          setSelectedEmpresaId(data.data[0].id);
        }
      });

    fetch('/api/profesionales')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setProfesionales(data.data);
          setSelectedProfIds([data.data[0].id]); // Preselect Carlos Sandoval
        }
      });
  }, []);

  const toggleProf = (id: string) => {
    if (selectedProfIds.includes(id)) {
      setSelectedProfIds(selectedProfIds.filter((p) => p !== id));
    } else {
      setSelectedProfIds([...selectedProfIds, id]);
    }
  };

  const handleCompile = async () => {
    if (!selectedEmpresaId) return;
    setCompiling(true);
    try {
      const res = await fetch('/api/empaquetador/generar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedEmpresaId,
          includeRuc,
          includeRnp,
          includeCci,
          includeAnexos,
          selectedProfessionalIds: selectedProfIds,
          includeCotizacion,
          cotizacionDetails: cotizacionData,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Expediente_Postulacion_${cotizacionData.nroCotizacion}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setCompiledSuccess(true);
        setTimeout(() => setCompiledSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCompiling(false);
    }
  };

  const selectedEmpresa = empresas.find((e) => e.id === selectedEmpresaId);

  // Estimación de páginas
  let totalDocs = 0;
  if (includeCotizacion) totalDocs += 1;
  if (includeRuc) totalDocs += 1;
  if (includeRnp) totalDocs += 1;
  if (includeCci) totalDocs += 1;
  if (includeAnexos) totalDocs += 1;
  totalDocs += selectedProfIds.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Compilador Automático con Foliado Digital
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Empaquetador de Expedientes de Postulación
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl mt-1">
              Selecciona la empresa, los documentos legales, los CVs de técnicos y la propuesta. El
              sistema los unifica en un **PDF único foliado correlativamente (`0001`, `0002`...)**
              listo para presentar a la entidad sin errores ni traspapeleos.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">
              Documentos en el Paquete
            </span>
            <div className="text-3xl font-black text-white mt-0.5">{totalDocs}</div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              ✓ Foliado correlativo activo
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Selección de Componentes */}
        <div className="lg:col-span-2 space-y-6">
          {/* PASO 1: Empresa & Docs Institucionales */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Empresa Postulante & Documentos Base
                </h3>
                <p className="text-xs text-slate-500">Selecciona con qué empresa se postula</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Empresa del Grupo
              </label>
              <select
                value={selectedEmpresaId}
                onChange={(e) => setSelectedEmpresaId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.razonSocial} (RUC: {emp.ruc})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  includeRuc
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeRuc}
                  onChange={(e) => setIncludeRuc(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-bold">Ficha RUC (SUNAT)</div>
                  <div className="text-[10px] text-slate-500">Estado Activo y Habido</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  includeRnp
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeRnp}
                  onChange={(e) => setIncludeRnp(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-bold">Constancia RNP (OSCE)</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Registro Vigente</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  includeCci
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeCci}
                  onChange={(e) => setIncludeCci(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-bold">Carta de Autorización CCI</div>
                  <div className="text-[10px] text-slate-500">{selectedEmpresa?.banco || 'BBVA'}</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  includeAnexos
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeAnexos}
                  onChange={(e) => setIncludeAnexos(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-bold">Declaraciones Juradas (DDJJ)</div>
                  <div className="text-[10px] text-slate-500">Anexos 1, 2 y 3 (Antisoborno)</div>
                </div>
              </label>
            </div>
          </div>

          {/* PASO 2: Personal Clave & Técnicos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Documentación de Técnicos e Ingenieros Clave
                </h3>
                <p className="text-xs text-slate-500">
                  Selecciona los profesionales para adjuntar sus títulos y certificados
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {profesionales.map((p) => {
                const isSelected = selectedProfIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProf(p.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleProf(p.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-1"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {p.tipo}: {p.nombres} {p.apellidos}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono">
                          DNI: {p.dni}
                        </span>
                      </div>
                      <div className="text-slate-600 mt-0.5 font-medium">{p.profesion}</div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span>Registro: {p.nroRegistro || 'En trámite'}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">
                          Colegiatura Vigente (2027)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PASO 3: Cotización Económica */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cotización Ofertada</h3>
                <p className="text-xs text-slate-500">Datos económicos del servicio a postular</p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCotizacion}
                onChange={(e) => setIncludeCotizacion(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span>Incluir Formato de Cotización Económica</span>
            </label>

            {includeCotizacion && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">N° Cotización</label>
                  <input
                    type="text"
                    value={cotizacionData.nroCotizacion}
                    onChange={(e) =>
                      setCotizacionData({ ...cotizacionData, nroCotizacion: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entidad Solicitante</label>
                  <input
                    type="text"
                    value={cotizacionData.entidad}
                    onChange={(e) =>
                      setCotizacionData({ ...cotizacionData, entidad: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monto Ofertado (S/)</label>
                  <input
                    type="text"
                    value={cotizacionData.monto}
                    onChange={(e) =>
                      setCotizacionData({ ...cotizacionData, monto: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Vista Previa y Compilación */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Resumen del Expediente a Compilar
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Postor</span>
                <span className="font-bold text-slate-900 block">
                  {selectedEmpresa?.razonSocial}
                </span>
                <span className="text-slate-500">RUC: {selectedEmpresa?.ruc}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Estructura de Folios Correlativos
                </span>
                <ul className="space-y-1.5 text-slate-700">
                  {includeCotizacion && (
                    <li className="flex items-center justify-between">
                      <span>• Formato de Cotización</span>
                      <span className="font-mono font-bold text-slate-500">Folio 0001</span>
                    </li>
                  )}
                  {includeRuc && (
                    <li className="flex items-center justify-between">
                      <span>• Ficha RUC (SUNAT)</span>
                      <span className="font-mono font-bold text-slate-500">Folio 0002</span>
                    </li>
                  )}
                  {includeRnp && (
                    <li className="flex items-center justify-between">
                      <span>• Constancia RNP (OSCE)</span>
                      <span className="font-mono font-bold text-slate-500">Folio 0003</span>
                    </li>
                  )}
                  {includeCci && (
                    <li className="flex items-center justify-between">
                      <span>• Carta Autorización CCI</span>
                      <span className="font-mono font-bold text-slate-500">Folio 0004</span>
                    </li>
                  )}
                  {includeAnexos && (
                    <li className="flex items-center justify-between">
                      <span>• Anexos DDJJ (1, 2, 3)</span>
                      <span className="font-mono font-bold text-slate-500">Folio 0005</span>
                    </li>
                  )}
                  {selectedProfIds.length > 0 && (
                    <li className="flex items-center justify-between">
                      <span>• CV y Título Personal Clave</span>
                      <span className="font-mono font-bold text-slate-500">Folio 0006</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {compiledSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Expediente PDF generado y descargado!
              </div>
            )}

            <button
              onClick={handleCompile}
              disabled={compiling || totalDocs === 0}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
            >
              <Layers className="w-4 h-4" />
              {compiling ? 'Compilando y Foliando...' : 'Compilar y Descargar PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
