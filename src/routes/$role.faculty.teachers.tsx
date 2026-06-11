import { createFileRoute } from "@tanstack/react-router";
import TeachersPage from "@/pages/adminDashboard/faculty/teachers";

export const Route = createFileRoute("/$role/faculty/teachers")({
  component: TeachersPage,
});
