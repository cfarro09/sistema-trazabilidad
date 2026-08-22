'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Award,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import Modal from '@/components/Modal';

export default function ProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    tipo: 'TECNICO',
    dni: '',
    nombres: '',
    apellidos: '',
    profesion: '',
    institucion: '',
    nroRegistro: '',
    colegiaturaCaducidad: '',
    telefono: '',
    email: '',
  });

  const fetchProfesionales = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profesionales');
      const data = await res.json();
      if (data.success) {
        setProfesionales(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profesionales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchProfesionales();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Banco de Profesionales & Técnicos
          </h1>
          <p className="text-sm text-slate-500">
            Control de personal clave, títulos, constancias de experiencia y semáforo de colegiatura
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Registrar Profesional / Técnico
        </button>
      </div>

      {/* Grid de Profesionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400">Cargando personal...</div>
        ) : (
          profesionales.map((p) => {
            const isVigente = p.estadoVigencia === 'VIGENTE';
            const isPorVencer = p.estadoVigencia === 'POR_VENCER';
            const isVencido = p.estadoVigencia === 'VENCIDO';

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Indicador superior */}
                <div
                  className={`h-1.5 absolute top-0 left-0 right-0 ${
                    isVigente
                      ? 'bg-emerald-500'
                      : isPorVencer
                      ? 'bg-amber-500'
                      : isVencido
                      ? 'bg-rose-500'
                      : 'bg-slate-300'
                  }`}
                ></div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-base border border-indigo-100">
                      {p.tipo === 'INGENIERO' ? 'ING' : 'TEC'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {p.nombres} {p.apellidos}
                      </h3>
                      <div className="text-xs font-semibold text-slate-500">{p.profesion}</div>
                    </div>
                  </div>

                  <span className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-slate-700">
                    DNI: {p.dni}
                  </span>
                </div>

                {/* Semáforo de Colegiatura */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Estado de Colegiatura / Habilidad:</span>
                    {isVigente && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Vigente ({p.diasParaVencer} días)
                      </span>
                    )}
                    {isPorVencer && (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" /> Por Vencer ({p.diasParaVencer} días)
                      </span>
                    )}
                    {isVencido && (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-full text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> Vencido
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center gap-2">
                    <span>Registro / CIP: <strong>{p.nroRegistro || 'S/N'}</strong></span>
                    <span>•</span>
                    <span>
                      Caducidad:{' '}
                      <strong>
                        {p.colegiaturaCaducidad
                          ? new Date(p.colegiaturaCaducidad).toLocaleDateString('es-PE')
                          : 'No especificada'}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Documentos Acreditados */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    Documentos Acreditados en el Sistema ({p.documentos?.length || 0})
                  </span>
                  <div className="space-y-1.5">
                    {p.documentos?.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs border border-slate-100"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{doc.nombre}</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer shrink-0 ml-2">
                          Ver PDF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Nuevo Profesional */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar Nuevo Profesional / Técnico"
        subtitle="Ingresa los datos para incluirlos en las propuestas de licitación"
        maxWidth="xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Personal</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="TECNICO">Técnico Calificado</option>
                <option value="INGENIERO">Ingeniero Colegiado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">DNI</label>
              <input
                type="text"
                required
                placeholder="Ej. 46374328"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombres</label>
              <input
                type="text"
                required
                placeholder="Ej. CARLOS DENY"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Apellidos</label>
              <input
                type="text"
                required
                placeholder="Ej. SANDOVAL FARROÑAN"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Profesión / Especialidad</label>
              <input
                type="text"
                required
                placeholder="Ej. Técnico en Construcción Civil"
                value={formData.profesion}
                onChange={(e) => setFormData({ ...formData, profesion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institución / Colegio</label>
              <input
                type="text"
                placeholder="Ej. IESTP CAPECO / CIP"
                value={formData.institucion}
                onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">N° de Registro / Colegiatura</label>
              <input
                type="text"
                placeholder="Ej. 235541-A-DDOO o CIP 72068"
                value={formData.nroRegistro}
                onChange={(e) => setFormData({ ...formData, nroRegistro: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Caducidad Colegiatura</label>
              <input
                type="date"
                value={formData.colegiaturaCaducidad}
                onChange={(e) =>
                  setFormData({ ...formData, colegiaturaCaducidad: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
            >
              Guardar Profesional
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
