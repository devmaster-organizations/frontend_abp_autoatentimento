export async function POST(req: Request) {
  const body = await req.json();

  let resposta = "";

  if (body.tipo === "curso") {
    resposta = "Informações sobre cursos da Fatec";
  }

  if (body.tipo === "geral") {
    resposta = "Dúvidas gerais da secretaria acadêmica";
  }

  return Response.json({ resposta });
}