import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, MagnifyingGlassIcon, MoonIcon, SunIcon, ArrowRightOnRectangleIcon, UserIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toggle as toggleTheme } from "@/store/slices/themeSlice";
import { setMobileNav, toggleSidebar } from "@/store/slices/uiSlice";
import { useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { roleProfilePath, roleChatPath } from "@/utils/roleRoutes";

function deriveCrumbs(path: string) {
  const roles = new Set(["admin", "teacher", "faculty", "student", "app"]);
  const parts = path.split("/").filter((p) => p && !roles.has(p));
  return parts.map((p) => p.replace(/-/g, " "));
}

export function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const mode = useAppSelector((s) => s.theme.mode);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const crumbs = deriveCrumbs(path);

  return (
    <header className="sticky top-0 z-30 h-16 glass-card border-b border-border/60 rounded-none flex items-center gap-3 px-4 lg:px-6">
      <button onClick={() => dispatch(setMobileNav(true))} className="lg:hidden p-2 rounded-lg hover:bg-muted">
        <Bars3Icon className="w-5 h-5" />
      </button>
      <button onClick={() => dispatch(toggleSidebar())} className="hidden lg:inline-flex p-2 rounded-lg hover:bg-muted">
        <Bars3Icon className="w-5 h-5" />
      </button>

      <div className="hidden md:flex items-center text-sm text-muted-foreground gap-1.5 capitalize">
        {crumbs.length === 0 ? <span>Dashboard</span> : crumbs.map((c, i) => (
          <span key={i} className={i === crumbs.length - 1 ? "text-foreground font-medium" : ""}>
            {c}{i < crumbs.length - 1 && <span className="mx-1.5 opacity-50">/</span>}
          </span>
        ))}
      </div>

      <div className="flex-1" />

      <div className="hidden md:flex relative w-72">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input placeholder="Search students, courses, leads…"
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-transparent focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
      </div>

      <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-lg hover:bg-muted">
        {mode === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      </button>

      <Link
        to={user ? roleChatPath(user.role) : "/"}
        className={`relative p-2 rounded-lg hover:bg-muted ${path.includes("/chat") ? "text-primary bg-primary/10" : ""}`}
        aria-label="Messages"
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5" />
      </Link>

      <button className="relative p-2 rounded-lg hover:bg-muted">
        <BellIcon className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
      </button>

      <Menu as="div" className="relative">
        <MenuButton className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted">
          <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full bg-muted" />
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-[11px] text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </MenuButton>
        <MenuItems anchor="bottom end" className="z-50 mt-2 w-56 glass-card rounded-xl shadow-elegant p-1 focus:outline-none">
          <MenuItem>
            {({ focus }) => (
              <button onClick={() => user && navigate({ to: roleProfilePath(user.role) })} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${focus ? "bg-muted" : ""}`}>
                <UserIcon className="w-4 h-4" /> Profile
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button onClick={() => { dispatch(logout()); navigate({ to: "/" }); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger ${focus ? "bg-danger/10" : ""}`}>
                <ArrowRightOnRectangleIcon className="w-4 h-4" /> Sign out
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </header>
  );
}
