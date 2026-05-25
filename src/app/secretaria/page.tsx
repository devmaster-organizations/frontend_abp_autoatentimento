// app/secretaria/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import TabelaPerguntas, {
  Pergunta,
} from "@/components/secretaria/TabelaPerguntas";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuthStore } from "@/stores/auth.store";
import {
  fetchInquiries,
  updateInquiryResponded,
} from "@/services/api/inquiries.service";

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const mapApiToPergunta = (item: {
  id: string;
  requesterName: string;
  requesterEmail: string;
  question: string;
  status: "ABERTA" | "RESPONDIDA";
  createdAt: string;
  updatedAt: string;
}): Pergunta => ({
  id: item.id,
  dataCadastro: formatDateTime(item.createdAt),
  nome: item.requesterName,
  email: item.requesterEmail,
  pergunta: item.question,
  respondido: item.status === "RESPONDIDA",
  respondidoEm: item.status === "RESPONDIDA" ? formatDateTime(item.updatedAt) : "",
  dataEnvio: formatDateTime(item.createdAt),
});

export default function SecretariaPage() {
  const { isCheckingAccess, token } = useProtectedRoute({
    allowedRoles: ["SECRETARIA"],
  });
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoad = useMemo(
    () => !isCheckingAccess && Boolean(token),
    [isCheckingAccess, token],
  );

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

  useEffect(() => {
    if (!canLoad || !token) {
      return;
    }

    const loadInquiries = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const items = await fetchInquiries(token);
        setPerguntas(items.map(mapApiToPergunta));
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Falha ao carregar perguntas.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadInquiries();
  }, [canLoad, token]);

  const handleToggleRespondido = async (id: string, responded: boolean) => {
    if (!token) {
      return;
    }

    setError(null);

    try {
      const updated = await updateInquiryResponded(token, id, responded);

      setPerguntas((prev) =>
        prev.map((item) =>
          item.id === id ? mapApiToPergunta(updated) : item,
        ),
      );
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Falha ao atualizar status da pergunta.";
      setError(message);
    }
  };

  if (isCheckingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Verificando permissao...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/70 to-rose-50 text-slate-900">
      {/* Efeitos de fundo */}
      <div className="pointer-events-none absolute -left-28 -top-28 h-[28rem] w-[28rem] rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-28 h-[30rem] w-[30rem] rounded-full bg-rose-500/25 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 lg:px-8">
        <div className="leading-none">
          <p className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Fatec
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            Jacareí
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-lg shadow-slate-900/5 backdrop-blur">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#15186d] text-white">
            <ShieldCheck size={18} />
          </div>

          <div className="pr-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {getRoleLabel(user?.role)}
            </p>

            <p className="font-bold text-slate-800">
              {user?.name || getRoleLabel(user?.role)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            title="Sair"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-red-600">
            Secretaria
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Perguntas Recebidas
          </h1>

          <div className="mt-4 h-1 w-16 rounded-full bg-[#15186d]" />

          <p className="mt-4 text-slate-600">
            Gerencie e acompanhe as dúvidas enviadas pelos alunos
            através do assistente virtual.
          </p>

          {error ? (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        {/* Tabela */}
        <TabelaPerguntas
          perguntas={perguntas}
          isLoading={isLoading}
          onToggleRespondido={handleToggleRespondido}
        />
      </section>
    </main>
  );
}