import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import POSPage from "./pages/POSPage";
import SalesPage from "./pages/SalesPage";
import CategoriesPage from "./pages/CategoriesPage";
import CustomersPage from "./pages/CustomersPage";
import SuppliersPage from "./pages/SuppliersPage";
import UsersPage from "./pages/UsersPage";
import PurchasesPage from "./pages/PurchasesPage";
import InventoryInPage from "./pages/InventoryInPage";
import InventoryOutPage from "./pages/InventoryOutPage";
import CashRegisterPage from "./pages/CashRegisterPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/ventas" element={<SalesPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/clientes" element={<CustomersPage />} />
        <Route path="/proveedores" element={<SuppliersPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/compras" element={<PurchasesPage />} />
        <Route path="/entrada-inventario" element={<InventoryInPage />} />
        <Route path="/salida-inventario" element={<InventoryOutPage />} />
        <Route path="/caja" element={<CashRegisterPage />} />
        <Route path="/reportes" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}
