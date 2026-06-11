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
  { label: "Overview", icon: "HomeIcon", items: [{ label: "Dashboard", to: "/app/dashboard" }] },
  {
    label: "CRM", icon: "MegaphoneIcon", items: [
      { label: "Leads", to: "/app/crm/leads" },
      { label: "Inquiries", to: "/app/crm/inquiries" },
      { label: "Follow Ups", to: "/app/crm/follow-ups" },
      { label: "Pipeline", to: "/app/crm/pipeline" },
      { label: "Lead Sources", to: "/app/crm/sources" },
      { label: "Conversion Analytics", to: "/app/crm/analytics" },
    ],
  },
  {
    label: "Admissions", icon: "ClipboardDocumentCheckIcon", items: [
      { label: "Applications", to: "/app/admissions/applications" },
      { label: "Admission Forms", to: "/app/admissions/forms" },
      { label: "Verification", to: "/app/admissions/verification" },
      { label: "Enrollment", to: "/app/admissions/enrollment" },
      { label: "Scholarships", to: "/app/admissions/scholarships" },
    ],
  },
  {
    label: "Academics", icon: "AcademicCapIcon", items: [
      { label: "Schools", to: "/app/academics/schools" },
      { label: "Colleges", to: "/app/academics/colleges" },
      { label: "Universities", to: "/app/academics/universities" },
      { label: "Departments", to: "/app/academics/departments" },
      { label: "Programs", to: "/app/academics/programs" },
      { label: "Courses", to: "/app/academics/courses" },
      { label: "Subjects", to: "/app/academics/subjects" },
      { label: "Batches", to: "/app/academics/batches" },
      { label: "Sections", to: "/app/academics/sections" },
    ],
  },
  {
    label: "Students", icon: "UserGroupIcon", items: [
      { label: "Students", to: "/app/students/list" },
      { label: "Profiles", to: "/app/students/profiles" },
      { label: "Documents", to: "/app/students/documents" },
      { label: "Guardians", to: "/app/students/guardians" },
      { label: "Alumni", to: "/app/students/alumni" },
    ],
  },
  {
    label: "Faculty", icon: "IdentificationIcon", items: [
      { label: "Teachers", to: "/app/faculty/teachers" },
      { label: "Staff", to: "/app/faculty/staff" },
      { label: "Departments", to: "/app/faculty/departments" },
      { label: "Contracts", to: "/app/faculty/contracts" },
      { label: "Performance", to: "/app/faculty/performance" },
    ],
  },
  {
    label: "Attendance", icon: "CheckBadgeIcon", items: [
      { label: "Student Attendance", to: "/app/attendance/students" },
      { label: "Staff Attendance", to: "/app/attendance/staff" },
      { label: "Live Attendance", to: "/app/attendance/live" },
      { label: "Reports", to: "/app/attendance/reports" },
    ],
  },
  {
    label: "Examinations", icon: "DocumentTextIcon", items: [
      { label: "Exam Types", to: "/app/exams/types" },
      { label: "Semester Exams", to: "/app/exams/semester" },
      { label: "Yearly Exams", to: "/app/exams/yearly" },
      { label: "Exam Schedule", to: "/app/exams/schedule" },
      { label: "Results", to: "/app/exams/results" },
      { label: "Transcripts", to: "/app/exams/transcripts" },
      { label: "GPA", to: "/app/exams/gpa" },
      { label: "CGPA", to: "/app/exams/cgpa" },
    ],
  },
  {
    label: "LMS", icon: "BookOpenIcon", items: [
      { label: "Course Library", to: "/app/lms/library" },
      { label: "Recorded Lectures", to: "/app/lms/recorded" },
      { label: "Live Classes", to: "/app/lms/live" },
      { label: "Assignments", to: "/app/lms/assignments" },
      { label: "Quizzes", to: "/app/lms/quizzes" },
      { label: "Discussions", to: "/app/lms/discussions" },
      { label: "Certificates", to: "/app/lms/certificates" },
    ],
  },
  {
    label: "Fee Management", icon: "BanknotesIcon", items: [
      { label: "Fee Plans", to: "/app/fees/plans" },
      { label: "Fee Collection", to: "/app/fees/collection" },
      { label: "Installments", to: "/app/fees/installments" },
      { label: "Discounts", to: "/app/fees/discounts" },
      { label: "Fines", to: "/app/fees/fines" },
      { label: "Receipts", to: "/app/fees/receipts" },
    ],
  },
  {
    label: "Finance ERP", icon: "ChartBarIcon", items: [
      { label: "Income", to: "/app/finance/income" },
      { label: "Expenses", to: "/app/finance/expenses" },
      { label: "Payroll", to: "/app/finance/payroll" },
      { label: "Invoices", to: "/app/finance/invoices" },
      { label: "Accounting", to: "/app/finance/accounting" },
    ],
  },
  {
    label: "HRMS", icon: "BriefcaseIcon", items: [
      { label: "Recruitment", to: "/app/hrms/recruitment" },
      { label: "Employees", to: "/app/hrms/employees" },
      { label: "Leave", to: "/app/hrms/leave" },
      { label: "Payroll", to: "/app/hrms/payroll" },
      { label: "Appraisals", to: "/app/hrms/appraisals" },
    ],
  },
  {
    label: "Library", icon: "BookmarkSquareIcon", items: [
      { label: "Books", to: "/app/library/books" },
      { label: "Categories", to: "/app/library/categories" },
      { label: "Borrowing", to: "/app/library/borrowing" },
      { label: "Returns", to: "/app/library/returns" },
    ],
  },
  {
    label: "Hostel", icon: "BuildingOffice2Icon", items: [
      { label: "Rooms", to: "/app/hostel/rooms" },
      { label: "Occupancy", to: "/app/hostel/occupancy" },
      { label: "Allocation", to: "/app/hostel/allocation" },
    ],
  },
  {
    label: "Transport", icon: "TruckIcon", items: [
      { label: "Vehicles", to: "/app/transport/vehicles" },
      { label: "Routes", to: "/app/transport/routes" },
      { label: "Drivers", to: "/app/transport/drivers" },
    ],
  },
  {
    label: "Events", icon: "CalendarDaysIcon", items: [
      { label: "Workshops", to: "/app/events/workshops" },
      { label: "Seminars", to: "/app/events/seminars" },
      { label: "Conferences", to: "/app/events/conferences" },
    ],
  },
  {
    label: "Communication", icon: "ChatBubbleLeftRightIcon", items: [
      { label: "Email Campaigns", to: "/app/comm/email" },
      { label: "SMS", to: "/app/comm/sms" },
      { label: "Notifications", to: "/app/comm/notifications" },
      { label: "Announcements", to: "/app/comm/announcements" },
    ],
  },
  {
    label: "Reports", icon: "PresentationChartLineIcon", items: [
      { label: "Academic", to: "/app/reports/academic" },
      { label: "Finance", to: "/app/reports/finance" },
      { label: "Attendance", to: "/app/reports/attendance" },
      { label: "Admission", to: "/app/reports/admission" },
    ],
  },
  {
    label: "Settings", icon: "Cog6ToothIcon", items: [
      { label: "Roles", to: "/app/settings/roles" },
      { label: "Permissions", to: "/app/settings/permissions" },
      { label: "Organization", to: "/app/settings/organization" },
      { label: "Branding", to: "/app/settings/branding" },
      { label: "Integrations", to: "/app/settings/integrations" },
    ],
  },
];

