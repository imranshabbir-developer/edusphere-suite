import { Link, useRouterState } from "@tanstack/react-router";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setMobileNav } from "@/store/slices/uiSlice";
import { SIDEBAR } from "./sidebarConfig";
import { Icon } from "@/components/ui/Icon";
import { AcademicCapIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function Sidebar() {
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const mobileOpen = useAppSelector((s) => s.ui.mobileNavOpen);
  const dispatch = useAppDispatch();
  const groups = SIDEBAR[role];
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const body = (
    <div className={`flex flex-col h-full bg-sidebar text-sidebar-foreground ${collapsed ? "w-20" : "w-72"} transition-all duration-300`}>
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <AcademicCapIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-bold tracking-tight truncate">EduOne ERP</p>
            <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">{role} workspace</p>
          </div>
        )}
        <button onClick={() => dispatch(setMobileNav(false))} className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-1">
        {groups.map((g) => {
          const hasActive = g.items.some((i) => pathname === i.to);
          if (collapsed) {
            return (
              <div key={g.label} className="py-1">
                <div className="flex justify-center py-2" title={g.label}>
                  <Icon name={g.icon} className="w-5 h-5 text-sidebar-foreground/70" />
                </div>
              </div>
            );
          }
          return (
            <Disclosure key={g.label} defaultOpen={hasActive || g.label === "Overview"}>
              {({ open }) => (
                <div>
                  <DisclosureButton className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-sidebar-accent transition group">
                    <Icon name={g.icon} className="w-4 h-4 text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground" />
                    <span className="flex-1 text-left">{g.label}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
                  </DisclosureButton>
                  <DisclosurePanel as="ul" className="mt-1 ml-6 pl-3 border-l border-sidebar-border space-y-0.5">
                    {g.items.map((item) => {
                      const active = pathname === item.to;
                      return (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            onClick={() => dispatch(setMobileNav(false))}
                            className={`block px-3 py-1.5 rounded-md text-[13px] transition ${
                              active
                                ? "bg-primary/15 text-primary-foreground font-semibold relative before:absolute before:-left-[13px] before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:rounded before:bg-primary"
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block sticky top-0 h-screen shrink-0">{body}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => dispatch(setMobileNav(false))} />
            <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 h-screen z-50">
              {body}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
