"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function AdminHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "SECRETARIA":
        return "Secretária";
      default:
        return "Usuário";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div>
          <p className="text-3xl font-black tracking-tight text-slate-900">
            Fatec
          </p>

          <p className="text-lg font-bold text-red-600">Jacareí</p>
        </div>

        <div className="hidden md:block">
          <h1 className="text-lg font-black uppercase tracking-wide text-slate-700">
            Secretaria Virtual — Portal Administrativo
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-lg shadow-slate-900/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#15186d] text-white">
            <ShieldCheck size={18} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {getRoleLabel(user?.role)}
            </p>

            <p className="font-bold text-slate-800">{user?.name || getRoleLabel(user?.role)}</p>
          </div>

          <button
            onClick={() => { logout(); router.push("/login"); }}
            title="Sair"
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}