import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../services/api";
import type { Product } from "../types/product.types";
import type { Category } from "../types/category.types";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";

const emptyForm = {
  name: "",
  barcode: "",
  category_id: "",
  price: "",
  cost: "",
  stock: "",
  min_stock: "5",
  image_url: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      barcode: product.barcode || "",
      category_id: product.category_id ? String(product.category_id) : "",
      price: String(product.price),
      cost: String(product.cost),
      stock: String(product.stock),
      min_stock: String(product.min_stock ?? 5),
      image_url: product.image_url || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      category_id: form.category_id || null,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
      min_stock: Number(form.min_stock),
    };

    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post("/products", payload);
    }

    setModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    await api.delete(`/products/${product.id}`);
    fetchProducts();
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.includes(search)
  );

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Administra tu catálogo e inventario"
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        }
      />

      <Card>
        <div className="border-b border-slate-100 p-4">
          <Input
            placeholder="Buscar por nombre o código de barras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3 text-right">Precio</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{product.name}</td>
                  <td className="px-5 py-3 text-slate-500">{product.category_name || "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{product.barcode || "—"}</td>
                  <td className="px-5 py-3 text-right text-slate-700">${Number(product.price).toFixed(2)}</td>
                  <td className="px-5 py-3 text-right">
                    <Badge tone={product.stock <= (product.min_stock ?? 5) ? "amber" : "slate"}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar producto" : "Nuevo producto"}
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nombre"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Código de barras"
            value={form.barcode}
            onChange={(e) => setForm({ ...form, barcode: e.target.value })}
          />

          <Select
            label="Categoría"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Input
            label="URL de imagen"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />

          <Input
            label="Precio de venta"
            type="number"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            label="Costo"
            type="number"
            step="0.01"
            required
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />

          <Input
            label="Stock actual"
            type="number"
            required
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <Input
            label="Stock mínimo"
            type="number"
            required
            value={form.min_stock}
            onChange={(e) => setForm({ ...form, min_stock: e.target.value })}
          />

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingId ? "Guardar cambios" : "Crear producto"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
