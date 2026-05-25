const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get("slug") ?? "inicio";
  const optionLabel = searchParams.get("optionLabel");
  const optionTargetId = searchParams.get("optionTargetId");

  const backendQuery = new URLSearchParams();

  if (optionLabel) {
    backendQuery.set("optionLabel", optionLabel);
  }

  if (optionTargetId) {
    backendQuery.set("optionTargetId", optionTargetId);
  }

  const endpoint = `${API_BASE_URL}/navigation-logs/${slug}${
    backendQuery.toString() ? `?${backendQuery.toString()}` : ""
  }`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
      },
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));

    return Response.json(payload, { status: response.status });
  } catch {
    return Response.json(
      { message: "Falha ao buscar fluxo de chat." },
      { status: 502 },
    );
  }
}