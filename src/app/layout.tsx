import type { Metadata } from "next";
import { SessionHydrator } from "@/components/auth/SessionHydrator";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Autoatendimento Fatec Jacareí",
  description: "Projeto de autoatendimento para a Fatec Jacareí, desenvolvido por alunos do curso de Análise e Desenvolvimento de Sistemas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionHydrator />
        {children}
      </body>
    </html>
  );
}
