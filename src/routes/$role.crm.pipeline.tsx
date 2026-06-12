import { createFileRoute } from "@tanstack/react-router";
import PipelinePage from "@/pages/adminDashboard/crm/pipeline";

export const Route = createFileRoute("/$role/crm/pipeline")({
  component: PipelinePage,
});
