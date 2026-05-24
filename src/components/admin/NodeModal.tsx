"use client";

import { ChatNode } from "@/types/chat-node";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  node?: ChatNode | null;
  onClose: () => void;
}

export default function NodeModal({
  open,
  mode,
  node,
  onClose,
}: Props) {
  if (!open) return null;

  const title =
    mode === "create"
      ? "Incluir Novo Nó"
      : "Alterar Nó";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/30 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
        
        {/* BOTÃO FECHAR */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-red-100 hover:text-red-600"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-red-600">
            Painel Administrativo
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-3 text-slate-500">
            Gerencie as informações da árvore de perguntas e respostas.
          </p>
        </div>

        {/* FORM */}
        <div className="mt-10 grid gap-6">
          
          {/* TÍTULO */}
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-700">
              Título do botão
            </label>

            <input
              type="text"
              defaultValue={node?.titulo_botao ?? ""}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-slate-800 outline-none transition focus:border-[#15186d] focus:ring-4 focus:ring-indigo-100"
              placeholder="Digite o título do nó"
            />
          </div>

          {/* TIPO */}
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-700">
              Tipo do nó
            </label>

            <select
              defaultValue={node?.tipo_no ?? "MENU"}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-slate-800 outline-none transition focus:border-[#15186d] focus:ring-4 focus:ring-indigo-100"
            >
              <option value="MENU">MENU</option>
              <option value="RESPOSTA">RESPOSTA</option>
            </select>
          </div>

          {/* CONTEÚDO */}
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-700">
              Conteúdo da resposta
            </label>

            <textarea
              defaultValue={node?.conteudo_resposta ?? ""}
              rows={5}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-slate-800 outline-none transition focus:border-[#15186d] focus:ring-4 focus:ring-indigo-100"
              placeholder="Digite a resposta exibida ao usuário"
            />
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4">
            <div>
              <p className="font-bold text-slate-800">
                Status
              </p>

              <p className="text-sm text-slate-500">
                Defina se o nó ficará ativo.
              </p>
            </div>

            <button className="relative flex h-7 w-14 items-center rounded-full bg-emerald-500 p-1">
              <span className="h-5 w-5 translate-x-7 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button className="rounded-2xl bg-gradient-to-r from-[#15186d] to-red-600 px-7 py-3 font-black text-white shadow-xl shadow-red-900/20 transition hover:-translate-y-0.5">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}