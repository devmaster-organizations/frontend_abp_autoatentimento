import type { FluxoOpcao } from "@/data/fluxo";

type ChatOptionsProps = {
  options: FluxoOpcao[];
  onSelect: (option: FluxoOpcao) => void;
};

export function ChatOptions({ options, onSelect }: ChatOptionsProps) {
  return (
    <div className="ml-0 flex max-w-3xl flex-wrap gap-3 sm:ml-14">
      {options.map((option) => (
        <button
          key={`${option.label}-${option.nextId}`}
          type="button"
          onClick={() => onSelect(option)}
          className="flex min-h-14 min-w-52 items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-white/85 px-5 text-left text-base font-bold text-slate-800 shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-lg"
        >
          <span>{option.label}</span>
          <span className="text-red-600" aria-hidden="true">
            →
          </span>
        </button>
      ))}
    </div>
  );
}
