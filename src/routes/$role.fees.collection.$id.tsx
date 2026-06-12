import { createFileRoute } from "@tanstack/react-router";
import FeeDetailPage from "@/pages/adminDashboard/feeManagement/feeCollection/features/feeDetailPage";

export const Route = createFileRoute("/$role/fees/collection/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ edit: s.edit === "1" || s.edit === true }),
  component: FeeDetailPage,
});