const teacherGroups: NavGroup[] = [
  { label: "Overview", icon: "HomeIcon", items: [{ label: "Dashboard", to: "/app/dashboard" }] },
  {
    label: "My Classes", icon: "VideoCameraIcon", items: [
      { label: "Live Classes", to: "/app/teacher/live" },
      { label: "Upcoming Classes", to: "/app/teacher/upcoming" },
      { label: "Recorded Classes", to: "/app/teacher/recorded" },
    ],
  },
  {
    label: "Courses", icon: "BookOpenIcon", items: [
      { label: "Course Content", to: "/app/teacher/courses" },
      { label: "Lectures", to: "/app/teacher/lectures" },
      { label: "Materials", to: "/app/teacher/materials" },
    ],
  },
  {
    label: "Students", icon: "UserGroupIcon", items: [
      { label: "Student List", to: "/app/teacher/students" },
      { label: "Attendance", to: "/app/teacher/attendance" },
      { label: "Performance", to: "/app/teacher/performance" },
    ],
  },
  {
    label: "Assignments", icon: "DocumentTextIcon", items: [
      { label: "Create Assignment", to: "/app/teacher/assignments/new" },
      { label: "Submissions", to: "/app/teacher/assignments/submissions" },
      { label: "Evaluation", to: "/app/teacher/assignments/evaluation" },
    ],
  },
  {
    label: "Quizzes", icon: "PuzzlePieceIcon", items: [
      { label: "Create Quiz", to: "/app/teacher/quizzes/new" },
      { label: "Results", to: "/app/teacher/quizzes/results" },
    ],
  },
  {
    label: "Examinations", icon: "ClipboardDocumentListIcon", items: [
      { label: "Marks Entry", to: "/app/teacher/marks" },
      { label: "Grade Book", to: "/app/teacher/gradebook" },
    ],
  },
  { label: "Other", icon: "EllipsisHorizontalCircleIcon", items: [
      { label: "Calendar", to: "/app/teacher/calendar" },
      { label: "Messaging", to: "/app/teacher/messages" },
      { label: "Certificates", to: "/app/teacher/certificates" },
      { label: "Profile", to: "/app/profile" },
  ] },
];

