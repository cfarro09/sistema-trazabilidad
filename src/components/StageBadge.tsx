import React from 'react';
import { ServiceStatus } from '@/types';

interface Props {
  status: ServiceStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StageBadge({ status, size = 'md' }: Props) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  switch (status) {
    case 'COTIZACION':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Cotización en Trámite
        </span>
      );
    case 'ACEPTADO_ORDEN':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Orden Asignada (SIAF)
        </span>
      );
    case 'EN_EJECUCION':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          En Ejecución
        </span>
      );
    case 'CONFORME':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Conformidad Emitida
        </span>
      );
    case 'FACTURADO':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          Facturado (Por Cobrar)
        </span>
      );
    case 'PAGADO':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 border border-green-300 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
          Pagado / SIAF Cancelado
        </span>
      );
    case 'RECHAZADO':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          No Adjudicado
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
}
