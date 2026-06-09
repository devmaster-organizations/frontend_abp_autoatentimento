"use client";

import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 md:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
