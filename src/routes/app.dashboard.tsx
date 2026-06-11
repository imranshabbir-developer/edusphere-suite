import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/adminDashboard/dashboard";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});
