import { createFileRoute } from "@tanstack/react-router";
import LeadsPage from "@/pages/adminDashboard/crm/leads";

export const Route = createFileRoute("/$role/crm/leads")({
  component: LeadsPage,
});
