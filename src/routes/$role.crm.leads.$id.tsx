import { createFileRoute } from "@tanstack/react-router";
import LeadDetailPage from "@/pages/adminDashboard/crm/leads/features/leadDetailPage";

export const Route = createFileRoute("/$role/crm/leads/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ edit: s.edit === "1" || s.edit === true }),
  component: LeadDetailPage,
});
