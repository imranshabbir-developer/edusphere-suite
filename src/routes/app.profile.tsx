import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/pages/profileSetting";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});
