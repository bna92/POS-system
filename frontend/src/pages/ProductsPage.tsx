import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Product } from "../types/product.types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    category_id: "",
    price: "",
    cost: "",
    stock: "",
    image_url: "",
  });

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/products", {
      ...form,
      category_id: form.category_id || null,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
    });

    setForm({
      name: "",
      barcode: "",
      category_id: "",
      price: "",
      cost: "",
      stock: "",
      image_url: "",
    });

    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white text-black">
      <div className="bg-gray-700 px-3 py-2 text-lg font-bold text-white">
        CATÁLOGO DE PRODUCTOS
      </div>

      <div className="border-b border-gray-400 bg-gray-100 px-3 py-2 text-sm font-semibold">
        Administra tu inventario
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 border-b border-gray-400 bg-white p-4 md:grid-cols-4"
      >
        <input
          className="border border-gray-500 px-3 py-2 outline-none"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border border-gray-500 px-3 py-2 outline-none"
          placeholder="Código de barras"
          value={form.barcode}
          onChange={(e) => setForm({ ...form, barcode: e.target.value })}
        />

        <input
          className="border border-gray-500 px-3 py-2 outline-none"
          placeholder="Precio"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          className="border border-gray-500 px-3 py-2 outline-none"
          placeholder="Costo"
          type="number"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
        />

        <input
          className="border border-gray-500 px-3 py-2 outline-none"
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          className="border border-gray-500 px-3 py-2 outline-none md:col-span-2"
          placeholder="URL imagen"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />

        <button className="border border-gray-700 bg-blue-700 px-4 py-2 font-bold text-white">
          Guardar
        </button>
      </form>

      <div className="p-3">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="border border-gray-400 p-2 text-left">Producto</th>
              <th className="border border-gray-400 p-2 text-left">Código</th>
              <th className="border border-gray-400 p-2 text-right">Precio</th>
              <th className="border border-gray-400 p-2 text-right">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border border-gray-300 p-2 font-bold">
                  {product.name}
                </td>
                <td className="border border-gray-300 p-2">
                  {product.barcode}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {product.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}