import { createFileRoute } from "@tanstack/react-router";
import FeesPage from "@/pages/adminDashboard/feeManagement/feeCollection";

export const Route = createFileRoute("/app/fees/collection")({
  component: FeesPage,
});
