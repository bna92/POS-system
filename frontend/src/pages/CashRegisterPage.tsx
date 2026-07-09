import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { api } from "../services/api";
import type { CashSession } from "../types/cashRegister.types";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useAuthStore } from "../store/authStore";

export default function CashRegisterPage() {
  const user = useAuthStore((state) => state.user);
  const [activeSession, setActiveSession] = useState<CashSession | null>(null);
  const [history, setHistory] = useState<CashSession[]>([]);
  const [openingAmount, setOpeningAmount] = useState("");
  const [closingAmount, setClosingAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    const [activeRes, historyRes] = await Promise.all([
      api.get("/cash-register/active"),
      api.get("/cash-register/history"),
    ]);
    setActiveSession(activeRes.data);
    setHistory(historyRes.data);
  };

  useEffect(() => {
    Promise.all([api.get("/cash-register/active"), api.get("/cash-register/history")]).then(
      ([activeRes, historyRes]) => {
        setActiveSession(activeRes.data);
        setHistory(historyRes.data);
      }
    );
  }, []);

  const handleOpen = async () => {
    setSubmitting(true);
    try {
      await api.post("/cash-register/open", { user_id: user?.id, opening_amount: Number(openingAmount || 0) });
      setOpeningAmount("");
      fetchAll();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    if (!activeSession) return;
    setSubmitting(true);
    try {
      await api.put(`/cash-register/${activeSession.id}/close`, {
        closing_amount: Number(closingAmount || 0),
      });
      setClosingAmount("");
      fetchAll();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Caja" subtitle="Apertura, cierre y corte de caja" />

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{activeSession ? "Caja abierta" : "Abrir caja"}</CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>

          <CardBody className="space-y-4">
            {!activeSession ? (
              <>
                <Input
                  label="Monto inicial"
                  type="number"
                  step="0.01"
                  value={openingAmount}
                  onChange={(e) => setOpeningAmount(e.target.value)}
                />
                <Button className="w-full" onClick={handleOpen} loading={submitting}>
                  Abrir caja
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cajero</span>
                    <span className="font-medium text-slate-800">{activeSession.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Abierta desde</span>
                    <span className="font-medium text-slate-800">
                      {new Date(activeSession.opened_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monto inicial</span>
                    <span className="font-medium text-slate-800">${Number(activeSession.opening_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ventas de la sesión</span>
                    <span className="font-medium text-slate-800">{activeSession.summary?.total_sales ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ingresos en efectivo</span>
                    <span className="font-medium text-emerald-600">
                      ${Number(activeSession.summary?.cash_income ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <Input
                  label="Efectivo contado al cierre"
                  type="number"
                  step="0.01"
                  value={closingAmount}
                  onChange={(e) => setClosingAmount(e.target.value)}
                />
                <Button className="w-full" variant="danger" onClick={handleClose} loading={submitting}>
                  Cerrar caja
                </Button>
              </>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de cortes</CardTitle>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Cajero</th>
                  <th className="px-5 py-3 text-right">Inicial</th>
                  <th className="px-5 py-3 text-right">Cierre</th>
                  <th className="px-5 py-3 text-right">Diferencia</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Apertura</th>
                </tr>
              </thead>

              <tbody>
                {history.map((session) => (
                  <tr key={session.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{session.user_name}</td>
                    <td className="px-5 py-3 text-right text-slate-600">${Number(session.opening_amount).toFixed(2)}</td>
                    <td className="px-5 py-3 text-right text-slate-600">
                      {session.closing_amount != null ? `$${Number(session.closing_amount).toFixed(2)}` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {session.difference_amount != null ? (
                        <span className={Number(session.difference_amount) < 0 ? "text-red-600" : "text-emerald-600"}>
                          ${Number(session.difference_amount).toFixed(2)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={session.status === "open" ? "green" : "slate"}>
                        {session.status === "open" ? "Abierta" : "Cerrada"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{new Date(session.opened_at).toLocaleString()}</td>
                  </tr>
                ))}

                {history.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                      Sin historial de caja.
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
