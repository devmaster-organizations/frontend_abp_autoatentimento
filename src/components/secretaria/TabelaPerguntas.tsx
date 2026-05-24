// components/secretaria/TabelaPerguntas.tsx

"use client";

// Dados vindos do back-end
export type Pergunta = {
  id: string;
  dataCadastro: string;
  nome: string;
  email: string;
  pergunta: string;
  respondido: boolean;
  respondidoEm?: string;
  dataEnvio: string;
};

type TabelaPerguntasProps = {
  perguntas: Pergunta[];
  isLoading?: boolean;
  onToggleRespondido: (id: string, responded: boolean) => Promise<void> | void;
};

export default function TabelaPerguntas({
  perguntas,
  isLoading = false,
  onToggleRespondido,
}: TabelaPerguntasProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-white/70 bg-white/70 shadow-2xl shadow-slate-900/5 backdrop-blur">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-[#15186d] text-xs uppercase tracking-wider text-white">
          <tr>
            <th className="px-6 py-4 font-black">
              Data Cadastro
            </th>

            <th className="px-6 py-4 font-black">
              Nome
            </th>

            <th className="px-6 py-4 font-black">
              E-mail
            </th>

            <th className="px-6 py-4 font-black">
              Pergunta
            </th>

            <th className="px-6 py-4 font-black">
              Data Envio
            </th>

            <th className="px-6 py-4 text-center font-black">
              Respondido
            </th>

            <th className="px-6 py-4 font-black">
              Respondido em
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {perguntas.map((p) => (
            <tr
              key={p.id}
              className="transition hover:bg-white/50"
            >
              <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                {p.dataCadastro}
              </td>

              <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-900">
                {p.nome}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                {p.email}
              </td>

              <td className="max-w-xs break-words px-6 py-4 text-slate-700 md:max-w-md">
                {p.pergunta}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                {p.dataEnvio}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={p.respondido}
                  onChange={() => onToggleRespondido(p.id, !p.respondido)}
                  disabled={isLoading}
                  className="h-5 w-5 cursor-pointer rounded border-slate-300 accent-red-600 transition focus:ring-red-500"
                />
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                {p.respondidoEm || "-"}
              </td>
            </tr>
          ))}

          {isLoading && (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center font-medium text-slate-500"
              >
                Carregando perguntas...
              </td>
            </tr>
          )}

          {!isLoading && perguntas.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center font-medium text-slate-500"
              >
                Nenhuma pergunta cadastrada no momento.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}