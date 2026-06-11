import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAppSelector } from "@/store/store";
import { roleDashboardPath } from "@/utils/roleRoutes";

export const Route = createFileRoute("/app/$")({
  component: LegacyAppSplatRedirect,
});

function LegacyAppSplatRedirect() {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!user) {
      navigate({ to: "/", replace: true });
      return;
    }
    const rest = pathname.replace(/^\/app\/?/, "");
    const target = rest ? `/${user.role}/${rest}` : roleDashboardPath(user.role);
    navigate({ to: target, replace: true });
  }, [user, navigate, pathname]);

  return null;
}
