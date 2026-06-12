import type { Role } from "@/store/slices/authSlice";

export interface NavItem {
  label: string;
  to: string;
  icon?: string;
}
export interface NavGroup {
  label: string;
  icon: string;
  items: NavItem[];
}

// slug helper not needed — we hand-author all routes
const adminGroups: NavGroup[] = [
  { label: "Overview", icon: "HomeIcon", items: [{ label: "Dashboard", to: "/admin/dashboard" }] },
  {
    label: "CRM", icon: "MegaphoneIcon", items: [
      { label: "Leads", to: "/admin/crm/leads" },
      { label: "Inquiries", to: "/admin/crm/inquiries" },
      { label: "Follow Ups", to: "/admin/crm/follow-ups" },
      { label: "Pipeline", to: "/admin/crm/pipeline" },
      { label: "Lead Sources", to: "/admin/crm/sources" },
      { label: "Conversion Analytics", to: "/admin/crm/analytics" },
    ],
  },
  {
    label: "Admissions", icon: "ClipboardDocumentCheckIcon", items: [
      { label: "Applications", to: "/admin/admissions/applications" },
      { label: "Admission Forms", to: "/admin/admissions/forms" },
      { label: "Verification", to: "/admin/admissions/verification" },
      { label: "Enrollment", to: "/admin/admissions/enrollment" },
      { label: "Scholarships", to: "/admin/admissions/scholarships" },
    ],
  },
  {
    label: "Academics", icon: "AcademicCapIcon", items: [
      { label: "Schools", to: "/admin/academics/schools" },
      { label: "Colleges", to: "/admin/academics/colleges" },
      { label: "Universities", to: "/admin/academics/universities" },
      { label: "Departments", to: "/admin/academics/departments" },
      { label: "Programs", to: "/admin/academics/programs" },
      { label: "Courses", to: "/admin/academics/courses" },
      { label: "Subjects", to: "/admin/academics/subjects" },
      { label: "Batches", to: "/admin/academics/batches" },
      { label: "Sections", to: "/admin/academics/sections" },
    ],
  },
  {
    label: "Students", icon: "UserGroupIcon", items: [
      { label: "Students", to: "/admin/students/list" },
      { label: "Profiles", to: "/admin/students/profiles" },
      { label: "Documents", to: "/admin/students/documents" },
      { label: "Guardians", to: "/admin/students/guardians" },
      { label: "Alumni", to: "/admin/students/alumni" },
    ],
  },
  {
    label: "Faculty", icon: "IdentificationIcon", items: [
      { label: "Teachers", to: "/admin/faculty/teachers" },
      { label: "Staff", to: "/admin/faculty/staff" },
      { label: "Departments", to: "/admin/faculty/departments" },
      { label: "Contracts", to: "/admin/faculty/contracts" },
      { label: "Performance", to: "/admin/faculty/performance" },
    ],
  },
  {
    label: "Attendance", icon: "CheckBadgeIcon", items: [
      { label: "Student Attendance", to: "/admin/attendance/students" },
      { label: "Staff Attendance", to: "/admin/attendance/staff" },
      { label: "Live Attendance", to: "/admin/attendance/live" },
      { label: "Reports", to: "/admin/attendance/reports" },
    ],
  },
  {
    label: "Examinations", icon: "DocumentTextIcon", items: [
      { label: "Exam Types", to: "/admin/exams/types" },
      { label: "Semester Exams", to: "/admin/exams/semester" },
      { label: "Yearly Exams", to: "/admin/exams/yearly" },
      { label: "Exam Schedule", to: "/admin/exams/schedule" },
      { label: "Results", to: "/admin/exams/results" },
      { label: "Transcripts", to: "/admin/exams/transcripts" },
      { label: "GPA", to: "/admin/exams/gpa" },
      { label: "CGPA", to: "/admin/exams/cgpa" },
    ],
  },
  {
    label: "LMS", icon: "BookOpenIcon", items: [
      { label: "Course Library", to: "/admin/lms/library" },
      { label: "Recorded Lectures", to: "/admin/lms/recorded" },
      { label: "Live Classes", to: "/admin/lms/live" },
      { label: "Assignments", to: "/admin/lms/assignments" },
      { label: "Quizzes", to: "/admin/lms/quizzes" },
      { label: "Discussions", to: "/admin/lms/discussions" },
      { label: "Certificates", to: "/admin/lms/certificates" },
    ],
  },
  {
    label: "Fee Management", icon: "BanknotesIcon", items: [
      { label: "Fee Plans", to: "/admin/fees/plans" },
      { label: "Fee Collection", to: "/admin/fees/collection" },
      { label: "Installments", to: "/admin/fees/installments" },
      { label: "Discounts", to: "/admin/fees/discounts" },
      { label: "Fines", to: "/admin/fees/fines" },
      { label: "Receipts", to: "/admin/fees/receipts" },
    ],
  },
  {
    label: "Finance ERP", icon: "ChartBarIcon", items: [
      { label: "Income", to: "/admin/finance/income" },
      { label: "Expenses", to: "/admin/finance/expenses" },
      { label: "Payroll", to: "/admin/finance/payroll" },
      { label: "Invoices", to: "/admin/finance/invoices" },
      { label: "Accounting", to: "/admin/finance/accounting" },
    ],
  },
  {
    label: "HRMS", icon: "BriefcaseIcon", items: [
      { label: "Recruitment", to: "/admin/hrms/recruitment" },
      { label: "Employees", to: "/admin/hrms/employees" },
      { label: "Leave", to: "/admin/hrms/leave" },
      { label: "Payroll", to: "/admin/hrms/payroll" },
      { label: "Appraisals", to: "/admin/hrms/appraisals" },
    ],
  },
  {
    label: "Library", icon: "BookmarkSquareIcon", items: [
      { label: "Books", to: "/admin/library/books" },
      { label: "Categories", to: "/admin/library/categories" },
      { label: "Borrowing", to: "/admin/library/borrowing" },
      { label: "Returns", to: "/admin/library/returns" },
    ],
  },
  {
    label: "Hostel", icon: "BuildingOffice2Icon", items: [
      { label: "Rooms", to: "/admin/hostel/rooms" },
      { label: "Occupancy", to: "/admin/hostel/occupancy" },
      { label: "Allocation", to: "/admin/hostel/allocation" },
    ],
  },
  {
    label: "Transport", icon: "TruckIcon", items: [
      { label: "Vehicles", to: "/admin/transport/vehicles" },
      { label: "Routes", to: "/admin/transport/routes" },
      { label: "Drivers", to: "/admin/transport/drivers" },
    ],
  },
  {
    label: "Events", icon: "CalendarDaysIcon", items: [
      { label: "Workshops", to: "/admin/events/workshops" },
      { label: "Seminars", to: "/admin/events/seminars" },
      { label: "Conferences", to: "/admin/events/conferences" },
    ],
  },
  {
    label: "Communication", icon: "ChatBubbleLeftRightIcon", items: [
      { label: "Direct Chat", to: "/admin/chat" },
      { label: "Email Campaigns", to: "/admin/comm/email" },
      { label: "SMS", to: "/admin/comm/sms" },
      { label: "Notifications", to: "/admin/comm/notifications" },
      { label: "Announcements", to: "/admin/comm/announcements" },
    ],
  },
  {
    label: "Reports", icon: "PresentationChartLineIcon", items: [
      { label: "Academic", to: "/admin/reports/academic" },
      { label: "Finance", to: "/admin/reports/finance" },
      { label: "Attendance", to: "/admin/reports/attendance" },
      { label: "Admission", to: "/admin/reports/admission" },
    ],
  },
  {
    label: "Settings", icon: "Cog6ToothIcon", items: [
      { label: "Roles", to: "/admin/settings/roles" },
      { label: "Permissions", to: "/admin/settings/permissions" },
      { label: "Organization", to: "/admin/settings/organization" },
      { label: "Branding", to: "/admin/settings/branding" },
      { label: "Integrations", to: "/admin/settings/integrations" },
    ],
  },
];

