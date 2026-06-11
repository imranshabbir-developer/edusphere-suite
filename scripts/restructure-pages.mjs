import fs from "fs";
import path from "path";

const src = path.resolve("src");

const routeToPage = [
  ["routes/app.dashboard.tsx", "pages/adminDashboard/dashboard/features/dashboardPage.tsx", "Dashboard"],
  ["routes/app.crm.leads.tsx", "pages/adminDashboard/crm/leads/features/leadsPage.tsx", "LeadsPage"],
  ["routes/app.crm.pipeline.tsx", "pages/adminDashboard/crm/pipeline/features/pipelinePage.tsx", "PipelinePage"],
  ["routes/app.admissions.applications.tsx", "pages/adminDashboard/admissions/applications/features/applicationsPage.tsx", "AdmissionsPage"],
  ["routes/app.students.list.tsx", "pages/adminDashboard/students/list/features/studentsPage.tsx", "StudentsPage"],
  ["routes/app.faculty.teachers.tsx", "pages/adminDashboard/faculty/teachers/features/teachersPage.tsx", "TeachersPage"],
  ["routes/app.attendance.students.tsx", "pages/adminDashboard/attendance/students/features/studentAttendance.tsx", "AttendancePage"],
  ["routes/app.exams.schedule.tsx", "pages/adminDashboard/examinations/examSchedule/features/examSchedule.tsx", "ExamSchedule"],
  ["routes/app.lms.library.tsx", "pages/adminDashboard/lms/courseLibrary/features/courseLibrary.tsx", "CourseLibrary"],
  ["routes/app.lms.live.tsx", "pages/adminDashboard/lms/liveClasses/features/liveClass.tsx", "LiveClass"],
  ["routes/app.fees.collection.tsx", "pages/adminDashboard/feeManagement/feeCollection/features/feesPage.tsx", "FeesPage"],
  ["routes/app.profile.tsx", "pages/profileSetting/features/profileDetail.tsx", "ProfilePage"],
  ["routes/app.$.tsx", "pages/adminDashboard/genericModule/features/genericModule.tsx", "GenericModule"],
  ["routes/index.tsx", "pages/Login.tsx", "LoginPage"],
];

for (const [routeFile, pageFile, exportName] of routeToPage) {
  const routePath = path.join(src, routeFile);
  let content = fs.readFileSync(routePath, "utf8");

  content = content
    .replace(/import \{ createFileRoute[^}]*\} from "@tanstack\/react-router";\n?/g, "")
    .replace(/import \{ createFileRoute, useParams \} from "@tanstack\/react-router";\n?/g, "")
    .replace(/import \{ createFileRoute, useNavigate \} from "@tanstack\/react-router";\n?/g, "")
    .replace(/import \{ createFileRoute, Link \} from "@tanstack\/react-router";\n?/g, "")
    .replace(/export const Route = createFileRoute\([^)]*\)\(\{[^}]*\}\);\n?/g, "")
    .replace(/export const Route = createFileRoute\([^)]*\)\(\{ component: [^}]*\}\);\n?/g, "")
    .replace(/export const Route = createFileRoute\([^)]*\)\(\{[\s\S]*?component: [^,]+,[\s\S]*?\}\);\n?/g, "")
    .replace(/@\/redux\//g, "@/store/")
    .replace(/function (LoginPage|Dashboard|LeadsPage|PipelinePage|AdmissionsPage|StudentsPage|TeachersPage|AttendancePage|ExamSchedule|CourseLibrary|LiveClass|FeesPage|ProfilePage|GenericModule)/g, "export default function $1")
    .replace(/export default function LoginPage/g, "function LoginPage");

  if (pageFile.endsWith("Login.tsx")) {
    content = content.trim() + "\n\nexport default LoginPage;\n";
  }

  const outPath = path.join(src, pageFile);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content);
  console.log("Wrote", pageFile);
}

const indexMappings = [
  ["pages/adminDashboard/dashboard", "dashboardPage", "Dashboard"],
  ["pages/adminDashboard/crm/leads", "leadsPage", "LeadsPage"],
  ["pages/adminDashboard/crm/pipeline", "pipelinePage", "PipelinePage"],
  ["pages/adminDashboard/admissions/applications", "applicationsPage", "AdmissionsPage"],
  ["pages/adminDashboard/students/list", "studentsPage", "StudentsPage"],
  ["pages/adminDashboard/faculty/teachers", "teachersPage", "TeachersPage"],
  ["pages/adminDashboard/attendance/students", "studentAttendance", "AttendancePage"],
  ["pages/adminDashboard/examinations/examSchedule", "examSchedule", "ExamSchedule"],
  ["pages/adminDashboard/lms/courseLibrary", "courseLibrary", "CourseLibrary"],
  ["pages/adminDashboard/lms/liveClasses", "liveClass", "LiveClass"],
  ["pages/adminDashboard/feeManagement/feeCollection", "feesPage", "FeesPage"],
  ["pages/profileSetting", "profileDetail", "ProfilePage"],
  ["pages/adminDashboard/genericModule", "genericModule", "GenericModule"],
];

for (const [dir, featureFile, compName] of indexMappings) {
  const indexContent = `import ${compName} from "./features/${featureFile}";\n\nexport default ${compName};\n`;
  fs.writeFileSync(path.join(src, dir, "index.tsx"), indexContent);
  console.log("Wrote", dir, "/index.tsx");
}

// Role dashboard re-exports
for (const role of ["teacherDashboard", "facultyDashboard", "studentDashboard"]) {
  const dir = path.join(src, "pages", role, "dashboard");
  fs.mkdirSync(path.join(dir, "features"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "features", "dashboardPage.tsx"),
    'export { default } from "@/pages/adminDashboard/dashboard/features/dashboardPage";\n'
  );
  fs.writeFileSync(path.join(dir, "index.tsx"), 'import Dashboard from "./features/dashboardPage";\n\nexport default Dashboard;\n');
  console.log("Wrote", role, "/dashboard");
}

console.log("Done");
