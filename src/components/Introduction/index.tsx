"use client";

import Image from "next/image";

type IntroductionProps = {
  onStart: () => void;
};

const features = [
  {
    icon: "💬",
    title: "Respostas rápidas",
    description: "Atendimento 24h",
  },
  {
    icon: "🎓",
    title: "Informações confiáveis",
    description: "Dados oficiais",
  },
  {
    icon: "🔒",
    title: "Navegação simples",
    description: "Fácil de utilizar",
  },
];

export default function Introduction({ onStart }: IntroductionProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/70 to-rose-50 text-slate-900">
      <div className="pointer-events-none absolute -left-28 -top-28 h-[28rem] w-[28rem] rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-28 h-[30rem] w-[30rem] rounded-full bg-rose-500/25 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 lg:px-8">
        <div className="leading-none">
          <p className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Fatec
          </p>
          <p className="mt-2 text-2xl font-bold text-red-600">Jacareí</p>
        </div>

        <nav className="hidden items-center gap-9 text-sm font-semibold text-slate-950 lg:flex">
          <a className="transition hover:text-red-600" href="#inicio">
            Início
          </a>
          <a className="transition hover:text-red-600" href="#cursos">
            Cursos
          </a>
          <a className="transition hover:text-red-600" href="#atendimento">
            Atendimento
          </a>
          <a className="transition hover:text-red-600" href="#sobre">
            Sobre
          </a>
          <a className="transition hover:text-red-600" href="#contato">
            Contato
          </a>
        </nav>

        <button
          className="rounded-2xl bg-[#15186d] px-7 py-3 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#20258f] focus:outline-none focus:ring-2 focus:ring-[#15186d] focus:ring-offset-2"
          type="button"
        >
          Login
        </button>
      </header>

      <section
        id="inicio"
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-12 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-20"
      >
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-red-600">
            Fatec Virtual Assistant
          </p>

          <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Atendimento
            <br />
            Inteligente da
            <br />
            <span className="text-red-600">FATEC Jacareí</span>
          </h1>

          <div className="mt-9 h-1 w-16 rounded-full bg-[#15186d]" />

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            Tire dúvidas sobre cursos, disciplinas, horários, vestibular,
            matrículas e muito mais através do nosso assistente virtual.
          </p>

          <div className="mt-10 grid max-w-2xl gap-5 sm:grid-cols-3">
            {features.map((feature) => (
              <article
                className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur"
                key={feature.title}
              >
                <span className="text-3xl" aria-hidden="true">
                  {feature.icon}
                </span>
                <h2 className="mt-4 text-base font-black leading-snug text-slate-900">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm text-slate-500">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>

          <button
            className="mt-9 rounded-2xl bg-gradient-to-r from-[#15186d] to-red-600 px-9 py-4 text-base font-black text-white shadow-2xl shadow-red-900/20 transition hover:-translate-y-1 hover:shadow-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            type="button"
            onClick={onStart}
          >
            Iniciar Atendimento →
          </button>

          <p className="mt-5 text-sm font-medium text-slate-500">
            🔒 Atendimento seguro e 100% online
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative flex aspect-square w-full max-w-[31rem] items-center justify-center rounded-[2.25rem] border border-white/70 bg-white/50 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
            <Image
              alt="Robô assistente virtual da Fatec"
              className="w-[76%] animate-[float_4s_ease-in-out_infinite]"
              height={512}
              src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              width={512}
            />

            <div className="absolute right-7 top-16 max-w-[14rem] rounded-3xl bg-[#1b1f72] px-5 py-4 text-base font-medium leading-7 text-white shadow-2xl shadow-slate-900/20">
              Olá! 👋
              <br />
              Como posso ajudar você hoje?
            </div>
          </div>
        </div>
      </section>

      <section
        id="contato"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 lg:px-8"
      >
        <div className="grid gap-8 rounded-3xl border border-white/70 bg-white/70 px-7 py-8 shadow-2xl shadow-slate-900/5 backdrop-blur md:grid-cols-[1fr_1fr_auto] md:items-center lg:px-10">
          <div>
            <h2 className="text-lg font-black text-slate-900">📍 Localização</h2>
            <p className="mt-3 font-bold text-slate-800">
              Av. Eng. Davi Monteiro Lino, 3595
            </p>
            <p className="mt-1 text-slate-500">Jacareí - SP</p>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900">
              🕒 Funcionamento
            </h2>
            <p className="mt-3 font-bold text-slate-800">Segunda à Sexta</p>
            <p className="mt-1 text-slate-500">07h às 23h</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-3xl font-black text-slate-900">
            <span>Fatec</span>
            <span>CPS</span>
            <span>São Paulo</span>
          </div>
        </div>
      </section>
    </main>
  );
}
