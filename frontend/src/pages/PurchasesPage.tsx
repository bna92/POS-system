import { useEffect, useState } from "react";
import { ClipboardList, Eye, Plus, Trash2 } from "lucide-react";
import { api } from "../services/api";
import type { Product } from "../types/product.types";
import type { Supplier } from "../types/supplier.types";
import type { Purchase, PurchaseItem } from "../types/purchase.types";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { useAuthStore } from "../store/authStore";

export default function PurchasesPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);

  const fetchPurchases = async () => {
    const res = await api.get("/purchases");
    setPurchases(res.data);
  };

  useEffect(() => {
    api.get("/purchases").then((res) => setPurchases(res.data));
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/suppliers").then((res) => setSuppliers(res.data));
  }, []);

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const addItem = () => {
    if (!productId || !quantity || !cost) return;

    const product = products.find((p) => p.id === Number(productId));
    if (!product) return;

    const qty = Number(quantity);
    const unitCost = Number(cost);

    setItems((prev) => [
      ...prev,
      {
        product_id: product.id,
        product_name: product.name,
        quantity: qty,
        cost: unitCost,
        subtotal: qty * unitCost,
      },
    ]);

    setProductId("");
    setQuantity("");
    setCost("");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!supplierId || items.length === 0) return;

    setSubmitting(true);

    try {
      await api.post("/purchases", {
        supplier_id: Number(supplierId),
        user_id: user?.id,
        total,
        items,
      });

      setSupplierId("");
      setItems([]);
      fetchPurchases();
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (purchase: Purchase) => {
    const res = await api.get(`/purchases/${purchase.id}`);
    setViewingPurchase(res.data);
  };

  const handleDelete = async (purchase: Purchase) => {
    if (!confirm(`¿Eliminar la compra #${purchase.id} por $${Number(purchase.total).toFixed(2)}? Esto revierte el stock que agregó.`)) {
      return;
    }

    await api.delete(`/purchases/${purchase.id}`);
    fetchPurchases();
  };

  return (
    <div>
      <PageHeader title="Compras" subtitle="Registra compras a proveedores" />

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Nueva compra</CardTitle>
            <ClipboardList className="h-4 w-4 text-slate-400" />
          </CardHeader>

          <CardBody className="space-y-4">
            <Select label="Proveedor" required value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              <option value="">Selecciona un proveedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Agregar producto</p>

              <div className="space-y-2">
                <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
                  <option value="">Producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Cantidad"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <Input
                    placeholder="Costo unitario"
                    type="number"
                    step="0.01"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>

                <Button type="button" variant="secondary" className="w-full" onClick={addItem}>
                  <Plus className="h-4 w-4" />
                  Agregar a la compra
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-700">{item.product_name}</p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} x ${item.cost.toFixed(2)} = ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                  <button onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {items.length === 0 && <p className="text-sm text-slate-400">Sin productos agregados</p>}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
              <span className="text-sm font-medium">Total</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>

            <Button className="w-full" onClick={handleSubmit} loading={submitting} disabled={!supplierId || items.length === 0}>
              Registrar compra
            </Button>
          </CardBody>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Folio</th>
                  <th className="px-5 py-3">Proveedor</th>
                  <th className="px-5 py-3">Registrada por</th>
                  <th className="px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">#{purchase.id}</td>
                    <td className="px-5 py-3 text-slate-600">{purchase.supplier_name || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{purchase.user_name || "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-800">
                      ${Number(purchase.total).toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{new Date(purchase.created_at).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openDetail(purchase)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                          title="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(purchase)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="Eliminar compra"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                      No hay compras registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal open={!!viewingPurchase} onClose={() => setViewingPurchase(null)} title={`Compra #${viewingPurchase?.id ?? ""}`} size="sm">
        {viewingPurchase && (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Proveedor: {viewingPurchase.supplier_name}</p>
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-100">
              {viewingPurchase.items?.map((item, i) => (
                <div key={i} className="flex justify-between px-3 py-2 text-sm">
                  <span>{item.quantity} x {item.product_name}</span>
                  <span>${Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2 text-sm font-semibold text-slate-800">
              <span>Total</span>
              <span>${Number(viewingPurchase.total).toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
