import { createFileRoute } from "@tanstack/react-router";
import ExamDetailPage from "@/pages/adminDashboard/examinations/examSchedule/features/examDetailPage";

export const Route = createFileRoute("/$role/exams/schedule/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ edit: s.edit === "1" || s.edit === true }),
  component: ExamDetailPage,
});
