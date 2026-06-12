import { createFileRoute } from "@tanstack/react-router";
import ExamSchedule from "@/pages/adminDashboard/examinations/examSchedule";

export const Route = createFileRoute("/$role/exams/schedule")({
  component: ExamSchedule,
});
