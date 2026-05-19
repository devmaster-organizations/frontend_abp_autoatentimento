"use client";

import TabelaPerguntas, { Pergunta } from "@/components/secretaria/TabelaPerguntas";

// Mock de dados simulando o que virá do seu back-end pronto
const listaPerguntasMock: Pergunta[] = [
  {
    id: "1",
    nome: "Carlos Silva",
    email: "carlos.silva@fatec.sp.gov.br",
    pergunta: "Qual o prazo final para a entrega da rematrícula do segundo semestre?",
    respondido: false,
    dataEnvio: "18/05/2026 - 14:32",
  },
  {
    id: "2",
    nome: "Mariana Souza",
    email: "mariana.souza@fatec.sp.gov.br",
    pergunta: "Como faço para solicitar a dispensa da disciplina de Programação Web?",
    respondido: true,
    dataEnvio: "17/05/2026 - 09:15",
  },
  {
    id: "3",
    nome: "Roberto Alencar",
    email: "roberto.alencar@gmail.com",
    pergunta: "Quando abre as inscrições para o próximo Vestibular da FATEC Jacareí?",
    respondido: false,
    dataEnvio: "18/05/2026 - 08:00",
  },
];

export default function SecretariaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/70 to-rose-50 text-slate-900">
      {/* Efeitos de bolhas ao fundo mantendo o design original */}
      <div className="pointer-events-none absolute -left-28 -top-28 h-[28rem] w-[28rem] rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-28 h-[30rem] w-[30rem] rounded-full bg-rose-500/25 blur-3xl" />

      {/* Header oficial da FATEC */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 lg:px-8">
        <div className="leading-none">
          <p className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Fatec
          </p>
          <p className="mt-2 text-2xl font-bold text-red-600">Jacareí</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-200/60 px-3 py-1.5 rounded-full">
            Painel Administrativo
          </span>
        </div>
      </header>

      {/* Seção Principal */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-red-600">
            Secretaria
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Perguntas Recebidas
          </h1>
          <div className="mt-4 h-1 w-16 rounded-full bg-[#15186d]" />
          <p className="mt-4 text-slate-600">
            Gerencie e acompanhe as dúvidas enviadas pelos alunos através do assistente virtual.
          </p>
        </div>

        {/* Componente da Tabela injetado aqui */}
        <TabelaPerguntas perguntasIniciais={listaPerguntasMock} />
      </section>
    </main>
  );
}