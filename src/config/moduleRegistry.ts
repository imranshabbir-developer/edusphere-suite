import type { ModuleConfig } from "./moduleTypes";
import * as crm from "./configs/crmConfigs";
import * as academic from "./configs/admissionAcademicConfigs";
import * as people from "./configs/peopleConfigs";
import * as ops from "./configs/operationsConfigs";
import * as admin from "./configs/adminExtendedConfigs";
import * as roles from "./configs/roleConfigs";

/** Maps module path (without role prefix) to domain-specific config */
const PATH_CONFIG: Record<string, ModuleConfig> = {
  // CRM
  "crm/inquiries": crm.crmInquiries,
  "crm/follow-ups": crm.crmFollowUps,
  "crm/sources": crm.crmSources,
  "crm/analytics": crm.crmAnalytics,

  // Admissions
  "admissions/forms": academic.admissionForms,
  "admissions/verification": academic.admissionVerification,
  "admissions/enrollment": academic.admissionEnrollment,
  "admissions/scholarships": academic.scholarships,

  // Academics
  "academics/schools": academic.schools,
  "academics/colleges": academic.colleges,
  "academics/universities": academic.universities,
  "academics/departments": academic.academicDepartments,
  "academics/programs": academic.programs,
  "academics/courses": academic.courses,
  "academics/subjects": academic.subjects,
  "academics/batches": academic.batches,
  "academics/sections": academic.sections,

  // Students
  "students/profiles": people.studentProfiles,
  "students/documents": people.studentDocuments,
  "students/guardians": people.guardians,
  "students/alumni": people.alumni,

  // Faculty
  "faculty/staff": people.facultyStaff,
  "faculty/departments": people.facultyDepartments,
  "faculty/contracts": people.facultyContracts,
  "faculty/performance": people.facultyPerformance,

  // Attendance
  "attendance/staff": ops.staffAttendance,
  "attendance/live": ops.liveAttendance,
  "attendance/reports": ops.attendanceReports,

  // Examinations
  "exams/types": ops.examTypes,
  "exams/semester": ops.semesterExams,
  "exams/yearly": ops.yearlyExams,
  "exams/results": ops.examResults,
  "exams/transcripts": ops.transcripts,
  "exams/gpa": ops.gpaRecords,
  "exams/cgpa": ops.cgpaRecords,

  // LMS
  "lms/recorded": ops.recordedLectures,
  "lms/assignments": ops.lmsAssignments,
  "lms/quizzes": ops.lmsQuizzes,
  "lms/discussions": ops.discussions,
  "lms/certificates": ops.certificates,

  // Fee Management
  "fees/plans": ops.feePlans,
  "fees/installments": ops.installments,
  "fees/discounts": ops.discounts,
  "fees/fines": ops.fines,
  "fees/receipts": ops.receipts,

  // Finance ERP
  "finance/income": admin.income,
  "finance/expenses": admin.expenses,
  "finance/payroll": admin.financePayroll,
  "finance/invoices": admin.invoices,
  "finance/accounting": admin.accounting,

  // HRMS
  "hrms/recruitment": admin.recruitment,
  "hrms/employees": admin.employees,
  "hrms/leave": admin.leave,
  "hrms/payroll": admin.hrmsPayroll,
  "hrms/appraisals": admin.appraisals,

  // Library
  "library/books": admin.books,
  "library/categories": admin.libraryCategories,
  "library/borrowing": admin.borrowing,
  "library/returns": admin.returns,

  // Hostel
  "hostel/rooms": admin.hostelRooms,
  "hostel/occupancy": admin.occupancy,
  "hostel/allocation": admin.allocation,

  // Transport
  "transport/vehicles": admin.vehicles,
  "transport/routes": admin.routes,
  "transport/drivers": admin.drivers,

  // Events
  "events/workshops": admin.workshops,
  "events/seminars": admin.seminars,
  "events/conferences": admin.conferences,

  // Communication
  "comm/email": admin.emailCampaigns,
  "comm/sms": admin.sms,
  "comm/notifications": admin.notifications,
  "comm/announcements": admin.commAnnouncements,

  // Reports
  "reports/academic": admin.reportAcademic,
  "reports/finance": admin.reportFinance,
  "reports/attendance": admin.reportAttendance,
  "reports/admission": admin.reportAdmission,

  // Settings
  "settings/roles": admin.settingsRoles,
  "settings/permissions": admin.settingsPermissions,
  "settings/organization": admin.settingsOrganization,
  "settings/branding": admin.settingsBranding,
  "settings/integrations": admin.settingsIntegrations,

  // Teacher
  "live": roles.teacherLiveClasses,
  "upcoming": roles.teacherUpcoming,
  "recorded": roles.teacherRecorded,
  "courses": roles.teacherCourseContent,
  "lectures": roles.teacherLectures,
  "materials": roles.teacherMaterials,
  "students": roles.teacherStudentList,
  "attendance": roles.teacherAttendance,
  "performance": roles.teacherPerformance,
  "assignments/new": roles.teacherCreateAssignment,
  "assignments/submissions": roles.teacherSubmissions,
  "assignments/evaluation": roles.teacherEvaluation,
  "quizzes/new": roles.teacherCreateQuiz,
  "quizzes/results": roles.teacherQuizResults,
  "marks": roles.teacherMarks,
  "gradebook": roles.teacherGradebook,
  "calendar": roles.teacherCalendar,
  "messages": roles.teacherMessages,
  "certificates": roles.teacherCertificates,

  // Faculty (single-segment paths under /faculty/)
  "admissions": roles.facultyAdmissions,
  "exams": roles.facultyExams,
  "fees": roles.facultyFees,
  "library": roles.facultyLibrary,
  "reports": roles.facultyReports,
  "communication": roles.facultyCommunication,
  "tasks": roles.facultyTasks,
};