const facultyGroups: NavGroup[] = [
  { label: "Overview", icon: "HomeIcon", items: [{ label: "Dashboard", to: "/app/dashboard" }] },
  {
    label: "Operations", icon: "BriefcaseIcon", items: [
      { label: "Admissions", to: "/app/faculty/admissions" },
      { label: "Student Records", to: "/app/faculty/students" },
      { label: "Attendance", to: "/app/faculty/attendance" },
      { label: "Examinations", to: "/app/faculty/exams" },
      { label: "Fee Collection", to: "/app/faculty/fees" },
      { label: "Library", to: "/app/faculty/library" },
    ],
  },
  {
    label: "Other", icon: "Cog6ToothIcon", items: [
      { label: "Reports", to: "/app/faculty/reports" },
      { label: "Communication", to: "/app/faculty/communication" },
      { label: "Tasks", to: "/app/faculty/tasks" },
      { label: "Profile", to: "/app/profile" },
    ],
  },
];

const studentGroups: NavGroup[] = [
  { label: "Overview", icon: "HomeIcon", items: [{ label: "Dashboard", to: "/app/dashboard" }] },
  { label: "Learning", icon: "BookOpenIcon", items: [
      { label: "My Courses", to: "/app/student/courses" },
      { label: "Live Classes", to: "/app/student/live" },
      { label: "Recorded Lectures", to: "/app/student/recorded" },
      { label: "Assignments", to: "/app/student/assignments" },
      { label: "Quizzes", to: "/app/student/quizzes" },
  ] },
  { label: "Academic", icon: "AcademicCapIcon", items: [
      { label: "Attendance", to: "/app/student/attendance" },
      { label: "Results", to: "/app/student/results" },
      { label: "Certificates", to: "/app/student/certificates" },
      { label: "Fee Details", to: "/app/student/fees" },
  ] },
  { label: "Community", icon: "ChatBubbleLeftRightIcon", items: [
      { label: "Library", to: "/app/student/library" },
      { label: "Discussion Forum", to: "/app/student/forum" },
      { label: "Calendar", to: "/app/student/calendar" },
      { label: "Messages", to: "/app/student/messages" },
      { label: "Profile", to: "/app/profile" },
  ] },
];

export const SIDEBAR: Record<Role, NavGroup[]> = {
  admin: adminGroups,
  teacher: teacherGroups,
  faculty: facultyGroups,
  student: studentGroups,
};
