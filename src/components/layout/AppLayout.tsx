import { useEffect, type ReactNode } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAppSelector } from "@/redux/store";
import { SIDEBAR } from "@/constants/sidebar";
import { HomeIcon, BookOpenIcon, CalendarIcon, ChatBubbleLeftRightIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";

export function AppLayout({ children }: { children?: ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const mode = useAppSelector((s) => s.theme.mode);
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!user) navigate({ to: "/" });
  }, [user, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark"); else root.classList.remove("dark");
  }, [mode]);

  if (!user) return null;

  const mobileNav = SIDEBAR[user.role][0]?.items[0]
    ? [
        { to: "/app/dashboard", icon: HomeIcon, label: "Home" },
        { to: SIDEBAR[user.role][1]?.items[0]?.to ?? "/app/dashboard", icon: BookOpenIcon, label: "Modules" },
        { to: "/app/calendar", icon: CalendarIcon, label: "Calendar" },
        { to: "/app/messages", icon: ChatBubbleLeftRightIcon, label: "Inbox" },
        { to: "/app/profile", icon: UserIcon, label: "Profile" },
      ]
    : [];

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 overflow-x-hidden">
          {children ?? <Outlet />}
        </main>
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass-card border-t border-border/60 flex justify-around py-2">
          {mobileNav.map((n) => {
            const active = path === n.to;
            return (
              <Link key={n.label} to={n.to} className={`flex flex-col items-center gap-0.5 p-1.5 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
                <n.icon className="w-5 h-5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
