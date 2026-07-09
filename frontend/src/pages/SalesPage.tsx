import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Sale {
  id: number;
  cashier_name: string;
  total: number;
  payment_method: string;
  created_at: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    api.get("/sales").then((res) => setSales(res.data));
  }, []);

  return (
    <div className="bg-white text-black">
      <div className="bg-gray-700 px-3 py-2 text-lg font-bold text-white">
        HISTORIAL DE VENTAS
      </div>

      <div className="border-b border-gray-400 bg-gray-100 px-3 py-2 text-sm font-semibold">
        Ventas registradas en el sistema
      </div>

      <div className="p-3">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="border border-gray-400 p-2 text-left">Folio</th>
              <th className="border border-gray-400 p-2 text-left">Cajero</th>
              <th className="border border-gray-400 p-2 text-left">Pago</th>
              <th className="border border-gray-400 p-2 text-right">Total</th>
              <th className="border border-gray-400 p-2 text-left">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale, index) => (
              <tr
                key={sale.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border border-gray-300 p-2 font-bold">
                  #{sale.id}
                </td>
                <td className="border border-gray-300 p-2">
                  {sale.cashier_name || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {sale.payment_method}
                </td>
                <td className="border border-gray-300 p-2 text-right font-bold">
                  ${Number(sale.total).toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(sale.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}