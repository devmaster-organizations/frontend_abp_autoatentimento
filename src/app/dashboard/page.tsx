"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  Activity,
  BookOpen,
  GitBranch,
  MessageSquareText,
} from "lucide-react";

const cursosData = [
  { curso: "DSM", nos: 82, perguntas: 210 },
  { curso: "ADS", nos: 67, perguntas: 180 },
  { curso: "GEO", nos: 43, perguntas: 102 },
  { curso: "LOG", nos: 31, perguntas: 87 },
  { curso: "MEC", nos: 22, perguntas: 64 },
];

const crescimentoData = [
  { mes: "Jan", cadastros: 34 },
  { mes: "Fev", cadastros: 51 },
  { mes: "Mar", cadastros: 68 },
  { mes: "Abr", cadastros: 83 },
  { mes: "Mai", cadastros: 102 },
  { mes: "Jun", cadastros: 119 },
];

const atividades = [
  { titulo: "Curso DSM atualizado", tempo: "5 minutos atrás" },
  { titulo: "Nó Documentos criado", tempo: "15 minutos atrás" },
  { titulo: "Pergunta removida", tempo: "35 minutos atrás" },
  { titulo: "Curso GEO criado", tempo: "Ontem" },
];

const resumoCards = [
  {
    label: "Cursos",
    value: "12",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  {
    label: "Perguntas",
    value: "148",
    icon: MessageSquareText,
    color: "bg-red-50 text-red-700 ring-red-100",
  },
  {
    label: "Nós",
    value: "427",
    icon: GitBranch,
    color: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    label: "Cursos Ativos",
    value: "9",
    icon: Activity,
    color: "bg-amber-50 text-amber-700 ring-amber-100",
  },
];

const maxNos = Math.max(...cursosData.map((item) => item.nos));
const maxCadastros = Math.max(...crescimentoData.map((item) => item.cadastros));

export default function DashboardPage() {
  const { isCheckingAccess } = useProtectedRoute({ allowedRoles: ["ADMIN"] });

  if (isCheckingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Verificando permissao...
      </main>
    );
  }

  return (
    <AdminShell>
      <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800">Dashboard</h1>
            <p className="mt-2 text-slate-500">
              Visão geral do sistema de gerenciamento do chatbot
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {resumoCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-500">
                      {card.label}
                    </p>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${card.color}`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                  <h2 className="mt-3 text-4xl font-bold text-slate-900">
                    {card.value}
                  </h2>
                </div>
              );
            })}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-6 text-xl font-semibold text-slate-800">
                Cursos por Quantidade de Nós
              </h2>

              <div className="flex h-80 items-end gap-5 border-b border-l border-slate-200 px-3 pt-4">
                {cursosData.map((item) => (
                  <div
                    key={item.curso}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <span className="text-sm font-bold text-slate-500">
                      {item.nos}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-[#15186d]"
                      style={{ height: `${(item.nos / maxNos) * 78}%` }}
                    />
                    <span className="text-sm font-bold text-slate-600">
                      {item.curso}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-6 text-xl font-semibold text-slate-800">
                Crescimento Mensal
              </h2>

              <div className="flex h-80 items-end gap-4 border-b border-l border-slate-200 px-3 pt-4">
                {crescimentoData.map((item) => (
                  <div
                    key={item.mes}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <span className="text-sm font-bold text-slate-500">
                      {item.cadastros}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-red-600"
                      style={{ height: `${(item.cadastros / maxCadastros) * 78}%` }}
                    />
                    <span className="text-sm font-bold text-slate-600">
                      {item.mes}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-6 text-xl font-semibold text-slate-800">
                Cursos Mais Utilizados
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 font-bold">Curso</th>
                      <th className="py-3 font-bold">Nós</th>
                      <th className="py-3 font-bold">Perguntas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursosData.slice(0, 4).map((item) => (
                      <tr key={item.curso} className="border-b border-slate-100">
                        <td className="py-4 font-bold text-slate-800">
                          {item.curso}
                        </td>
                        <td className="py-4 text-slate-600">{item.nos}</td>
                        <td className="py-4 text-slate-600">{item.perguntas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-6 text-xl font-semibold text-slate-800">
                Últimas Atividades
              </h2>

              <div className="space-y-5">
                {atividades.map((atividade) => (
                  <div key={atividade.titulo} className="flex gap-4">
                    <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {atividade.titulo}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {atividade.tempo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