const teacherGroups: NavGroup[] = [
  { label: "Overview", icon: "HomeIcon", items: [{ label: "Dashboard", to: "/teacher/dashboard" }] },
  {
    label: "My Classes", icon: "VideoCameraIcon", items: [
      { label: "Live Classes", to: "/teacher/live" },
      { label: "Upcoming Classes", to: "/teacher/upcoming" },
      { label: "Recorded Classes", to: "/teacher/recorded" },
    ],
  },
  {
    label: "Courses", icon: "BookOpenIcon", items: [
      { label: "Course Content", to: "/teacher/courses" },
      { label: "Lectures", to: "/teacher/lectures" },
      { label: "Materials", to: "/teacher/materials" },
    ],
  },
  {
    label: "Students", icon: "UserGroupIcon", items: [
      { label: "Student List", to: "/teacher/students" },
      { label: "Attendance", to: "/teacher/attendance" },
      { label: "Performance", to: "/teacher/performance" },
    ],
  },
  {
    label: "Assignments", icon: "DocumentTextIcon", items: [
      { label: "Create Assignment", to: "/teacher/assignments/new" },
      { label: "Submissions", to: "/teacher/assignments/submissions" },
      { label: "Evaluation", to: "/teacher/assignments/evaluation" },
    ],
  },
  {
    label: "Quizzes", icon: "PuzzlePieceIcon", items: [
      { label: "Create Quiz", to: "/teacher/quizzes/new" },
      { label: "Results", to: "/teacher/quizzes/results" },
    ],
  },
  {
    label: "Examinations", icon: "ClipboardDocumentListIcon", items: [
      { label: "Marks Entry", to: "/teacher/marks" },
      { label: "Grade Book", to: "/teacher/gradebook" },
    ],
  },
  {
    label: "Communication", icon: "ChatBubbleLeftRightIcon", items: [
      { label: "Chat", to: "/teacher/chat" },
    ],
  },
  { label: "Other", icon: "EllipsisHorizontalCircleIcon", items: [
      { label: "Calendar", to: "/teacher/calendar" },
      { label: "Certificates", to: "/teacher/certificates" },
      { label: "Profile", to: "/teacher/profile" },
  ] },
];

