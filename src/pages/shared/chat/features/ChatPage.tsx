import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "@/store/store";
import { useChat } from "@/hooks/useChat";
import { chatUserId, getContactById } from "@/data/chatMockData";
import type { ChatThread } from "@/types/chat";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function threadPreview(thread: ChatThread) {
  const last = thread.messages.at(-1);
  return last?.text ?? "No messages yet";
}

function RoleBadge({ role }: { role: string }) {
  const tones: Record<string, string> = {
    admin: "bg-primary/10 text-primary",
    teacher: "bg-accent/15 text-accent-foreground",
    faculty: "bg-warning/15 text-warning-foreground",
    student: "bg-success/15 text-success",
  };
  return (
    <span className={cn("text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded", tones[role] ?? "bg-muted text-muted-foreground")}>
      {role}
    </span>
  );
}

export default function ChatPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [showNewChat, setShowNewChat] = useState(false);
  const [draft, setDraft] = useState("");
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = useChat(user?.email ?? "", user?.role ?? "student");
  const myId = user ? chatUserId(user.email) : "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.activeThread?.messages.length, chat.activeThreadId]);

  if (!user) return null;

  const handleOpenThread = (threadId: string) => {
    chat.openThread(threadId);
    setMobileShowThread(true);
  };

  const handleBack = () => {
    setMobileShowThread(false);
    chat.setActiveThreadId(null);
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    chat.sendMessage(draft);
    setDraft("");
  };

  const handleStartChat = (contactId: string) => {
    chat.startConversation(contactId);
    setShowNewChat(false);
    setMobileShowThread(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Communication</p>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-7 h-7 text-primary" />
            Messages
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user.role === "admin" && "Chat with teachers, faculty, and students across the institution."}
            {user.role === "teacher" && "Message your students, faculty colleagues, and administration."}
            {user.role === "faculty" && "Coordinate with students, teachers, and admin staff."}
            {user.role === "student" && "Reach your teachers, faculty advisors, and campus admin."}
          </p>
        </div>
        {chat.totalUnread > 0 && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {chat.totalUnread} unread
          </span>
        )}
      </div>

      <div className="glass-card rounded-2xl border border-border/60 shadow-elegant overflow-hidden h-[calc(100dvh-11rem)] min-h-[520px] flex modal-gradient-bg">
        {/* Conversation list */}
        <aside
          className={cn(
            "flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm w-full md:w-[320px] lg:w-[360px] shrink-0",
            mobileShowThread && "hidden md:flex",
          )}
        >
          <div className="p-4 border-b border-border/50 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-sm">Conversations</h2>
              <button
                type="button"
                onClick={() => setShowNewChat((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium gradient-primary text-primary-foreground shadow-elegant"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                New
              </button>
            </div>

            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={chat.query}
                onChange={(e) => chat.setQuery(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border/60 bg-white dark:bg-card text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-1 p-1 rounded-lg bg-muted/60">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => chat.setFilter(f)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition",
                    chat.filter === f ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showNewChat && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-border/50"
              >
                <div className="p-3 space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <UserPlusIcon className="w-3.5 h-3.5" /> Start a conversation
                  </p>
                  {chat.availableContacts.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">All available contacts already have threads.</p>
                  ) : (
                    chat.availableContacts.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleStartChat(c.id)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/70 text-left transition"
                      >
                        <img src={c.avatar} alt="" className="w-8 h-8 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.title}</p>
                        </div>
                        <RoleBadge role={c.role} />
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {chat.threads.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <ChatBubbleLeftRightIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                No conversations found.
              </div>
            ) : (
              chat.threads.map((thread) => {
                const contact = getContactById(thread.contactId);
                if (!contact) return null;
                const active = chat.activeThreadId === thread.id;
                const preview = threadPreview(thread);
                const lastAt = thread.messages.at(-1)?.sentAt;

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => handleOpenThread(thread.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border/30 transition hover:bg-muted/40",
                      active && "bg-primary/5 border-l-2 border-l-primary",
                    )}
                  >
                    <div className="relative shrink-0">
                      <img src={contact.avatar} alt="" className="w-11 h-11 rounded-full bg-muted" />
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-background" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm truncate">{contact.name}</p>
                        {lastAt && <span className="text-[10px] text-muted-foreground shrink-0">{formatTime(lastAt)}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <RoleBadge role={contact.role} />
                        <p className="text-xs text-muted-foreground truncate flex-1">{preview}</p>
                      </div>
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Thread panel */}
        <section
          className={cn(
            "flex-1 flex flex-col min-w-0 bg-card/20",
            !mobileShowThread && "hidden md:flex",
          )}
        >
          {chat.activeThread && chat.activeContact ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card/40 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={handleBack}
                  className="md:hidden p-2 -ml-1 rounded-lg hover:bg-muted"
                  aria-label="Back to conversations"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <img src={chat.activeContact.avatar} alt="" className="w-10 h-10 rounded-full bg-muted" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{chat.activeContact.name}</p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                    {chat.activeContact.title}
                    {chat.activeContact.online ? (
                      <span className="text-success font-medium">· Online</span>
                    ) : (
                      <span>· Offline</span>
                    )}
                  </p>
                </div>
                <RoleBadge role={chat.activeContact.role} />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {chat.activeThread.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-sm text-muted-foreground">
                    <p>No messages yet.</p>
                    <p className="text-xs mt-1">Say hello to start the conversation.</p>
                  </div>
                ) : (
                  chat.activeThread.messages.map((m) => {
                    const mine = m.senderId === myId;
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex", mine ? "justify-end" : "justify-start")}
                      >
                        <div className={cn("max-w-[85%] sm:max-w-[70%]", mine ? "items-end" : "items-start")}>
                          {!mine && (
                            <p className="text-[10px] text-muted-foreground mb-1 ml-1">{chat.activeContact?.name.split(" ")[0]}</p>
                          )}
                          <div
                            className={cn(
                              "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                              mine
                                ? "rounded-br-md gradient-primary text-primary-foreground"
                                : "rounded-bl-md bg-white dark:bg-card border border-border/60",
                            )}
                          >
                            {m.text}
                          </div>
                          <p className={cn("text-[10px] text-muted-foreground mt-1", mine ? "text-right mr-1" : "ml-1")}>
                            {formatTime(m.sentAt)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 sm:p-4 border-t border-border/50 bg-card/40 backdrop-blur-sm">
                <div className="flex items-end gap-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={1}
                    placeholder="Type a message…"
                    className="flex-1 min-h-[44px] max-h-32 px-3 py-2.5 rounded-xl border border-border/60 bg-white dark:bg-card text-sm resize-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="shrink-0 p-2.5 rounded-xl gradient-primary text-primary-foreground shadow-elegant disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 hidden sm:block">Press Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          ) : (
            <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Select a conversation</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Choose a thread from the list or start a new chat with someone you are allowed to message.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
