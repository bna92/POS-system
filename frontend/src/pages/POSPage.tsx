import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Product } from "../types/product.types";
import { useCart } from "../context/CartContext";

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

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

  const handleSale = async () => {
    if (items.length === 0) return alert("Agrega productos al carrito");

    if (paymentMethod === "cash" && Number(cashReceived) < total) {
      return alert("El efectivo recibido es menor al total");
    }

    await api.post("/sales", {
      user_id: 1,
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

    alert("Venta registrada correctamente");
    clearCart();
    setCashReceived("");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.barcode?.includes(search)
  );

  return (
    <div className="bg-white text-black">
      <div className="flex items-center justify-between border-b border-gray-400 bg-gray-100 px-3 py-3">
        <div className="flex gap-3">
          <button className="border border-gray-400 bg-gray-200 px-5 py-2 font-bold">
            Vendedores (F2)
          </button>
          <button className="border border-gray-400 bg-gray-200 px-5 py-2 font-bold">
            Clientes (F3)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Folio:</span>
          <div className="w-32 border border-gray-400 bg-green-100 px-3 py-2 text-right text-xl font-bold">
            1
          </div>
        </div>
      </div>

      <div className="bg-gray-700 px-3 py-2 text-xl font-bold text-white">
        VENTA DE PRODUCTOS / SERVICIOS
      </div>

      <div className="flex items-center gap-3 border-b border-gray-400 bg-white px-3 py-4">
        <span className="font-bold">Código:</span>

        <input
          className="w-80 border border-gray-500 bg-yellow-50 px-3 py-2 text-lg outline-none"
          placeholder="Escanear o buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <button className="border border-gray-500 bg-gray-200 px-4 py-2 font-bold">
          Buscar
        </button>

        <label className="ml-auto flex items-center gap-2 font-semibold">
          <input type="checkbox" />
          Factura
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-[1fr_360px]">
        <section className="border border-gray-400">
          <div className="h-6 bg-blue-700" />

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-2 text-left">
                  CANT.
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left">
                  CÓDIGO
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left">
                  PRODUCTO / SERVICIO
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right">
                  PRECIO UNIT.
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right">
                  IMPORTE
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.product.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-600 text-white"}
                >
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {item.product.barcode || item.product.id}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {item.product.name}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    ${Number(item.product.price).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="h-56 border border-gray-300 text-center text-gray-500"
                  >
                    Sin productos agregados
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-wrap gap-3 border-t border-gray-400 bg-gray-100 p-3">
            <button
              onClick={() => {
                if (items[0]) removeFromCart(items[0].product.id);
              }}
              className="border border-gray-500 bg-red-100 px-6 py-2 font-bold text-red-700"
            >
              Eliminar (Supr)
            </button>

            <button
              onClick={clearCart}
              className="border border-gray-500 bg-gray-200 px-6 py-2 font-bold"
            >
              Borrar (F7)
            </button>
          </div>
        </section>

        <aside className="border border-gray-400 bg-gray-100">
          <div className="bg-blue-700 px-3 py-2 font-bold text-white">
            PRODUCTOS
          </div>

          <div className="max-h-56 overflow-y-auto border-b border-gray-400 bg-white">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex w-full justify-between border-b border-gray-200 px-3 py-2 text-left text-sm hover:bg-blue-100"
              >
                <span className="font-semibold">{product.name}</span>
                <span>${Number(product.price).toFixed(2)}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2 p-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between border border-gray-300 bg-white p-2 text-sm"
              >
                <span className="font-bold">{item.product.name}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="border border-gray-400 bg-gray-200 px-2 font-bold"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="border border-gray-400 bg-gray-200 px-2 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-400 bg-white p-3">
            <select
              className="mb-2 w-full border border-gray-500 px-3 py-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
            </select>

            {paymentMethod === "cash" && (
              <>
                <input
                  className="mb-2 w-full border border-gray-500 px-3 py-2"
                  placeholder="Efectivo recibido"
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                />

                <div className="mb-2 bg-green-100 p-2 text-right text-xl font-bold text-green-700">
                  Cambio: ${change > 0 ? change.toFixed(2) : "0.00"}
                </div>
              </>
            )}

            <button
              onClick={handleSale}
              className="mb-3 w-full border border-gray-700 bg-gray-200 px-4 py-3 text-xl font-bold"
            >
              Cobrar (F8)
            </button>

            <div className="border-4 border-gray-700 bg-yellow-100 px-4 py-4 text-right text-4xl font-bold text-blue-800">
              ${total.toFixed(2)}
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-2 border-t border-gray-400 bg-gray-100 p-3 md:grid-cols-2">
        <div className="border border-gray-300 bg-white px-3 py-3 font-bold">
          Le atiende: <span className="text-blue-700">ADMINISTRADOR</span>
        </div>

        <div className="border border-gray-300 bg-white px-3 py-3 font-bold">
          Cliente: <span className="text-blue-700">PÚBLICO EN GENERAL</span>
        </div>
      </div>
    </div>
  );
}