const facultyGroups: NavGroup[] = [
  { label: "Overview", icon: "HomeIcon", items: [{ label: "Dashboard", to: "/faculty/dashboard" }] },
  {
    label: "Operations", icon: "BriefcaseIcon", items: [
      { label: "Admissions", to: "/faculty/admissions" },
      { label: "Student Records", to: "/faculty/students" },
      { label: "Attendance", to: "/faculty/attendance" },
      { label: "Examinations", to: "/faculty/exams" },
      { label: "Fee Collection", to: "/faculty/fees" },
      { label: "Library", to: "/faculty/library" },
    ],
  },
  {
    label: "Communication", icon: "ChatBubbleLeftRightIcon", items: [
      { label: "Chat", to: "/faculty/chat" },
    ],
  },
  {
    label: "Other", icon: "Cog6ToothIcon", items: [
      { label: "Reports", to: "/faculty/reports" },
      { label: "Tasks", to: "/faculty/tasks" },
      { label: "Profile", to: "/faculty/profile" },
    ],
  },
];

const studentGroups: NavGroup[] = [
  { label: "Overview", icon: "HomeIcon", items: [{ label: "Dashboard", to: "/student/dashboard" }] },
  { label: "Learning", icon: "BookOpenIcon", items: [
      { label: "My Courses", to: "/student/courses" },
      { label: "Live Classes", to: "/student/live" },
      { label: "Recorded Lectures", to: "/student/recorded" },
      { label: "Assignments", to: "/student/assignments" },
      { label: "Quizzes", to: "/student/quizzes" },
  ] },
  { label: "Academic", icon: "AcademicCapIcon", items: [
      { label: "Attendance", to: "/student/attendance" },
      { label: "Results", to: "/student/results" },
      { label: "Certificates", to: "/student/certificates" },
      { label: "Fee Details", to: "/student/fees" },
  ] },
  { label: "Community", icon: "ChatBubbleLeftRightIcon", items: [
      { label: "Chat", to: "/student/chat" },
      { label: "Library", to: "/student/library" },
      { label: "Discussion Forum", to: "/student/forum" },
      { label: "Calendar", to: "/student/calendar" },
      { label: "Profile", to: "/student/profile" },
  ] },
];

export const SIDEBAR: Record<Role, NavGroup[]> = {
  admin: adminGroups,
  teacher: teacherGroups,
  faculty: facultyGroups,
  student: studentGroups,
};
