"use client";

interface Props {
  active: boolean;
  onToggle: () => void;
}

export default function StatusBadge({
  active,
  onToggle,
}: Props) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative flex h-7 w-14 items-center rounded-full p-1 transition-all duration-300
        ${active ? "bg-emerald-500" : "bg-slate-300"}
      `}
    >
      <span
        className={`
          h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300
          ${active ? "translate-x-7" : "translate-x-0"}
        `}
      />
    </button>
  );
}