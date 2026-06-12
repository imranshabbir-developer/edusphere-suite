import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAppSelector } from "@/store/store";
import { roleDashboardPath } from "@/utils/roleRoutes";

export const Route = createFileRoute("/app")({
  component: LegacyAppRedirect,
});

function LegacyAppRedirect() {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: roleDashboardPath(user.role), replace: true });
    else navigate({ to: "/", replace: true });
  }, [user, navigate]);

  return null;
}
