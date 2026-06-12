import type { Role } from "@/store/slices/authSlice";

export interface ChatContact {
  id: string;
  name: string;
  role: Role;
  title: string;
  avatar: string;
  online?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  read?: boolean;
}

export interface ChatThread {
  id: string;
  contactId: string;
  messages: ChatMessage[];
  unreadCount: number;
}

export type ChatFilter = "all" | "unread";
