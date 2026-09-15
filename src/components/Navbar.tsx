'use client';

import React, { useState, useEffect } from 'react';
import { Building, AlertTriangle, Bell, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState('ALL');
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    // Cargar empresas
    fetch('/api/empresas')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEmpresas(data.data);
      })
      .catch(() => {});

    // Cargar alertas de colegiaturas
    fetch('/api/profesionales')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const porVencer = data.data.filter(
            (p: any) => p.estadoVigencia === 'POR_VENCER' || p.estadoVigencia === 'VENCIDO'
          );
          setAlertCount(porVencer.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
      {/* Selector de Empresa Global */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-sm">
          <Building className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Empresa Activa:
          </span>
          <select
            value={selectedEmpresa}
            onChange={(e) => setSelectedEmpresa(e.target.value)}
            className="bg-white border border-slate-300 font-bold text-slate-900 text-xs px-2.5 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">🏢 Todas las Empresas (Grupo)</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.razonSocial} (RUC: {emp.ruc})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Acciones Rápidas & Perfil */}
      <div className="flex items-center gap-4">
        {/* Alerta de Colegiaturas / Vencimientos */}
        {alertCount > 0 ? (
          <Link
            href="/profesionales"
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{alertCount} Colegiatura(s) por revisar</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>RNP y Colegiaturas al día</span>
          </div>
        )}

        <div className="h-6 w-px bg-slate-200"></div>

        {/* Perfil del Usuario */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800">Carlos Administrador</div>
            <div className="text-[10px] text-slate-400">Logística & Licitaciones</div>
          </div>
        </div>
      </div>
    </header>
  );
}
