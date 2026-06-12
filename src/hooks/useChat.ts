import { useCallback, useMemo, useState } from "react";
import type { Role } from "@/store/slices/authSlice";
import {
  chatUserId,
  getContactById,
  getContactsForRole,
  seedThreadsForUser,
} from "@/data/chatMockData";
import type { ChatFilter, ChatMessage, ChatThread } from "@/types/chat";

const STORAGE_PREFIX = "edusphere:chat:";

function loadThreads(key: string, seed: () => ChatThread[]): ChatThread[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : seed();
  } catch {
    return seed();
  }
}

function saveThreads(key: string, threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(threads));
}

function newMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function newThreadId(contactId: string) {
  return `th-${contactId}-${Date.now()}`;
}

export function useChat(userEmail: string, userRole: Role) {
  const userId = chatUserId(userEmail);
  const storageKey = `${STORAGE_PREFIX}${userEmail.trim().toLowerCase()}`;

  const seed = useCallback(
    () => seedThreadsForUser(userEmail, userRole),
    [userEmail, userRole],
  );

  const [threads, setThreads] = useState<ChatThread[]>(() => loadThreads(storageKey, seed));
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [query, setQuery] = useState("");

  const contacts = useMemo(
    () => getContactsForRole(userRole, userId),
    [userRole, userId],
  );

  const persist = useCallback(
    (next: ChatThread[] | ((prev: ChatThread[]) => ChatThread[])) => {
      setThreads((prev) => {
        const updated = typeof next === "function" ? next(prev) : next;
        saveThreads(storageKey, updated);
        return updated;
      });
    },
    [storageKey],
  );

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;
  const activeContact = activeThread ? getContactById(activeThread.contactId) : undefined;

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return threads
      .filter((t) => (filter === "unread" ? t.unreadCount > 0 : true))
      .filter((t) => {
        if (!q) return true;
        const contact = getContactById(t.contactId);
        const preview = t.messages.at(-1)?.text ?? "";
        return (
          contact?.name.toLowerCase().includes(q) ||
          contact?.title.toLowerCase().includes(q) ||
          preview.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aTime = a.messages.at(-1)?.sentAt ?? "";
        const bTime = b.messages.at(-1)?.sentAt ?? "";
        return bTime.localeCompare(aTime);
      });
  }, [threads, filter, query]);

  const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  const openThread = useCallback(
    (threadId: string) => {
      setActiveThreadId(threadId);
      persist((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                unreadCount: 0,
                messages: t.messages.map((m) => ({ ...m, read: true })),
              }
            : t,
        ),
      );
    },
    [persist],
  );

  const startConversation = useCallback(
    (contactId: string) => {
      const existing = threads.find((t) => t.contactId === contactId);
      if (existing) {
        openThread(existing.id);
        return;
      }
      const id = newThreadId(contactId);
      const next: ChatThread = { id, contactId, messages: [], unreadCount: 0 };
      persist((prev) => [next, ...prev]);
      setActiveThreadId(id);
    },
    [threads, persist, openThread],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !activeThreadId) return;

      const message: ChatMessage = {
        id: newMessageId(),
        senderId: userId,
        text: trimmed,
        sentAt: new Date().toISOString(),
        read: true,
      };

      persist((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: [...t.messages, message] }
            : t,
        ),
      );
    },
    [activeThreadId, userId, persist],
  );

  const availableContacts = useMemo(() => {
    const activeIds = new Set(threads.map((t) => t.contactId));
    return contacts.filter((c) => !activeIds.has(c.id));
  }, [contacts, threads]);

  return {
    threads: filteredThreads,
    allThreads: threads,
    contacts,
    availableContacts,
    activeThread,
    activeContact,
    activeThreadId,
    setActiveThreadId,
    openThread,
    startConversation,
    sendMessage,
    filter,
    setFilter,
    query,
    setQuery,
    totalUnread,
  };
}