/** Role-specific overrides for paths that differ by role */
const ROLE_OVERRIDES: Record<string, Record<string, ModuleConfig>> = {
  faculty: {
    students: roles.facultyStudents,
    attendance: roles.facultyAttendance,
  },
  student: {
    courses: roles.studentCourses,
    live: roles.studentLive,
    recorded: roles.studentRecorded,
    assignments: roles.studentAssignments,
    quizzes: roles.studentQuizzes,
    attendance: roles.studentAttendance,
    results: roles.studentResults,
    certificates: roles.studentCertificates,
    fees: roles.studentFees,
    library: roles.studentLibrary,
    forum: roles.studentForum,
    calendar: roles.studentCalendar,
    messages: roles.studentMessages,
  },
};

export function getModuleConfig(modulePath: string, label: string, role = "admin"): ModuleConfig {
  const normalized = modulePath.replace(/^\/+|\/+$/g, "");

  if (ROLE_OVERRIDES[role]?.[normalized]) {
    return ROLE_OVERRIDES[role][normalized];
  }

  if (PATH_CONFIG[normalized]) {
    return PATH_CONFIG[normalized];
  }

  // Fallback: derive from last path segment for unmapped routes
  const lastSeg = normalized.split("/").pop() ?? normalized;
  if (PATH_CONFIG[lastSeg]) {
    return PATH_CONFIG[lastSeg];
  }

  return createFallbackConfig(label, normalized);
}

function createFallbackConfig(label: string, modulePath: string): ModuleConfig {
  const idPrefix = modulePath.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "X") || "MOD";
  const title = label.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    idPrefix,
    titleField: "name",
    fields: [
      { key: "name", label: `${title} Name`, required: true, span: 2 },
      { key: "description", label: "Description", type: "textarea", span: 2 },
      { key: "category", label: "Category", type: "select", options: ["General", "Academic", "Administrative", "Operations"] },
      { key: "assignedTo", label: "Assigned To" },
      { key: "date", label: "Date", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Pending", "Completed", "Archived"] },
    ],
    columns: [
      { header: "ID", accessorKey: "id", type: "mono" },
      { header: "Name", accessorKey: "name" },
      { header: "Category", accessorKey: "category", type: "badge" },
      { header: "Assigned To", accessorKey: "assignedTo" },
      { header: "Date", accessorKey: "date" },
      { header: "Status", accessorKey: "status", type: "status" },
    ],
    filters: [
      { id: "status", label: "Status", options: ["Active", "Pending", "Completed", "Archived"] },
      { id: "category", label: "Category", options: ["General", "Academic", "Administrative", "Operations"] },
    ],
    stats: [
      { title: "Total Records", icon: "Squares2X2Icon", tone: "primary", getValue: (r) => r.length },
      { title: "Active", icon: "CheckBadgeIcon", tone: "success", getValue: (r) => r.filter((x) => x.status === "Active").length },
      { title: "Pending", icon: "ClockIcon", tone: "warning", getValue: (r) => r.filter((x) => x.status === "Pending").length },
      { title: "This Month", icon: "CalendarDaysIcon", tone: "accent", getValue: (r) => Math.min(r.length, 12) },
    ],
    seed: () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: `${idPrefix}-${1000 + i}`,
        name: `${title} ${i + 1}`,
        description: `Record for ${title.toLowerCase()} management.`,
        category: ["General", "Academic", "Administrative", "Operations"][i % 4],
        assignedTo: "Admin Office",
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        status: ["Active", "Pending", "Completed", "Archived"][i % 4],
      })),
    buildRow: (vals, prefix) => ({
      id: `${prefix}-${Date.now().toString().slice(-5)}`,
      name: String(vals.name ?? "Untitled"),
      description: String(vals.description ?? ""),
      category: String(vals.category ?? "General"),
      assignedTo: String(vals.assignedTo ?? "Admin Office"),
      date: vals.date ? String(vals.date) : new Date().toLocaleDateString(),
      status: String(vals.status ?? "Active"),
    }),
  };
}
