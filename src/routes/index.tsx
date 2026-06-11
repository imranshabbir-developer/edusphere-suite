import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/pages/Login";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · EduOne ERP" },
      { name: "description", content: "Sign in to your EduOne education ERP workspace." },
    ],
  }),
  component: LoginPage,
});
