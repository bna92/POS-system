import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { api } from "../services/api";
import type { Product } from "../types/product.types";
import type { InventoryMovement, MovementType } from "../types/inventory.types";
import { PageHeader } from "./ui/PageHeader";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Input";
import { useAuthStore } from "../store/authStore";

interface InventoryMovementViewProps {
  type: MovementType;
}

const config = {
  in: {
    title: "Entrada de inventario",
    subtitle: "Registra entradas manuales de mercancía",
    icon: ArrowDownToLine,
    buttonLabel: "Registrar entrada",
    emptyLabel: "No hay entradas registradas.",
  },
  out: {
    title: "Salida de inventario",
    subtitle: "Registra salidas manuales, mermas o ajustes",
    icon: ArrowUpFromLine,
    buttonLabel: "Registrar salida",
    emptyLabel: "No hay salidas registradas.",
  },
};

export function InventoryMovementView({ type }: InventoryMovementViewProps) {
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { title, subtitle, icon: Icon, buttonLabel, emptyLabel } = config[type];

  const fetchMovements = async () => {
    const res = await api.get(`/inventory?type=${type}`);
    setMovements(res.data);
  };

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get(`/inventory?type=${type}`).then((res) => setMovements(res.data));
  }, [type]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    setSubmitting(true);

    try {
      await api.post("/inventory", {
        product_id: Number(productId),
        user_id: user?.id,
        type,
        quantity: Number(quantity),
        reason,
      });

      setProductId("");
      setQuantity("");
      setReason("");
      fetchMovements();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <Icon className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-slate-800">{buttonLabel}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            <Select label="Producto" required value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Selecciona un producto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (stock: {p.stock})
                </option>
              ))}
            </Select>

            <Input
              label="Cantidad"
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <Input
              label="Motivo"
              required
              placeholder={type === "in" ? "Reabastecimiento, devolución..." : "Merma, daño, ajuste..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <Button type="submit" className="w-full" loading={submitting}>
              {buttonLabel}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3 text-right">Cantidad</th>
                  <th className="px-5 py-3">Motivo</th>
                  <th className="px-5 py-3">Usuario</th>
                  <th className="px-5 py-3">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {movements.map((m) => (
                  <tr key={m.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{m.product_name}</td>
                    <td className="px-5 py-3 text-right text-slate-700">{m.quantity}</td>
                    <td className="px-5 py-3 text-slate-500">{m.notes || "—"}</td>
                    <td className="px-5 py-3 text-slate-500">{m.user_name || "—"}</td>
                    <td className="px-5 py-3 text-slate-500">{new Date(m.created_at).toLocaleString()}</td>
                  </tr>
                ))}

                {movements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                      {emptyLabel}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
