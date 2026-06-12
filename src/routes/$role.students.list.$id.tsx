import { createFileRoute } from "@tanstack/react-router";
import StudentDetailPage from "@/pages/adminDashboard/students/list/features/studentDetailPage";

export const Route = createFileRoute("/$role/students/list/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ edit: s.edit === "1" || s.edit === true }),
  component: StudentDetailPage,
});
