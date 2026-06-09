/**representação da tabela no bd... */
export type NodeType = "MENU" | "RESPOSTA";

export interface ChatNode {
  id: string;
  parent_id: string | null;
  titulo_botao: string;
  conteudo_resposta?: string;
  link_url?: string | null;
  link_label?: string | null;
  tipo_no: NodeType;
  ordem: number;
  status: boolean;
  slug: string;
  response_type: "TEXT" | "LINK";
  children?: ChatNode[];
}