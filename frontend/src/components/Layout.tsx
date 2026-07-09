import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNewSale = () => {
    setOpenMenu(null);
    navigate("/pos");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpenMenu(null);
    navigate("/");
    alert("Sesión cerrada correctamente");
  };

  const handleExit = () => {
    setOpenMenu(null);
    alert("Para salir del sistema, cierra la pestaña o ventana del navegador.");
  };

  return (
    <div className="min-h-screen bg-gray-200 text-black">
      <div className="min-h-screen border border-gray-400 bg-white">
        <header className="border-b border-gray-400 bg-gray-100">
          <div className="flex h-8 items-center justify-between px-3 text-sm">
            <span className="font-semibold">POS System 1.0</span>
            <div className="flex gap-4">
              <span>—</span>
              <span>□</span>
              <span className="font-bold text-red-600">X</span>
            </div>
          </div>

          <nav className="relative flex flex-wrap gap-6 border-t border-gray-300 bg-white px-3 py-1 text-sm">
            {/* Archivo */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === "archivo" ? null : "archivo")
                }
                className="hover:underline"
              >
                Archivo
              </button>

              {openMenu === "archivo" && (
                <div className="absolute left-0 top-6 z-50 w-48 border border-gray-500 bg-white shadow">
                  <button
                    onClick={handleNewSale}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Nuevo
                  </button>

                  <div className="border-t border-gray-300" />

                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Cerrar sesión
                  </button>

                  <button
                    onClick={handleExit}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Salir
                  </button>
                </div>
              )}
            </div>

            {/* Catálogos */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === "catalogos" ? null : "catalogos")
                }
                className="hover:underline"
              >
                Catálogos
              </button>

              {openMenu === "catalogos" && (
                <div className="absolute left-0 top-6 z-50 w-52 border border-gray-500 bg-white shadow">
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/productos");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Productos
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/categorias");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Categorías
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/clientes");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Clientes
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/proveedores");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Proveedores
                  </button>

                  <div className="border-t border-gray-300" />

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/usuarios");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Usuarios
                  </button>
                </div>
              )}
            </div>

            {/* Movimientos */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === "movimientos" ? null : "movimientos")
                }
                className="hover:underline"
              >
                Movimientos
              </button>

              {openMenu === "movimientos" && (
                <div className="absolute left-0 top-6 z-50 w-56 border border-gray-500 bg-white shadow">
                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/pos");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Punto de venta
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/compras");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Compras
                  </button>

                  <div className="border-t border-gray-300" />

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/entrada-inventario");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Entrada de inventario
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/salida-inventario");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Salida de inventario
                  </button>

                  <div className="border-t border-gray-300" />

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      navigate("/caja");
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
                  >
                    Caja
                  </button>
                </div>
              )}
            </div>
            <Link to="/ventas">Reportes</Link>
            <span>Configuración</span>
            <span>Mantenimiento</span>
            <span>Acerca de</span>
          </nav>
        </header>

        <section className="mx-2 mt-2 border border-gray-400 bg-white">
          <div className="flex items-center">
            <div className="flex h-24 w-32 items-center justify-center border-r border-gray-300 bg-white text-center text-xs font-bold">
              POS
              <br />
              SYSTEM
            </div>

            <div className="flex h-24 flex-1 items-center justify-center bg-blue-700 text-center text-2xl font-bold text-white">
              PUNTO DE VENTA
            </div>

            <button className="h-24 w-14 bg-red-600 text-2xl font-bold text-white">
              X
            </button>
          </div>

          <div className="border-t border-gray-300 bg-gray-50 px-3 py-2 text-right text-sm font-semibold">
            USUARIO: ADMINISTRADOR
          </div>
        </section>

        <main className="mx-2 mt-2 border border-gray-400 bg-white">
          <Outlet />
        </main>

        <footer className="mx-2 mt-2 flex justify-between border border-gray-400 bg-gray-100 px-3 py-2 text-sm">
          <span>Listo</span>
          <span>ESP</span>
        </footer>
      </div>
    </div>
  );
}
