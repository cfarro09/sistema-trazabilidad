'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Shield,
  User,
  Plus,
  Mail,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import Modal from '@/components/Modal';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modales
  const [modalCreateOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const url = search
        ? `/api/usuarios?search=${encodeURIComponent(search)}`
        : '/api/usuarios';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setUsuarios(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [search]);

  // Manejar creación
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setFormData({ name: '', email: '', role: 'ADMIN' });
        fetchUsuarios();
      } else {
        setErrorMsg(data.error || 'Error al registrar usuario');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error en la conexión');
    } finally {
      setSaving(false);
    }
  };

  // Manejar edición
  const handleOpenEdit = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setErrorMsg(null);
    setModalEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/usuarios/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setModalEditOpen(false);
        setSelectedUser(null);
        setFormData({ name: '', email: '', role: 'ADMIN' });
        fetchUsuarios();
      } else {
        setErrorMsg(data.error || 'Error al actualizar usuario');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error en la conexión');
    } finally {
      setSaving(false);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchUsuarios();
      } else {
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch (e) {
      alert('Error de conexión al eliminar');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-blue-600" />
            Mantenimiento de Usuarios & Permisos
          </h1>
          <p className="text-sm text-slate-500">
            Control de accesos, roles y personal autorizado para el sistema de trazabilidad y contrataciones
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ name: '', email: '', role: 'ADMIN' });
            setErrorMsg(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Crear Nuevo Usuario
        </button>
      </div>

      {/* Barra de Filtro / Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <span className="text-xs text-slate-500 font-bold">
          Total: <strong className="text-slate-800">{usuarios.length}</strong> usuarios
        </span>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Usuario</th>
                <th className="px-6 py-3.5">Correo Electrónico</th>
                <th className="px-6 py-3.5">Rol de Acceso</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No se encontraron usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name ? u.name.substring(0, 2).toUpperCase() : 'US'}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="flex items-center gap-1.5 font-mono text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {u.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : u.role === 'SUPERVISOR'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : u.role === 'OPERADOR'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
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
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Editar usuario"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          title="Eliminar usuario"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR USUARIO */}
      <Modal
        isOpen={modalCreateOpen}
        onClose={() => setModalOpen(false)}
        title="Crear Nuevo Usuario"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              placeholder="Ej. Ing. Carlos Mendoza"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              placeholder="Ej. cmendoza@empresa.pe"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rol y Nivel de Acceso</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold"
            >
              <option value="ADMIN">ADMIN — Acceso total y configuraciones</option>
              <option value="SUPERVISOR">SUPERVISOR — Aprobación y seguimiento de contratos</option>
              <option value="OPERADOR">OPERADOR — Registro de cotizaciones y subida de archivos</option>
              <option value="CONSULTA">CONSULTA — Solo lectura de reportes y archivos</option>
            </select>
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
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL EDITAR USUARIO */}
      <Modal
        isOpen={modalEditOpen}
        onClose={() => setModalEditOpen(false)}
        title="Editar Usuario"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              placeholder="Ej. Ing. Carlos Mendoza"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              placeholder="Ej. cmendoza@empresa.pe"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rol y Nivel de Acceso</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-bold"
            >
              <option value="ADMIN">ADMIN — Acceso total y configuraciones</option>
              <option value="SUPERVISOR">SUPERVISOR — Aprobación y seguimiento de contratos</option>
              <option value="OPERADOR">OPERADOR — Registro de cotizaciones y subida de archivos</option>
              <option value="CONSULTA">CONSULTA — Solo lectura de reportes y archivos</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalEditOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
