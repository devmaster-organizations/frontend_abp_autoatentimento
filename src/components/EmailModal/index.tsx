"use client";

import { FormEvent, useEffect, useState } from "react";

export type EmailFormPayload = {
  name: string;
  email: string;
  message: string;
};

type EmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: EmailFormPayload) => Promise<void> | void;
};

const initialForm: EmailFormPayload = {
  name: "",
  email: "",
  message: "",
};

export default function EmailModal({
  isOpen,
  onClose,
  onSubmit,
}: EmailModalProps) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    await onSubmit?.({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });

    setStatus("sent");
    setForm(initialForm);
  }

  const isSending = status === "sending";

  return (
    <div
      aria-labelledby="email-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Fechar modal de email"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />

      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-slate-950/25">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#15186d] to-red-600" />

        <div className="px-6 pb-7 pt-8 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
                Fale com a Fatec
              </p>
              <h2
                className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl"
                id="email-modal-title"
              >
                Envie seu email
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Preencha seus dados para encaminhar sua mensagem ao atendimento.
              </p>
            </div>

            <button
              aria-label="Fechar"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xl font-black text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              onClick={onClose}
              type="button"
            >
              x
            </button>
          </div>

          <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Nome
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15186d] focus:bg-white focus:ring-4 focus:ring-[#15186d]/10"
                name="name"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    name: event.target.value,
                  }))
                }
                placeholder="Seu nome"
                required
                type="text"
                value={form.name}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Email
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15186d] focus:bg-white focus:ring-4 focus:ring-[#15186d]/10"
                name="email"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    email: event.target.value,
                  }))
                }
                placeholder="seu.email@exemplo.com"
                required
                type="email"
                value={form.email}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Texto
              <textarea
                className="min-h-36 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15186d] focus:bg-white focus:ring-4 focus:ring-[#15186d]/10"
                name="message"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    message: event.target.value,
                  }))
                }
                placeholder="Digite sua mensagem"
                required
                value={form.message}
              />
            </label>

            {status === "sent" ? (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                Mensagem preparada para envio. A integração com o backend pode
                usar esses dados do formulário.
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
              <button
                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                onClick={onClose}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="rounded-2xl bg-gradient-to-r from-[#15186d] to-red-600 px-7 py-3 text-sm font-black text-white shadow-xl shadow-red-900/20 transition hover:-translate-y-0.5 hover:shadow-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSending}
                type="submit"
              >
                {isSending ? "Enviando..." : "Enviar email"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
