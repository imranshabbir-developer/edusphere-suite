import { createFileRoute } from "@tanstack/react-router";
import ApplicationDetailPage from "@/pages/adminDashboard/admissions/applications/features/applicationDetailPage";

export const Route = createFileRoute("/$role/admissions/applications/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ edit: s.edit === "1" || s.edit === true }),
  component: ApplicationDetailPage,
});
