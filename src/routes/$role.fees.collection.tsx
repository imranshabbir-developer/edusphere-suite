import { createFileRoute } from "@tanstack/react-router";
import FeesPage from "@/pages/adminDashboard/feeManagement/feeCollection";

export const Route = createFileRoute("/$role/fees/collection")({
  component: FeesPage,
});
