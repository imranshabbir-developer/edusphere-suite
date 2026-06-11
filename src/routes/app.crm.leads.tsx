import { createFileRoute } from "@tanstack/react-router";
import LeadsPage from "@/pages/adminDashboard/crm/leads";

export const Route = createFileRoute("/app/crm/leads")({
  component: LeadsPage,
});
