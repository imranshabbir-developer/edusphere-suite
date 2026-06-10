import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { useEffect, type ReactNode } from "react";
import { store, useAppSelector } from "@/redux/store";

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
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7fbd2cdc-d224-44b8-a2aa-5332f31832f9/id-preview-06bcb1a0--07143a63-46c2-4315-8680-bc767bf5c930.lovable.app-1781027130784.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7fbd2cdc-d224-44b8-a2aa-5332f31832f9/id-preview-06bcb1a0--07143a63-46c2-4315-8680-bc767bf5c930.lovable.app-1781027130784.png" },
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
