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
          className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow-lg ${
            isUser
              ? "bg-gradient-to-br from-red-500 to-red-700"
              : "bg-gradient-to-br from-[#15186d] to-[#252a99]"
          }`}
        >
          {isUser ? "EU" : "FA"}
        </div>

        <p
          className={`inline-flex max-w-full items-center justify-center break-words rounded-3xl border px-6 py-4 text-base leading-relaxed shadow-xl sm:text-lg ${
            isUser
              ? "border-orange-200 bg-red-600 text-white shadow-red-900/10"
              : "border-gray-200 bg-white text-slate-800 shadow-slate-900/5"
          }`}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
}
