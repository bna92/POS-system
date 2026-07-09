import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { api } from "../services/api";
import type { Sale } from "../types/sale.types";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const SERIES_COLOR = "#4f46e5";

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-slate-700">{label}</p>
      <p className="mt-0.5 text-slate-500">
        Ingresos: <span className="font-semibold text-slate-800">${Number(payload[0].value).toFixed(2)}</span>
      </p>
    </div>
  );
}

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [from, setFrom] = useState(toDateInput(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(toDateInput(new Date()));
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get("/sales").then((res) => setSales(res.data));
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const date = sale.created_at.slice(0, 10);
      return date >= from && date <= to;
    });
  }, [sales, from, to]);

  const chartData = useMemo(() => {
    const byDate = new Map<string, number>();

    filteredSales.forEach((sale) => {
      const date = sale.created_at.slice(0, 10);
      byDate.set(date, (byDate.get(date) || 0) + Number(sale.total));
    });

    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ date, total }));
  }, [filteredSales]);

  const totalIncome = filteredSales.reduce((sum, s) => sum + Number(s.total), 0);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const res = await api.get(`/reports/sales?from=${from}&to=${to}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-ventas-${from}-a-${to}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Reportes"
        subtitle="Analiza tus ventas por rango de fechas"
        actions={
          <Button onClick={handleDownload} loading={downloading}>
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        }
      />

      <Card className="mb-4">
        <CardBody className="flex flex-wrap items-end gap-3">
          <Input label="Desde" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="Hasta" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-500">Ingresos en el periodo</p>
            <p className="text-xl font-semibold text-slate-900">${totalIncome.toFixed(2)}</p>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ingresos por día</CardTitle>
        </CardHeader>
        <CardBody className="h-64 pl-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="reportFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e1e0d9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: "#898781" }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke={SERIES_COLOR}
                strokeWidth={2}
                fill="url(#reportFill)"
                dot={{ r: 4, fill: SERIES_COLOR, stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Folio</th>
                <th className="px-5 py-3">Cajero</th>
                <th className="px-5 py-3">Pago</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{sale.folio || `#${sale.id}`}</td>
                  <td className="px-5 py-3 text-slate-600">{sale.cashier_name || "N/A"}</td>
                  <td className="px-5 py-3 text-slate-600">{sale.payment_method}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-800">${Number(sale.total).toFixed(2)}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(sale.created_at).toLocaleString()}</td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                    No hay ventas en este periodo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
