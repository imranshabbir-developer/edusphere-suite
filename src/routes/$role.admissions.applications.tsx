import { createFileRoute } from "@tanstack/react-router";
import AdmissionsPage from "@/pages/adminDashboard/admissions/applications";

export const Route = createFileRoute("/$role/admissions/applications")({
  component: AdmissionsPage,
});
