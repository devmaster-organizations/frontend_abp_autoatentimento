"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Admin",
    href: "/admin",
    icon: MessageSquareText,
  },
  {
    label: "Usuários",
    href: "/usuarios",
    icon: Users,
  },
];

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

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="flex w-full flex-col bg-[#071a3d] text-white md:min-h-screen md:w-[280px] md:flex-shrink-0">
      <div className="flex items-center justify-between gap-6 px-5 py-5 md:block md:px-6 md:py-10">
        <Link href="/dashboard" className="block leading-none">
          <span className="block text-4xl font-black tracking-tight md:text-5xl">
            Fatec
          </span>
          <span className="mt-1 block text-lg font-bold text-red-500 md:text-xl">
            Jacareí
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          title="Sair"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-red-500 md:hidden"
        >
          <LogOut size={18} />
        </button>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-5 md:mt-5 md:flex-1 md:flex-col md:overflow-visible md:px-6 md:pb-0">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition md:min-w-0 ${
                isActive
                  ? "bg-gradient-to-r from-red-700 to-red-500 text-white shadow-lg shadow-red-950/20"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden px-6 pb-8 md:block">
        <div className="mb-4 rounded-lg border border-white/10 bg-white/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-100/70">
            {getRoleLabel(user?.role)}
          </p>
          <p className="mt-1 truncate text-sm font-bold text-white">
            {user?.name || getRoleLabel(user?.role)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
