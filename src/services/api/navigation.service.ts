import { apiRequest } from "./client";

export type NavigationNodeApi = {
  id: string;
  parentId: string | null;
  title: string;
  slug: string;
  prompt: string | null;
  answerSummary: string | null;
  responseType: "TEXT" | "LINK";
  linkLabel: string | null;
  linkUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  children?: NavigationNodeApi[];
};

export type CreateNavigationNodeInput = {
  parentId: string | null;
  title: string;
  slug: string;
  answerSummary: string | null;
  responseType?: "TEXT" | "LINK";
  linkLabel?: string | null;
  linkUrl?: string | null;
  isActive: boolean;
  displayOrder?: number;
};

export type UpdateNavigationNodeInput = {
  title?: string;
  answerSummary?: string | null;
  responseType?: "TEXT" | "LINK";
  linkLabel?: string | null;
  linkUrl?: string | null;
  isActive?: boolean;
};

export async function listNavigationNodes(token: string) {
  return apiRequest<NavigationNodeApi[]>("/navigation-logs?onlyActive=false", {
    method: "GET",
    token,
  });
}

export async function createNavigationNode(token: string, payload: CreateNavigationNodeInput) {
  return apiRequest<NavigationNodeApi>("/navigation-logs", {
    method: "POST",
    token,
    body: {
      parentId: payload.parentId,
      title: payload.title,
      slug: payload.slug,
      answerSummary: payload.answerSummary,
      responseType: payload.responseType ?? "TEXT",
      linkLabel: payload.linkLabel ?? null,
      linkUrl: payload.linkUrl ?? null,
      displayOrder: payload.displayOrder ?? 0,
      isActive: payload.isActive,
    },
  });
}

export async function updateNavigationNode(token: string, nodeId: string, payload: UpdateNavigationNodeInput) {
  return apiRequest<NavigationNodeApi>(`/navigation-logs/${nodeId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}
