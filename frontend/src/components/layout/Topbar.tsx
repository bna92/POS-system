import { LogOut, Menu, UserRound } from "lucide-react";

interface TopbarProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
  onMenuClick: () => void;
}

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  cashier: "Cajero",
};

export function Topbar({ userName, userRole, onLogout, onMenuClick }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            P
          </div>
          <span className="text-sm font-semibold text-slate-800">POS System</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <UserRound className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight text-slate-800">{userName}</p>
            <p className="text-xs leading-tight text-slate-500">
              {roleLabels[userRole] || userRole}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Cerrar sesión"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
