import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    total_sales: 0,
    total_income: 0,
  });

  useEffect(() => {
    api.get("/sales/daily-summary").then((res) => setSummary(res.data));
  }, []);

  return (
    <div className="bg-white text-black">
      <div className="bg-gray-700 px-3 py-2 text-lg font-bold text-white">
        DASHBOARD / RESUMEN GENERAL
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-3">
        <div className="border border-gray-400 bg-gray-100">
          <div className="border-b border-gray-400 bg-blue-700 px-3 py-2 font-bold text-white">
            Ventas de hoy
          </div>
          <div className="p-5 text-center text-4xl font-bold text-blue-800">
            {summary.total_sales}
          </div>
        </div>

        <div className="border border-gray-400 bg-gray-100">
          <div className="border-b border-gray-400 bg-blue-700 px-3 py-2 font-bold text-white">
            Ingresos de hoy
          </div>
          <div className="p-5 text-center text-4xl font-bold text-green-700">
            ${Number(summary.total_income).toFixed(2)}
          </div>
        </div>

        <div className="border border-gray-400 bg-gray-100">
          <div className="border-b border-gray-400 bg-blue-700 px-3 py-2 font-bold text-white">
            Estado del sistema
          </div>
          <div className="p-5 text-center text-4xl font-bold text-green-700">
            ACTIVO
          </div>
        </div>
      </div>
    </div>
  );
}