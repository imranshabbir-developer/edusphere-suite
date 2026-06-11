import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { useEffect, type ReactNode } from "react";
import { store, useAppSelector } from "@/store/store";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EduOne ERP — University & Education Management" },
      { name: "description", content: "All-in-one ERP + LMS + CRM + SIS for schools, colleges and universities." },
      { property: "og:title", content: "EduOne ERP — University & Education Management" },
      { name: "twitter:title", content: "EduOne ERP — University & Education Management" },
      { property: "og:description", content: "All-in-one ERP + LMS + CRM + SIS for schools, colleges and universities." },
      { name: "twitter:description", content: "All-in-one ERP + LMS + CRM + SIS for schools, colleges and universities." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=630&q=80" },
      { name: "twitter:image", content: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=630&q=80" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function ThemeBoot() {
  const mode = useAppSelector((s) => s.theme.mode);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark"); else root.classList.remove("dark");
  }, [mode]);
  return null;
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeBoot />
        <Outlet />
      </QueryClientProvider>
    </Provider>
  );
}
