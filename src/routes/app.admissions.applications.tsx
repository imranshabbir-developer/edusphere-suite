import { createFileRoute } from "@tanstack/react-router";
import AdmissionsPage from "@/pages/adminDashboard/admissions/applications";

export const Route = createFileRoute("/app/admissions/applications")({
  component: AdmissionsPage,
});
