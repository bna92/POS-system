import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Power } from "lucide-react";
import { api } from "../services/api";
import type { AppUser, UserRole } from "../types/user.types";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  cashier: "Cajero",
  supervisor: "Supervisor",
};

const emptyForm = { name: "", email: "", password: "", role: "cashier" as UserRole };

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (user: AppUser) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const payload: Record<string, unknown> = { name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;
      await api.put(`/users/${editingId}`, payload);
    } else {
      await api.post("/users", form);
    }

    setModalOpen(false);
    fetchUsers();
  };

  const toggleActive = async (user: AppUser) => {
    await api.put(`/users/${user.id}/${user.active ? "deactivate" : "activate"}`);
    fetchUsers();
  };

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle="Administra el acceso al sistema"
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{user.name}</td>
                  <td className="px-5 py-3 text-slate-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <Badge tone="indigo">{roleLabels[user.role] || user.role}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={user.active ? "green" : "slate"}>{user.active ? "Activo" : "Inactivo"}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleActive(user)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                        title={user.active ? "Desactivar" : "Activar"}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar usuario" : "Nuevo usuario"} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label={editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
            type="password"
            required={!editingId}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Select
            label="Rol"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
          >
            <option value="cashier">Cajero</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Administrador</option>
          </Select>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingId ? "Guardar cambios" : "Crear usuario"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
