import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "@/pages/shared/chat";

export const Route = createFileRoute("/$role/chat")({
  component: ChatPage,
});
