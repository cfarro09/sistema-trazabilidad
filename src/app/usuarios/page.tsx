import React from 'react';
import { prisma } from '@/lib/prisma';
import { UserCheck, Shield, User, Plus, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-blue-600" />
            Mantenimiento de Usuarios & Permisos
          </h1>
          <p className="text-sm text-slate-500">
            Control de accesos y roles para el equipo de licitaciones y logística
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5">Usuario</th>
              <th className="px-6 py-3.5">Correo Electrónico</th>
              <th className="px-6 py-3.5">Rol de Acceso</th>
              <th className="px-6 py-3.5">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {u.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {u.email}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                      u.role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Activo
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
