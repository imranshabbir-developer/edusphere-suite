import { createFileRoute } from "@tanstack/react-router";
import GenericModule from "@/pages/adminDashboard/genericModule";

export const Route = createFileRoute("/$role/$")({
  component: GenericModule,
});
