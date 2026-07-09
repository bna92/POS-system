import { useEffect, useState } from "react";
import { Printer, Wifi } from "lucide-react";
import { api } from "../services/api";
import type { SaleReceipt } from "../types/sale.types";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { openReceiptWindow } from "../lib/printReceipt";

const paymentLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

interface ReceiptModalProps {
  saleId: number | null;
  onClose: () => void;
}

export function ReceiptModal({ saleId, onClose }: ReceiptModalProps) {
  const [receipt, setReceipt] = useState<SaleReceipt | null>(null);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!saleId) {
      setReceipt(null);
      setPrintStatus(null);
      return;
    }

    api.get(`/sales/${saleId}/receipt`).then((res) => setReceipt(res.data));
  }, [saleId]);

  const handleThermalPrint = async () => {
    if (!saleId) return;
    setPrintStatus("Enviando a la impresora...");

    try {
      const res = await api.post(`/sales/${saleId}/print`);
      setPrintStatus(res.data.message);
    } catch (err: any) {
      setPrintStatus(err?.response?.data?.message || "No se pudo imprimir el ticket");
    }
  };

  return (
    <Modal open={!!saleId} onClose={onClose} title={`Ticket #${saleId ?? ""}`} size="sm">
      {!receipt ? (
        <p className="text-sm text-slate-400">Cargando...</p>
      ) : (
        <div>
          <div className="rounded-lg border border-dashed border-slate-300 p-4 font-mono text-xs text-slate-700">
            <p className="text-center font-semibold">POS SYSTEM</p>
            <p className="text-center">{new Date(receipt.created_at).toLocaleString()}</p>
            <p className="text-center">Cajero: {receipt.cashier_name || "N/A"}</p>
            <hr className="my-2 border-dashed border-slate-300" />
            {receipt.items.map((item) => (
              <div key={item.product_id} className="flex justify-between">
                <span>{item.quantity} x {item.product_name}</span>
                <span>${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2 border-dashed border-slate-300" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${Number(receipt.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pago</span>
              <span>{paymentLabels[receipt.payment_method] || receipt.payment_method}</span>
            </div>
          </div>

          {printStatus && <p className="mt-3 text-xs text-slate-500">{printStatus}</p>}

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={handleThermalPrint}>
              <Wifi className="h-4 w-4" />
              Impresora térmica
            </Button>
            <Button onClick={() => openReceiptWindow(receipt)}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
