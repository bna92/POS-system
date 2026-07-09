import escpos from "escpos";
import USB from "escpos-usb";

interface ReceiptItem {
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ReceiptData {
  id: number;
  cashier_name?: string;
  customer_name?: string;
  total: number;
  payment_method: string;
  cash_received: number;
  change_amount: number;
  created_at: string;
  items: ReceiptItem[];
}

// Impresión ESC/POS best-effort: requiere una impresora térmica USB conectada.
// No bloquea el flujo de venta si falla o no hay impresora disponible.
export function printReceipt(receipt: ReceiptData): Promise<void> {
  return new Promise((resolve, reject) => {
    let device;

    try {
      device = new USB();
    } catch {
      return reject(new Error("No se detectó una impresora térmica conectada"));
    }

    const printer = new escpos.Printer(device);

    device.open((err: unknown) => {
      if (err) {
        return reject(new Error("No se pudo abrir la impresora térmica"));
      }

      printer
        .align("CT")
        .text("POS SYSTEM")
        .text(`Ticket #${receipt.id}`)
        .text(new Date(receipt.created_at).toLocaleString())
        .text("--------------------------------")
        .align("LT");

      receipt.items.forEach((item) => {
        printer.text(`${item.quantity} x ${item.product_name}`);
        printer.text(`  $${Number(item.subtotal).toFixed(2)}`);
      });

      printer
        .text("--------------------------------")
        .align("RT")
        .text(`Total: $${Number(receipt.total).toFixed(2)}`)
        .text(`Pago: ${receipt.payment_method}`)
        .align("CT")
        .text("Gracias por su compra")
        .cut()
        .close(() => resolve());
    });
  });
}
