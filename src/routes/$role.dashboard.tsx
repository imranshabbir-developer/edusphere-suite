import type { ComponentType } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { Role } from "@/store/slices/authSlice";
import AdminDashboard from "@/pages/adminDashboard/dashboard";
import TeacherDashboard from "@/pages/teacherDashboard/dashboard";
import FacultyDashboard from "@/pages/facultyDashboard/dashboard";
import StudentDashboard from "@/pages/studentDashboard/dashboard";
import { isRole } from "@/utils/roleRoutes";

const dashboards: Record<Role, ComponentType> = {
  admin: AdminDashboard,
  teacher: TeacherDashboard,
  faculty: FacultyDashboard,
  student: StudentDashboard,
};

function RoleDashboard() {
  const { role } = Route.useParams();
  if (!isRole(role)) return null;
  const Page = dashboards[role];
  return <Page />;
}

export const Route = createFileRoute("/$role/dashboard")({
  component: RoleDashboard,
});
