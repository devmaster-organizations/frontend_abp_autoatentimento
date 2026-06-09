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

export type InquirySendInput = {
  requesterName: string;
  requesterEmail: string;
  question: string;
  copyEmail?: string | null;
};

export type InquiryDeliveryInfo = {
  messageId: string;
  accepted: string[];
  rejected: string[];
  response: string;
};

export type InquirySendResponse = InquiryApiItem & {
  delivery: InquiryDeliveryInfo | null;
};

export type InquiryEmailConfigApi = {
  configured: boolean;
  id: string | null;
  recipientEmail: string | null;
  ccEmail: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  isActive?: boolean | null;
};

export type InquiryEmailConfigInput = {
  recipientEmail: string;
  ccEmail?: string | null;
};

export type InquiryEmailConfigUpdateResponse = {
  id: string;
  recipientEmail: string;
  ccEmail: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function sendInquiry(payload: InquirySendInput) {
  return apiRequest<InquirySendResponse>("/inquiries/send", {
    method: "POST",
    body: payload,
  });
}

export async function fetchInquiries(token: string) {
  return apiRequest<InquiryApiItem[]>("/inquiries", {
    method: "GET",
    token,
  });
}

export async function fetchInquiryEmailConfig(token: string) {
  return apiRequest<InquiryEmailConfigApi>("/inquiries/email-config", {
    method: "GET",
    token,
  });
}

export async function updateInquiryEmailConfig(
  token: string,
  payload: InquiryEmailConfigInput,
) {
  return apiRequest<InquiryEmailConfigUpdateResponse>("/inquiries/email-config", {
    method: "PUT",
    token,
    body: payload,
  });
}

export async function updateInquiryResponded(token: string, inquiryId: string, responded: boolean) {
  return apiRequest<InquiryApiItem>(`/inquiries/${inquiryId}/responded`, {
    method: "PATCH",
    token,
    body: { responded },
  });
}
