import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  Truck,
  ClipboardList,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  Receipt,
  FileBarChart,
  UserCog,
} from "lucide-react";
import { cn } from "../../lib/cn";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "General",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/pos", label: "Punto de venta", icon: ShoppingCart },
      { to: "/ventas", label: "Historial de ventas", icon: Receipt },
    ],
  },
  {
    label: "Catálogos",
    items: [
      { to: "/productos", label: "Productos", icon: Package },
      { to: "/categorias", label: "Categorías", icon: Tags },
      { to: "/clientes", label: "Clientes", icon: Users },
      { to: "/proveedores", label: "Proveedores", icon: Truck },
    ],
  },
  {
    label: "Movimientos",
    items: [
      { to: "/compras", label: "Compras", icon: ClipboardList },
      { to: "/entrada-inventario", label: "Entrada de inventario", icon: ArrowDownToLine },
      { to: "/salida-inventario", label: "Salida de inventario", icon: ArrowUpFromLine },
      { to: "/caja", label: "Caja", icon: Wallet },
    ],
  },
  {
    label: "Administración",
    items: [
      { to: "/reportes", label: "Reportes", icon: FileBarChart },
      { to: "/usuarios", label: "Usuarios", icon: UserCog },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0",
        mobileOpen && "translate-x-0"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          P
        </div>
        <span className="text-sm font-semibold text-slate-800">POS System</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" onClick={onNavigate}>
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>

            <div className="mt-2 space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
