"use client";

import { useState } from "react";

// Definição dos dados que vêm do Back-End
export type Pergunta = {
  id: string;
  nome: string;
  email: string;
  pergunta: string;
  respondido: boolean;
  dataEnvio: string;
};

type TabelaPerguntasProps = {
  perguntasIniciais: Pergunta[];
};

export default function TabelaPerguntas({ perguntasIniciais }: TabelaPerguntasProps) {
  const [perguntas, setPerguntas] = useState<Pergunta[]>(perguntasIniciais);

  // Função para alternar o estado do checkbox (pode ser integrada com seu back-end depois)
  const handleToggleRespondido = (id: string) => {
    setPerguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, respondido: !p.respondido } : p))
    );
  };

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/70 bg-white/70 shadow-2xl shadow-slate-900/5 backdrop-blur">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-[#15186d] text-xs uppercase tracking-wider text-white">
          <tr>
            <th className="px-6 py-4 font-black">Nome</th>
            <th className="px-6 py-4 font-black">E-mail</th>
            <th className="px-6 py-4 font-black">Pergunta</th>
            <th className="px-6 py-4 font-black">Data</th>
            <th className="px-6 py-4 font-black text-center">Respondido</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {perguntas.map((p) => (
            <tr key={p.id} className="transition hover:bg-white/50">
              <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-900">
                {p.nome}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                {p.email}
              </td>
              <td className="px-6 py-4 text-slate-700 max-w-xs md:max-w-md break-words">
                {p.pergunta}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                {p.dataEnvio}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={p.respondido}
                  onChange={() => handleToggleRespondido(p.id)}
                  className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600 transition"
                />
              </td>
            </tr>
          ))}
          {perguntas.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center font-medium text-slate-500">
                Nenhuma pergunta cadastrada no momento.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}