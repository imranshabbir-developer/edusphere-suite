import { createFileRoute } from "@tanstack/react-router";
import CourseLibrary from "@/pages/adminDashboard/lms/courseLibrary";

export const Route = createFileRoute("/app/lms/library")({
  component: CourseLibrary,
});
