import { createFileRoute } from "@tanstack/react-router";
import TeacherDetailPage from "@/pages/adminDashboard/faculty/teachers/features/teacherDetailPage";

export const Route = createFileRoute("/$role/faculty/teachers/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ edit: s.edit === "1" || s.edit === true }),
  component: TeacherDetailPage,
});
