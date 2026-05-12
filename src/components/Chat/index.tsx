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

type ChatProps = {
  onBackHome?: () => void;
};

export default function Chat({ onBackHome }: ChatProps) {
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
    <section className="min-h-[calc(100vh-58px)] bg-zinc-50 px-6 py-6">
      <div className="relative mx-auto flex min-h-[calc(100vh-110px)] w-full max-w-5xl flex-col rounded-[24px] border border-zinc-400 bg-zinc-300 px-8 py-8 shadow-[0_0_16px_rgba(0,0,0,0.30)]">
        <div className="flex-1 space-y-5 pb-8">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          <ChatOptions options={currentNode.options} onSelect={handleSelect} />
        </div>

        <button
          type="button"
          onClick={restartConversation}
          className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center bg-red-600 text-xl font-bold text-black shadow-md transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          aria-label="Reiniciar atendimento"
          title="Reiniciar atendimento"
        >
          ▲
        </button>

        {onBackHome ? (
          <button
            type="button"
            onClick={onBackHome}
            className="fixed bottom-6 left-6 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          >
            Voltar ao início
          </button>
        ) : null}
      </div>
    </section>
  );
}
