'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Search,
  Layers,
  Users,
  Building2,
  BarChart3,
  UserCheck,
  FolderArchive,
  ShieldCheck,
  FileText,
  Calculator,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Cotizaciones & Presupuestos', href: '/cotizaciones', icon: FileText, highlight: true },
    { name: 'Costos Directos & Precios', href: '/costos-directos', icon: Calculator, highlight: true },
    { name: 'Trazabilidad & Servicios', href: '/servicios', icon: FileSpreadsheet },
    { name: 'Acreditador de Experiencia', href: '/experiencia', icon: Search, highlight: true },
    { name: 'Empaquetador de Expedientes', href: '/empaquetador', icon: Layers, highlight: true },
    { name: 'Profesionales & Técnicos', href: '/profesionales', icon: Users },
    { name: 'Empresas del Grupo', href: '/empresas', icon: Building2 },
    { name: 'Reportes', href: '/reportes', icon: BarChart3 },
    { name: 'Usuarios', href: '/usuarios', icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight text-base flex items-center gap-1.5">
            OSCE Trazabilidad
          </h1>
          <p className="text-[11px] text-blue-400 font-medium">Contrataciones del Estado</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Gestión Operativa
        </div>

        {navigation.slice(0, 4).map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'
                }`}
              />
              <span className="flex-1 truncate">{item.name}</span>
              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Maestros & Soporte
        </div>

        {navigation.slice(4).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span className="flex-1 truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <FolderArchive className="w-4 h-4 text-emerald-400" />
          <span>Servidor Local Conectado</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">Base: 3 Empresas Activas</div>
      </div>
    </aside>
  );
}
