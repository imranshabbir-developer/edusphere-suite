import { createFileRoute } from "@tanstack/react-router";
import LiveClass from "@/pages/adminDashboard/lms/liveClasses";

export const Route = createFileRoute("/$role/lms/live")({
  component: LiveClass,
});
