"use client";

import { ChatNode } from "@/types/chat-node";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type NodeModalPayload = {
  title: string;
  nodeType: "MENU" | "RESPOSTA";
  answerSummary: string;
  linkUrl: string;
  isActive: boolean;
};

interface Props {
  open: boolean;
  mode: "create" | "edit";
  node?: ChatNode | null;
  onClose: () => void;
  onSubmit: (payload: NodeModalPayload) => Promise<void>;
  isSubmitting: boolean;
}

export default function NodeModal({
  open,
  mode,
  node,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  const [titleInput, setTitleInput] = useState("");
  const [nodeType, setNodeType] = useState<"MENU" | "RESPOSTA">("MENU");
  const [answerSummary, setAnswerSummary] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitleInput(node?.titulo_botao ?? "");
    setNodeType(node?.tipo_no ?? "MENU");
    setAnswerSummary(node?.conteudo_resposta ?? "");
    setLinkUrl(node?.link_url ?? "");
    setIsActive(node?.status ?? true);
    setFormError(null);
  }, [open, node]);

  if (!open) return null;

  const title =
    mode === "create"
      ? "Incluir Novo Nó"
      : "Alterar Nó";

  const handleSubmit = async () => {
    setFormError(null);

    if (!titleInput.trim()) {
      setFormError("Informe o titulo do no.");
      return;
    }

    const normalizedLinkUrl = linkUrl.trim();

    if (normalizedLinkUrl) {
      const looksLikeUrl = /^https?:\/\//i.test(normalizedLinkUrl);

      if (!looksLikeUrl) {
        setFormError("O link deve comecar com http:// ou https://.");
        return;
      }
    }

    try {
      await onSubmit({
        title: titleInput.trim(),
        nodeType,
        answerSummary: answerSummary.trim(),
        linkUrl: normalizedLinkUrl,
        isActive,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao salvar no.";
      setFormError(message);
    }
  };

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
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
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
              value={nodeType}
              onChange={(event) => setNodeType(event.target.value as "MENU" | "RESPOSTA")}
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
              value={answerSummary}
              onChange={(event) => setAnswerSummary(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-slate-800 outline-none transition focus:border-[#15186d] focus:ring-4 focus:ring-indigo-100"
              placeholder="Digite a resposta exibida ao usuário"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-700">
              Link (opcional)
            </label>

            <input
              type="url"
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-slate-800 outline-none transition focus:border-[#15186d] focus:ring-4 focus:ring-indigo-100"
              placeholder="https://www.cps.sp.gov.br"
            />

            <p className="mt-2 text-xs font-semibold text-slate-500">
              Se preenchido, o chat exibira este link como hiperlink para o usuario.
            </p>
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

            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative flex h-7 w-14 items-center rounded-full p-1 transition ${isActive ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <span className={`h-5 w-5 rounded-full bg-white shadow-md transition ${isActive ? "translate-x-7" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {formError ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {formError}
          </p>
        ) : null}

        {/* FOOTER */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl bg-gradient-to-r from-[#15186d] to-red-600 px-7 py-3 font-black text-white shadow-xl shadow-red-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}