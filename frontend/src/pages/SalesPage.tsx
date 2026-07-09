import { useEffect, useMemo, useState } from "react";
import { Receipt, Trash2 } from "lucide-react";
import { api } from "../services/api";
import type { Sale } from "../types/sale.types";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { ReceiptModal } from "../components/ReceiptModal";
import { useAuthStore } from "../store/authStore";

const paymentLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

export default function SalesPage() {
  const isAdmin = useAuthStore((state) => state.user?.role === "admin");
  const [sales, setSales] = useState<Sale[]>([]);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

  const fetchSales = () => {
    api.get("/sales").then((res) => setSales(res.data));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filteredSales = useMemo(() => {
    if (paymentFilter === "all") return sales;
    return sales.filter((s) => s.payment_method === paymentFilter);
  }, [sales, paymentFilter]);

  const handleDelete = async (sale: Sale) => {
    if (!confirm(`¿Eliminar la venta ${sale.folio || `#${sale.id}`} por $${Number(sale.total).toFixed(2)}? Esto restaura el stock vendido.`)) {
      return;
    }

    await api.delete(`/sales/${sale.id}`);
    fetchSales();
  };

  return (
    <div>
      <PageHeader title="Historial de ventas" subtitle="Todas las ventas registradas en el sistema" />

      <Card>
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-48"
          >
            <option value="all">Todos los pagos</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Folio</th>
                <th className="px-5 py-3">Cajero</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Pago</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{sale.folio || `#${sale.id}`}</td>
                  <td className="px-5 py-3 text-slate-600">{sale.cashier_name || "N/A"}</td>
                  <td className="px-5 py-3 text-slate-600">{sale.customer_name || "Público en general"}</td>
                  <td className="px-5 py-3">
                    <Badge tone="indigo">{paymentLabels[sale.payment_method] || sale.payment_method}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-800">
                    ${Number(sale.total).toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{new Date(sale.created_at).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setSelectedSaleId(sale.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                        title="Ver ticket"
                      >
                        <Receipt className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(sale)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar venta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                    No hay ventas para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ReceiptModal saleId={selectedSaleId} onClose={() => setSelectedSaleId(null)} />
    </div>
  );
}
