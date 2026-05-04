import type { ChatMessage } from "./types";

type ChatBubbleProps = {
  message: ChatMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[85%] items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      >
        <div
          aria-hidden="true"
          className={`mt-1 h-12 w-12 shrink-0 rounded-full border-[12px] border-zinc-300 ${
            isUser ? "bg-emerald-400" : "bg-violet-700"
          }`}
        />

        <p
          className={`inline-flex max-w-full items-center justify-center break-words rounded-[30px] border px-6 py-3 text-center text-lg leading-relaxed shadow-sm ${
            isUser
              ? "border-blue-400 bg-cyan-100 text-zinc-950"
              : "border-emerald-500 bg-green-100 text-zinc-950"
          }`}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
}
