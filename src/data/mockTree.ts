import { ChatNode } from "@/types/chat-node";

export const mockTree: ChatNode[] = [
  {
    id: 1,
    parent_id: null,
    titulo_botao: "CURSO DSM (DESENV. SOFTWARE MULTIPLATAFORMA)",
    tipo_no: "MENU",
    ordem: 1,
    status: true,
    children: [
      {
        id: 2,
        parent_id: 1,
        titulo_botao: "VESTIBULAR",
        tipo_no: "MENU",
        ordem: 1,
        status: true,
        children: [
          {
            id: 3,
            parent_id: 2,
            titulo_botao: "INSCRIÇÕES",
            tipo_no: "MENU",
            ordem: 1,
            status: true,
            children: [
              {
                id: 4,
                parent_id: 3,
                titulo_botao: "DOCUMENTOS NECESSÁRIOS",
                conteudo_resposta:
                  "RG, CPF, Histórico Escolar e comprovante de residência.",
                tipo_no: "RESPOSTA",
                ordem: 1,
                status: true,
              },
            ],
          },
        ],
      },
      {
        id: 5,
        parent_id: 1,
        titulo_botao: "HORÁRIOS",
        tipo_no: "MENU",
        ordem: 2,
        status: true,
        children: [
          {
            id: 6,
            parent_id: 5,
            titulo_botao: "MANHÃ",
            conteudo_resposta: "Aulas das 07h às 12h40.",
            tipo_no: "RESPOSTA",
            ordem: 1,
            status: true,
          },
          {
            id: 7,
            parent_id: 5,
            titulo_botao: "TARDE",
            conteudo_resposta: "Aulas das 13h às 18h40.",
            tipo_no: "RESPOSTA",
            ordem: 2,
            status: true,
          },
          {
            id: 8,
            parent_id: 5,
            titulo_botao: "NOITE",
            conteudo_resposta: "Aulas das 19h às 22h40.",
            tipo_no: "RESPOSTA",
            ordem: 3,
            status: true,
          },
        ],
      },
    ],
  },
];