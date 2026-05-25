"use client";

import { useEffect, useMemo, useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatOptions } from "./ChatOptions";
import type { ChatMessage } from "./types";

type ChatOption = {
  label: string;
  nextSlug: string;
  nextId: string;
};

type ChatNodeApi = {
  id: string;
  slug: string;
  title: string;
  prompt: string | null;
  answerSummary: string | null;
  children: Array<{
    id: string;
    slug: string;
    title: string;
  }>;
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "bot",
    text: "Carregando atendimento...",
  },
];

const START_NODE_SLUG = "inicio";

const getNodeMessage = (node: ChatNodeApi): string =>
  node.answerSummary || node.prompt || node.title;

export default function Chat() {
  const [currentNodeSlug, setCurrentNodeSlug] = useState(START_NODE_SLUG);
  const [currentNode, setCurrentNode] = useState<ChatNodeApi | null>(null);
  const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedOptions = useMemo(
    () => currentOptions.map((option) => ({ label: option.label, nextId: option.nextSlug })),
    [currentOptions],
  );

  const fetchNode = async (params: {
    slug: string;
    optionLabel?: string;
    optionTargetId?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams({ slug: params.slug });

    if (params.optionLabel) {
      query.set("optionLabel", params.optionLabel);
    }

    if (params.optionTargetId) {
      query.set("optionTargetId", params.optionTargetId);
    }

    const response = await fetch(`/api/chat?${query.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const payload = (await response.json()) as ChatNodeApi & { message?: string };

    if (!response.ok) {
      throw new Error(payload?.message ?? "Nao foi possivel carregar o fluxo.");
    }

    setCurrentNode(payload);
    setCurrentNodeSlug(payload.slug);
    setCurrentOptions(
      (payload.children ?? []).map((child) => ({
        label: child.title,
        nextSlug: child.slug,
        nextId: child.id,
      })),
    );

    setIsLoading(false);
    return payload;
  };

  useEffect(() => {
    const loadInitialNode = async () => {
      try {
        const node = await fetchNode({ slug: START_NODE_SLUG });
        setMessages([
          {
            id: 1,
            sender: "bot",
            text: getNodeMessage(node),
          },
        ]);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Falha ao carregar chat.";
        setError(message);
        setIsLoading(false);
      }
    };

    void loadInitialNode();
  }, []);

  async function handleSelect(option: { label: string; nextId: string }) {
    const selectedOption = currentOptions.find((item) => item.nextSlug === option.nextId);

    if (!selectedOption) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: currentMessages.length + 1,
        sender: "user",
        text: selectedOption.label,
      },
    ]);

    try {
      const nextNode = await fetchNode({
        slug: selectedOption.nextSlug,
        optionLabel: selectedOption.label,
        optionTargetId: selectedOption.nextId,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: currentMessages.length + 1,
          sender: "bot",
          text: getNodeMessage(nextNode),
        },
      ]);
    } catch (selectError) {
      const message = selectError instanceof Error ? selectError.message : "Falha ao navegar no fluxo.";
      setError(message);
      setIsLoading(false);
    }
  }

  async function restartConversation() {
    try {
      const node = await fetchNode({ slug: START_NODE_SLUG });
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: getNodeMessage(node),
        },
      ]);
    } catch (restartError) {
      const message = restartError instanceof Error ? restartError.message : "Falha ao reiniciar conversa.";
      setError(message);
      setIsLoading(false);
    }
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

          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <p className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700">
              Carregando opcoes...
            </p>
          ) : null}

          <ChatOptions options={normalizedOptions} onSelect={handleSelect} />
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
