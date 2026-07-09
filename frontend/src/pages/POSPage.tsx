import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { api } from "../services/api";
import type { Product } from "../types/product.types";
import type { Customer } from "../types/customer.types";
import { useCart } from "../context/CartContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { ReceiptModal } from "../components/ReceiptModal";

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashRegisterId, setCashRegisterId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completedSaleId, setCompletedSaleId] = useState<number | null>(null);

  const {
    items,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    total,
  } = useCart();

  const change = Number(cashReceived || 0) - total;

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
    api.get("/customers").then((res) => setCustomers(res.data));
    api.get("/cash-register/active").then((res) => {
      if (res.data) setCashRegisterId(res.data.id);
    });
  }, []);

  const handleSale = async () => {
    if (items.length === 0) return alert("Agrega productos al carrito");

    if (paymentMethod === "cash" && Number(cashReceived) < total) {
      return alert("El efectivo recibido es menor al total");
    }

    setSubmitting(true);

    try {
      const res = await api.post("/sales", {
        user_id: 1,
        customer_id: customerId || null,
        cash_register_id: cashRegisterId,
        payment_method: paymentMethod,
        cash_received: Number(cashReceived || 0),
        change_amount: change > 0 ? change : 0,
        total,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: Number(item.product.price) * item.quantity,
        })),
      });

      setCompletedSaleId(res.data.sale_id);
      clearCart();
      setCashReceived("");
      setCustomerId("");
      fetchProducts();
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.barcode?.includes(search)
      ),
    [products, search]
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar producto por nombre o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          {cashRegisterId === null && (
            <Badge tone="amber">Sin caja abierta</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => product.stock > 0 && addToCart(product)}
              disabled={product.stock <= 0}
              className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="line-clamp-2 text-sm font-medium text-slate-800">{product.name}</span>
              <span className="mt-1 text-base font-semibold text-indigo-600">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="mt-1 text-xs text-slate-400">
                {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
              </span>
            </button>
          ))}

          {filteredProducts.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-slate-400">
              No se encontraron productos.
            </p>
          )}
        </div>
      </div>

      <Card className="flex h-fit flex-col lg:sticky lg:top-0">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <ShoppingCart className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-800">Venta actual</h2>
        </div>

        <div className="max-h-80 flex-1 space-y-2 overflow-y-auto p-4">
          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">Sin productos agregados</p>
          )}

          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 p-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{item.product.name}</p>
                <p className="text-xs text-slate-500">
                  ${Number(item.product.price).toFixed(2)} c/u · $
                  {(Number(item.product.price) * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => decreaseQuantity(item.product.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.product.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-slate-100 p-4">
          <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Público en general</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </Select>

          {paymentMethod === "cash" && (
            <>
              <Input
                placeholder="Efectivo recibido"
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
              />
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                <span>Cambio</span>
                <span>${change > 0 ? change.toFixed(2) : "0.00"}</span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
            <span className="text-sm font-medium">Total</span>
            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
          </div>

          <Button className="w-full" size="lg" onClick={handleSale} loading={submitting}>
            Cobrar
          </Button>
        </div>
      </Card>

      <ReceiptModal saleId={completedSaleId} onClose={() => setCompletedSaleId(null)} />
    </div>
  );
}
