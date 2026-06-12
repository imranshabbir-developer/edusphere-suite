import { createFileRoute } from "@tanstack/react-router";
import CourseLibrary from "@/pages/adminDashboard/lms/courseLibrary";

export const Route = createFileRoute("/$role/lms/library")({
  component: CourseLibrary,
});
