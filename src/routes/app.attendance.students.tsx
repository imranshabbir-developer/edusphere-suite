import { createFileRoute } from "@tanstack/react-router";
import AttendancePage from "@/pages/adminDashboard/attendance/students";

export const Route = createFileRoute("/app/attendance/students")({
  component: AttendancePage,
});
