"use client";

import { useMemo, useState } from "react";
import { fluxo, START_NODE_ID, type FluxoOpcao } from "@/data/fluxo";
import { ChatBubble } from "./ChatBubble";
import { ChatOptions } from "./ChatOptions";
import type { ChatMessage } from "./types";

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "bot",
    text: fluxo[START_NODE_ID].botMessage,
  },
];

export default function Chat() {
  const [currentNodeId, setCurrentNodeId] = useState(START_NODE_ID);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const currentNode = useMemo(() => fluxo[currentNodeId], [currentNodeId]);

  function handleSelect(option: FluxoOpcao) {
    const nextNode = fluxo[option.nextId];

    if (!nextNode) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: currentMessages.length + 1,
        sender: "user",
        text: option.label,
      },
      {
        id: currentMessages.length + 2,
        sender: "bot",
        text: nextNode.botMessage,
      },
    ]);

    setCurrentNodeId(nextNode.id);
  }

  function restartConversation() {
    setCurrentNodeId(START_NODE_ID);
    setMessages(initialMessages);
  }

  return (
    <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/70 to-rose-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-28 top-4 h-96 w-96 rounded-full bg-indigo-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-rose-500/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-150px)] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/75 bg-white/70 shadow-2xl shadow-slate-900/10 backdrop-blur">
        <div className="flex items-center justify-between gap-4 border-b border-white/80 bg-white/55 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
              Fatec Virtual Assistant
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-900">
              Como posso ajudar?
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Online agora
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 pb-28 sm:px-8">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          <ChatOptions options={currentNode.options} onSelect={handleSelect} />
        </div>

        <button
          type="button"
          onClick={restartConversation}
          className="absolute bottom-6 right-6 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-red-900/20 transition hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          aria-label="Reiniciar atendimento"
          title="Reiniciar atendimento"
        >
          Reiniciar
        </button>
      </div>
    </section>
  );
}
