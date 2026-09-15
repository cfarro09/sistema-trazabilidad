'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  ShieldCheck,
  CreditCard,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
} from 'lucide-react';
import Modal from '@/components/Modal';

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    ruc: '',
    razonSocial: '',
    nombreComercial: '',
    representanteLegal: '',
    dniRepresentante: '',
    direccion: '',
    telefono: '',
    email: '',
    banco: 'BANCO BBVA PERÚ',
    cci: '',
  });

  const fetchEmpresas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/empresas');
      const data = await res.json();
      if (data.success) {
        setEmpresas(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchEmpresas();
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
            <Building2 className="w-7 h-7 text-blue-600" />
            Empresas del Grupo (3 Postores)
          </h1>
          <p className="text-sm text-slate-500">
            Administración de personerías jurídicas, RNP, Ficha RUC SUNAT y cuentas CCI
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Registrar Empresa
        </button>
      </div>

      {/* Grid de Empresas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 p-12 text-center text-slate-400">Cargando empresas...</div>
        ) : (
          empresas.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> RNP Vigente
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {emp.razonSocial}
                  </h3>
                  <div className="text-xs font-mono font-bold text-blue-600 mt-0.5">
                    RUC: {emp.ruc}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Rep. Legal:</span>{' '}
                      {emp.representanteLegal}
                      <div className="text-[10px] text-slate-400">DNI: {emp.dniRepresentante}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{emp.direccion}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-slate-800">{emp.banco || 'BBVA'}:</span>{' '}
                      <span className="font-mono text-[11px]">{emp.cci || '011-175-...'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer con conteo de servicios */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {emp._count?.servicios || 0} Servicios Registrados
                </span>
                <span className="text-blue-600 font-bold hover:underline cursor-pointer">
                  Ver Documentos →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Registrar Empresa */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar Empresa Postulante"
        subtitle="Ingresa los datos tributarios y legales de la nueva empresa"
        maxWidth="xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">RUC</label>
              <input
                type="text"
                required
                placeholder="Ej. 20509152129"
                value={formData.ruc}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Razón Social</label>
              <input
                type="text"
                required
                placeholder="Ej. ANDEAN TRADING COMPANY S.A.C."
                value={formData.razonSocial}
                onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Representante Legal</label>
              <input
                type="text"
                required
                placeholder="Ej. JESUS DINA REYES GONZALES"
                value={formData.representanteLegal}
                onChange={(e) => setFormData({ ...formData, representanteLegal: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">DNI Representante</label>
              <input
                type="text"
                required
                placeholder="Ej. 10040323"
                value={formData.dniRepresentante}
                onChange={(e) => setFormData({ ...formData, dniRepresentante: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Fiscal</label>
            <input
              type="text"
              required
              placeholder="Ej. Pj. Velarde Nro. 165 Dpto. 104 - Lima"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Banco</label>
              <input
                type="text"
                placeholder="Ej. BANCO BBVA PERÚ / BCP"
                value={formData.banco}
                onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Código Cuenta Interbancario (CCI)</label>
              <input
                type="text"
                placeholder="Ej. 01117500020030045178"
                value={formData.cci}
                onChange={(e) => setFormData({ ...formData, cci: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
            >
              Guardar Empresa
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
