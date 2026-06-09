export type ChatMessage = {
  id: number;
  sender: "bot" | "user";
  text: string;
  link?: {
    href: string;
    label: string;
  };
};