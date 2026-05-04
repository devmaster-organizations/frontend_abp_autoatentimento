import type { FluxoOpcao } from "@/data/fluxo";

type ChatOptionsProps = {
  options: FluxoOpcao[];
  onSelect: (option: FluxoOpcao) => void;
};

export function ChatOptions({ options, onSelect }: ChatOptionsProps) {
  return (
    <div className="ml-16 flex max-w-3xl flex-wrap gap-4">
      {options.map((option) => (
        <button
          key={`${option.label}-${option.nextId}`}
          type="button"
          onClick={() => onSelect(option)}
          className="flex min-h-14 min-w-52 items-center justify-between gap-4 rounded-[22px] border border-emerald-500 bg-green-100 px-5 text-left text-lg text-zinc-950 transition hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
