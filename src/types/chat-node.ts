/**representação da tabela no bd... */
export type NodeType = "MENU" | "RESPOSTA";

export interface ChatNode {
  id: number;
  parent_id: number | null;
  titulo_botao: string;
  conteudo_resposta?: string;
  tipo_no: NodeType;
  ordem: number;
  status: boolean;
  children?: ChatNode[]
}