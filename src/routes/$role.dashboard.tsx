import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/adminDashboard/dashboard";

export const Route = createFileRoute("/$role/dashboard")({
  component: Dashboard,
});
