import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, PackageSearch, Receipt, TrendingUp } from "lucide-react";
import { api } from "../services/api";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import type { DailySummary, LowStockProduct, SalesTrendPoint, TopProduct } from "../types/dashboard.types";

const SERIES_COLOR = "#4f46e5";

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  tone: "indigo" | "green" | "slate";
}) {
  const toneClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
  }[tone];

  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-slate-700">
        {new Date(label).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
      </p>
      <p className="mt-0.5 text-slate-500">
        Ingresos: <span className="font-semibold text-slate-800">${Number(payload[0].value).toFixed(2)}</span>
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DailySummary>({ total_sales: 0, total_income: 0 });
  const [trend, setTrend] = useState<SalesTrendPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    api.get("/sales/daily-summary").then((res) => setSummary(res.data));
    api.get("/dashboard/sales-trend?days=7").then((res) => setTrend(res.data));
    api.get("/dashboard/top-products?limit=5").then((res) => setTopProducts(res.data));
    api.get("/dashboard/low-stock").then((res) => setLowStock(res.data));
  }, []);

  const avgTicket = summary.total_sales > 0 ? summary.total_income / summary.total_sales : 0;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumen general del negocio" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile icon={Receipt} label="Ventas de hoy" value={String(summary.total_sales)} tone="indigo" />
        <StatTile
          icon={DollarSign}
          label="Ingresos de hoy"
          value={`$${Number(summary.total_income).toFixed(2)}`}
          tone="green"
        />
        <StatTile icon={TrendingUp} label="Ticket promedio" value={`$${avgTicket.toFixed(2)}`} tone="slate" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas de los últimos 7 días</CardTitle>
          </CardHeader>
          <CardBody className="h-64 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e1e0d9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString("es-MX", { weekday: "short" })}
                  tick={{ fontSize: 12, fill: "#898781" }}
                  axisLine={{ stroke: "#c3c2b7" }}
                  tickLine={false}
                />
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
                  dataKey="total_income"
                  stroke={SERIES_COLOR}
                  strokeWidth={2}
                  fill="url(#incomeFill)"
                  dot={{ r: 4, fill: SERIES_COLOR, stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: SERIES_COLOR, stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos más vendidos</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {topProducts.length === 0 && (
              <p className="text-sm text-slate-400">Aún no hay ventas registradas.</p>
            )}

            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{product.name}</span>
                </div>
                <span className="text-sm text-slate-500">{product.units_sold} uds.</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Productos con stock bajo</CardTitle>
            <PackageSearch className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardBody>
            {lowStock.length === 0 ? (
              <p className="text-sm text-slate-400">Todo el inventario está en niveles saludables.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {lowStock.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-slate-700">{product.name}</span>
                    <Badge tone={product.stock === 0 ? "red" : "amber"}>
                      {product.stock} / {product.min_stock}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
