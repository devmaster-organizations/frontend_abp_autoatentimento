import { apiRequest } from "./client";

export type InquiryApiItem = {
  id: string;
  requesterName: string;
  requesterEmail: string;
  question: string;
  status: "ABERTA" | "RESPONDIDA";
  createdAt: string;
  updatedAt: string;
  answeredBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export async function fetchInquiries(token: string) {
  return apiRequest<InquiryApiItem[]>("/inquiries", {
    method: "GET",
    token,
  });
}

export async function updateInquiryResponded(token: string, inquiryId: string, responded: boolean) {
  return apiRequest<InquiryApiItem>(`/inquiries/${inquiryId}/responded`, {
    method: "PATCH",
    token,
    body: { responded },
  });
}
