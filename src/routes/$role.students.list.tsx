import { createFileRoute } from "@tanstack/react-router";
import StudentsPage from "@/pages/adminDashboard/students/list";

export const Route = createFileRoute("/$role/students/list")({
  component: StudentsPage,
});
