'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { Copy, Building2, Calendar, Percent, Sparkles, Check, ArrowRight, Edit3, Eye, Loader2 } from 'lucide-react';

interface DuplicateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: {
    id: string;
    numero: string;
    objetoServicio?: string;
    entidad?: string;
    empresaId: string;
    empresa?: { id: string; razonSocial: string; ruc: string };
    montoTotal?: number;
    montoCostoDirecto?: number;
    fecha?: string | Date;
  } | null;
  onDuplicated?: (newQuoteIds: string[]) => void;
}

interface Company {
  id: string;
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
}

interface TargetConfig {
  selected: boolean;
  variacion: number; // porcentaje ej. 0, 2.5, -3
}

export default function DuplicateQuoteModal({
  isOpen,
  onClose,
  quote,
  onDuplicated,
}: DuplicateQuoteModalProps) {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [targetConfigs, setTargetConfigs] = useState<Record<string, TargetConfig>>({});
  const [fecha, setFecha] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar empresas al abrir el modal
  useEffect(() => {
    if (!isOpen) return;

    // Fecha por defecto: hoy
    const today = new Date().toISOString().substring(0, 10);
    setFecha(today);
    setErrorMessage('');

    setLoadingCompanies(true);
    fetch('/api/empresas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCompanies(data.data);

          // Inicializar selección: preseleccionar las otras empresas no emisoras
          const initialConfigs: Record<string, TargetConfig> = {};
          data.data.forEach((c: Company) => {
            const isCurrent = quote?.empresaId === c.id;
            initialConfigs[c.id] = {
              selected: !isCurrent, // seleccionar las otras empresas
              variacion: 0,
            };
          });
          setTargetConfigs(initialConfigs);
        }
      })
      .catch((err) => {
        console.error('Error cargando empresas:', err);
        setErrorMessage('No se pudieron cargar las empresas.');
      })
      .finally(() => setLoadingCompanies(false));
  }, [isOpen, quote]);

  if (!quote) return null;

  const baseTotal = quote.montoTotal || 0;

  const toggleSelect = (companyId: string) => {
    setTargetConfigs((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        selected: !prev[companyId]?.selected,
      },
    }));
  };

  const setVariacion = (companyId: string, val: number) => {
    setTargetConfigs((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        variacion: val,
      },
    }));
  };

  const selectAllOthers = () => {
    setTargetConfigs((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((cId) => {
        next[cId] = {
          ...next[cId],
          selected: cId !== quote.empresaId,
        };
      });
      return next;
    });
  };

  const selectedCount = Object.values(targetConfigs).filter((cfg) => cfg.selected).length;

  const handleDuplicate = async (mode: 'view' | 'edit' = 'view') => {
    if (selectedCount === 0) {
      setErrorMessage('Selecciona al menos una empresa destino para generar la cotización.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const targetEmpresas = Object.entries(targetConfigs)
        .filter(([_, cfg]) => cfg.selected)
        .map(([cId, cfg]) => ({
          empresaId: cId,
          variacionPorcentaje: cfg.variacion || 0,
        }));

      const res = await fetch(`/api/cotizaciones/${quote.id}/duplicar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmpresas,
          fecha,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al duplicar la cotización');
      }

      const createdQuotes = data.data?.createdQuotes || [];
      const newIds = createdQuotes.map((q: any) => q.id);

      if (onDuplicated) {
        onDuplicated(newIds);
      }

      onClose();

      if (createdQuotes.length === 1) {
        const singleId = createdQuotes[0].id;
        if (mode === 'edit') {
          router.push(`/cotizaciones/nueva?edit=${singleId}`);
        } else {
          router.push(`/cotizaciones/${singleId}`);
        }
      } else {
        alert(
          `¡Éxito! Se generaron ${createdQuotes.length} nuevas cotizaciones:\n\n` +
            createdQuotes
              .map((q: any) => `• ${q.numero} (${q.empresa?.razonSocial || 'Empresa'}) - Total: S/ ${Number(q.montoTotal).toFixed(2)}`)
              .join('\n')
        );
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error al procesar la duplicación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📑 Duplicar Cotización para tus Empresas"
      subtitle="Genera cotizaciones oficiales con las mismas partidas y condiciones para presentar con tus otras razones sociales."
      maxWidth="3xl"
    >
      <div className="p-6 space-y-6">
        {/* Resumen de la cotización origen */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Origen: {quote.numero}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {quote.entidad || 'Entidad no especificada'}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium line-clamp-1">
              {quote.objetoServicio || 'Sin descripción'}
            </p>
            <p className="text-2xs text-slate-400">
              Empresa emisora actual: <strong className="text-slate-600">{quote.empresa?.razonSocial || 'Empresa'}</strong>
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block">
              Monto Base
            </span>
            <span className="text-lg font-black text-slate-900 font-mono">
              S/ {baseTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Barra superior de selección rápida y fecha */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAllOthers}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Seleccionar las otras empresas restantes
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Fecha emisión:
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="text-xs font-medium px-2.5 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Lista de Empresas con opciones de variación de precios */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Selecciona la(s) empresa(s) destino y variación de precio:
          </label>

          {loadingCompanies ? (
            <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              Cargando tus empresas...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {companies.map((company) => {
                const isCurrent = quote.empresaId === company.id;
                const config = targetConfigs[company.id] || { selected: false, variacion: 0 };
                const isSelected = config.selected;
                const factor = 1 + (config.variacion || 0) / 100;
                const estimatedTotal = Math.round(baseTotal * factor * 100) / 100;

                return (
                  <div
                    key={company.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/30 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Checkbox y Datos de Empresa */}
                      <label className="flex items-start gap-3 cursor-pointer select-none grow">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(company.id)}
                          className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {company.razonSocial}
                            </span>
                            {isCurrent && (
                              <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                                Empresa actual
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            RUC: {company.ruc}
                          </p>
                        </div>
                      </label>

                      {/* Ajuste de variación y total estimado (si está seleccionada) */}
                      {isSelected && (
                        <div className="flex items-center gap-3 shrink-0 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-2xs font-bold text-slate-500 uppercase">
                                Variación:
                              </span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  value={config.variacion}
                                  onChange={(e) =>
                                    setVariacion(company.id, parseFloat(e.target.value) || 0)
                                  }
                                  className="w-16 text-xs text-right font-bold py-1 px-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <span className="text-xs font-bold text-slate-500">%</span>
                              </div>
                            </div>
                            {/* Presets rápidos */}
                            <div className="flex items-center gap-1">
                              {[0, 1.5, 2.5, 3, -2].map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setVariacion(company.id, p)}
                                  className={`text-2xs px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                                    config.variacion === p
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {p > 0 ? `+${p}%` : `${p}%`}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="border-l border-slate-200 pl-3 text-right">
                            <span className="text-2xs text-slate-400 font-semibold block">
                              Total estimado:
                            </span>
                            <span className="text-xs font-mono font-black text-slate-800">
                              S/ {estimatedTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Footer / Botones */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
            {selectedCount === 1 ? (
              <>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDuplicate('edit')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                  title="Duplica y abre el formulario para ajustar partidas"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Duplicar y Abrir en Editor
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDuplicate('view')}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {submitting ? 'Duplicando...' : 'Duplicar Cotización'}
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={submitting || selectedCount === 0}
                onClick={() => handleDuplicate('view')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {submitting
                  ? 'Duplicando...'
                  : selectedCount === 0
                  ? 'Selecciona al menos 1 empresa'
                  : `Duplicar para las ${selectedCount} Empresas Seleccionadas`}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
