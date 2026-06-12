import { createFileRoute, Outlet, redirect, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppLayout } from "@/global/AppLayout";
import { useAppSelector } from "@/store/store";
import { isRole, roleDashboardPath } from "@/utils/roleRoutes";

export const Route = createFileRoute("/$role")({
  beforeLoad: ({ params }) => {
    if (!isRole(params.role)) {
      throw redirect({ to: "/" });
    }
  },
  component: RoleLayout,
});

function RoleLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const { role } = useParams({ from: "/$role" });
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role !== user.role) {
      navigate({ to: roleDashboardPath(user.role), replace: true });
    }
  }, [user, role, navigate]);

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
