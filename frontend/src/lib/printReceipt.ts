import type { SaleReceipt } from "../types/sale.types";

const paymentLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

export function openReceiptWindow(receipt: SaleReceipt) {
  const win = window.open("", "_blank", "width=380,height=600");
  if (!win) return;

  const itemsHtml = receipt.items
    .map(
      (item) => `
        <div class="row">
          <span>${item.quantity} x ${item.product_name}</span>
          <span>$${Number(item.subtotal).toFixed(2)}</span>
        </div>`
    )
    .join("");

  win.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Ticket #${receipt.id}</title>
        <style>
          body { font-family: "Courier New", monospace; font-size: 12px; width: 280px; margin: 0 auto; padding: 16px 0; }
          h1 { font-size: 14px; text-align: center; margin: 0 0 4px; }
          p { margin: 2px 0; text-align: center; }
          hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
          .row { display: flex; justify-content: space-between; gap: 8px; margin: 2px 0; }
          .total { font-weight: bold; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>POS SYSTEM</h1>
        <p>Ticket #${receipt.id}</p>
        <p>${new Date(receipt.created_at).toLocaleString()}</p>
        <p>Cajero: ${receipt.cashier_name || "N/A"}</p>
        <p>Cliente: ${receipt.customer_name || "Público en general"}</p>
        <hr />
        ${itemsHtml}
        <hr />
        <div class="row total"><span>Total</span><span>$${Number(receipt.total).toFixed(2)}</span></div>
        <div class="row"><span>Pago</span><span>${paymentLabels[receipt.payment_method] || receipt.payment_method}</span></div>
        ${receipt.payment_method === "cash" ? `
        <div class="row"><span>Recibido</span><span>$${Number(receipt.cash_received).toFixed(2)}</span></div>
        <div class="row"><span>Cambio</span><span>$${Number(receipt.change_amount).toFixed(2)}</span></div>
        ` : ""}
        <hr />
        <p>Gracias por su compra</p>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);

  win.document.close();
}
