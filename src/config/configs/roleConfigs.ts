import type { ModuleConfig } from "../moduleTypes";
import {
  ALL_PROGRAMS, ASSIGNMENT_STATUSES, GRADES, ROOMS, STAFF_NAMES, SUBJECTS,
  fullName, makeId, pick, dateOffset,
} from "../moduleConstants";
import { buildFromFields, defaultStats } from "../moduleHelpers";

export const teacherLiveClasses: ModuleConfig = buildFromFields(
  "TLV",
  [
    { key: "name", label: "Class Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "section", label: "Section", type: "select", options: ["A", "B", "C"] },
    { key: "room", label: "Room / Link", type: "select", options: ROOMS },
    { key: "scheduledTime", label: "Scheduled Time" },
    { key: "students", label: "Students", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Live", "Scheduled", "Completed", "Cancelled"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Class", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Section", accessorKey: "section" },
    { header: "Room", accessorKey: "room" },
    { header: "Students", accessorKey: "students" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "course", label: "Course", options: SUBJECTS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 16 }).map((_, i) => ({
    id: makeId("TLV", i), name: `${pick(SUBJECTS, i)} - Live Session`,
    course: pick(SUBJECTS, i), section: pick(["A", "B", "C"], i), room: pick(ROOMS, i),
    scheduledTime: `${9 + (i % 6)}:${i % 2 === 0 ? "00" : "30"} AM`, students: 30 + (i % 20),
    status: pick(["Live", "Scheduled", "Completed", "Cancelled"], i),
  })),
);

export const teacherUpcoming = teacherLiveClasses;
export const teacherRecorded = teacherLiveClasses;

export const teacherCourseContent: ModuleConfig = buildFromFields(
  "TCC",
  [
    { key: "name", label: "Content Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "type", label: "Type", type: "select", options: ["Video", "PDF", "Slides", "Link", "Quiz"] },
    { key: "module", label: "Module / Week" },
    { key: "duration", label: "Duration (mins)", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Published", "Draft", "Archived"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Content", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Module", accessorKey: "module" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["Video", "PDF", "Slides", "Link", "Quiz"] }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("TCC", i), name: `Week ${1 + (i % 8)} - ${pick(["Lecture", "Tutorial", "Lab"], i)}`,
    course: pick(SUBJECTS, i), type: pick(["Video", "PDF", "Slides", "Link", "Quiz"], i),
    module: `Module ${1 + (i % 6)}`, duration: 30 + (i % 5) * 15, status: pick(["Published", "Draft", "Archived"], i),
  })),
);

export const teacherLectures = teacherCourseContent;
export const teacherMaterials = teacherCourseContent;

export const teacherStudentList: ModuleConfig = buildFromFields(
  "TSL",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "rollNo", label: "Roll Number" },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "section", label: "Section", type: "select", options: ["A", "B", "C"] },
    { key: "attendance", label: "Attendance %", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Active", "At Risk", "On Leave"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Roll No", accessorKey: "rollNo", type: "mono" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Attendance", accessorKey: "attendance", type: "percent" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "course", label: "Course", options: SUBJECTS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("TSL", i), name: fullName(i), rollNo: `2024${String(i + 1).padStart(4, "0")}`,
    course: pick(SUBJECTS, i), section: pick(["A", "B", "C"], i),
    attendance: 70 + (i % 30), status: pick(["Active", "At Risk", "On Leave"], i),
  })),
);

export const teacherAttendance = teacherStudentList;
export const teacherPerformance: ModuleConfig = buildFromFields(
  "TPF",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "assignments", label: "Assignment Avg %", type: "number" },
    { key: "quizzes", label: "Quiz Avg %", type: "number" },
    { key: "midterm", label: "Mid-term %", type: "number" },
    { key: "overall", label: "Overall %", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Excellent", "Good", "Average", "At Risk"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Assignments", accessorKey: "assignments", type: "percent" },
    { header: "Quizzes", accessorKey: "quizzes", type: "percent" },
    { header: "Overall", accessorKey: "overall", type: "percent" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("TPF", i), name: fullName(i), course: pick(SUBJECTS, i),
    assignments: 70 + (i % 25), quizzes: 65 + (i % 30), midterm: 60 + (i % 35),
    overall: 68 + (i % 28), status: pick(["Excellent", "Good", "Average", "At Risk"], i),
  })),
);

export const teacherCreateAssignment: ModuleConfig = buildFromFields(
  "TAS",
  [
    { key: "name", label: "Assignment Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "totalMarks", label: "Total Marks", type: "number" },
    { key: "instructions", label: "Instructions", type: "textarea", span: 2 },
    { key: "status", label: "Status", type: "select", options: ASSIGNMENT_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Assignment", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Due Date", accessorKey: "dueDate" },
    { header: "Marks", accessorKey: "totalMarks" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ASSIGNMENT_STATUSES }],
  defaultStats("status"),
  () => Array.from({ length: 16 }).map((_, i) => ({
    id: makeId("TAS", i), name: `${pick(["Lab Report", "Essay", "Problem Set", "Project"], i)} #${i + 1}`,
    course: pick(SUBJECTS, i), dueDate: dateOffset(7 + i), totalMarks: 100,
    instructions: "Complete and submit before the due date.", status: pick(ASSIGNMENT_STATUSES, i),
  })),
);

export const teacherSubmissions: ModuleConfig = buildFromFields(
  "TSB",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "assignment", label: "Assignment" },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "submittedDate", label: "Submitted", type: "date" },
    { key: "marks", label: "Marks", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Submitted", "Late", "Graded", "Pending Review"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Assignment", accessorKey: "assignment" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Submitted", accessorKey: "submittedDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ["Submitted", "Late", "Graded", "Pending Review"] }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("TSB", i), name: fullName(i), assignment: `Assignment #${1 + (i % 5)}`,
    course: pick(SUBJECTS, i), submittedDate: dateOffset(-i), marks: i % 3 === 0 ? 0 : 70 + (i % 25),
    status: pick(["Submitted", "Late", "Graded", "Pending Review"], i),
  })),
);

export const teacherEvaluation = teacherSubmissions;

export const teacherCreateQuiz: ModuleConfig = buildFromFields(
  "TQZ",
  [
    { key: "name", label: "Quiz Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "questions", label: "Questions", type: "number" },
    { key: "duration", label: "Duration (mins)", type: "number" },
    { key: "totalMarks", label: "Total Marks", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Closed"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Quiz", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Questions", accessorKey: "questions" },
    { header: "Duration", accessorKey: "duration" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 14 }).map((_, i) => ({
    id: makeId("TQZ", i), name: `${pick(SUBJECTS, i)} Quiz ${i + 1}`,
    course: pick(SUBJECTS, i), questions: 10 + (i % 15), duration: 20 + (i % 4) * 10,
    totalMarks: 20 + (i % 3) * 10, status: pick(["Active", "Draft", "Closed"], i),
  })),
);

export const teacherQuizResults: ModuleConfig = buildFromFields(
  "TQR",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "quiz", label: "Quiz" },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "score", label: "Score", type: "number" },
    { key: "totalMarks", label: "Total Marks", type: "number" },
    { key: "attemptDate", label: "Attempt Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Completed", "In Progress", "Not Attempted"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Quiz", accessorKey: "quiz" },
    { header: "Score", accessorKey: "score" },
    { header: "Total", accessorKey: "totalMarks" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("TQR", i), name: fullName(i), quiz: `${pick(SUBJECTS, i)} Quiz`,
    course: pick(SUBJECTS, i), score: 12 + (i % 18), totalMarks: 20,
    attemptDate: dateOffset(-i), status: pick(["Completed", "In Progress", "Not Attempted"], i),
  })),
);

export const teacherMarks: ModuleConfig = buildFromFields(
  "TMK",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "examType", label: "Exam Type", type: "select", options: ["Mid-term", "Final", "Quiz", "Assignment"] },
    { key: "marks", label: "Marks Obtained", type: "number" },
    { key: "totalMarks", label: "Total Marks", type: "number" },
    { key: "grade", label: "Grade", type: "select", options: GRADES },
    { key: "status", label: "Status", type: "select", options: ["Entered", "Pending", "Published"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Exam", accessorKey: "examType" },
    { header: "Marks", accessorKey: "marks" },
    { header: "Grade", accessorKey: "grade", type: "badge" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "grade", label: "Grade", options: GRADES }],
  defaultStats("status"),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("TMK", i), name: fullName(i), course: pick(SUBJECTS, i),
    examType: pick(["Mid-term", "Final", "Quiz", "Assignment"], i),
    marks: 55 + (i % 45), totalMarks: 100, grade: pick(GRADES, i),
    status: pick(["Entered", "Pending", "Published"], i),
  })),
);

export const teacherGradebook = teacherMarks;

export const teacherCalendar: ModuleConfig = buildFromFields(
  "TCL",
  [
    { key: "name", label: "Event Title", required: true, span: 2 },
    { key: "type", label: "Type", type: "select", options: ["Class", "Meeting", "Exam", "Office Hours", "Event"] },
    { key: "eventDate", label: "Date", type: "date" },
    { key: "time", label: "Time" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status", type: "select", options: ["Scheduled", "Completed", "Cancelled"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Event", accessorKey: "name" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Date", accessorKey: "eventDate" },
    { header: "Time", accessorKey: "time" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["Class", "Meeting", "Exam", "Office Hours", "Event"] }],
  defaultStats("status"),
  () => Array.from({ length: 15 }).map((_, i) => ({
    id: makeId("TCL", i), name: pick(["Intro to AI Class", "Faculty Meeting", "Mid-term Exam", "Office Hours"], i),
    type: pick(["Class", "Meeting", "Exam", "Office Hours", "Event"], i),
    eventDate: dateOffset(i), time: `${9 + (i % 8)}:00 AM`, location: pick(ROOMS, i),
    status: pick(["Scheduled", "Completed", "Cancelled"], i),
  })),
);

export const teacherMessages: ModuleConfig = buildFromFields(
  "TMS",
  [
    { key: "name", label: "Subject", required: true, span: 2 },
    { key: "recipient", label: "Recipient" },
    { key: "sentDate", label: "Sent Date", type: "date" },
    { key: "message", label: "Message Preview", span: 2 },
    { key: "status", label: "Status", type: "select", options: ["Sent", "Draft", "Unread", "Replied"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Subject", accessorKey: "name" },
    { header: "Recipient", accessorKey: "recipient" },
    { header: "Sent", accessorKey: "sentDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 12 }).map((_, i) => ({
    id: makeId("TMS", i), name: pick(["Assignment feedback", "Class rescheduled", "Grade inquiry", "Project guidance"], i),
    recipient: fullName(i), sentDate: dateOffset(-i),
    message: "Regarding your recent submission...", status: pick(["Sent", "Draft", "Unread", "Replied"], i),
  })),
);

export const teacherCertificates = teacherCreateAssignment;

/* ── Faculty role ── */
export const facultyAdmissions: ModuleConfig = buildFromFields(
  "FAD",
  [
    { key: "name", label: "Applicant Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "appliedDate", label: "Applied Date", type: "date" },
    { key: "documents", label: "Documents", type: "number" },
    { key: "score", label: "Entry Test Score", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Submitted", "Under Review", "Approved", "Rejected"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Applicant", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Applied", accessorKey: "appliedDate" },
    { header: "Score", accessorKey: "score" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("FAD", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    appliedDate: dateOffset(-i * 2), documents: 3 + (i % 4), score: 55 + (i % 40),
    status: pick(["Submitted", "Under Review", "Approved", "Rejected"], i),
  })),
);

export const facultyStudents = teacherStudentList;
export const facultyAttendance = teacherAttendance;
export const facultyExams = teacherMarks;
export const facultyFees: ModuleConfig = buildFromFields(
  "FFE",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "amount", label: "Amount Due (PKR)", type: "number" },
    { key: "paid", label: "Paid (PKR)", type: "number" },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Paid", "Partial", "Overdue", "Pending"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Due", accessorKey: "amount", type: "currency" },
    { header: "Paid", accessorKey: "paid", type: "currency" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ["Paid", "Partial", "Overdue", "Pending"] }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("FFE", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    amount: 50000 + (i % 6) * 15000, paid: i % 3 === 0 ? 0 : 25000 + (i % 4) * 10000,
    dueDate: dateOffset(i * 10), status: pick(["Paid", "Partial", "Overdue", "Pending"], i),
  })),
);

export const facultyLibrary = teacherCourseContent;
export const facultyReports = teacherCalendar;
export const facultyCommunication = teacherMessages;
export const facultyTasks: ModuleConfig = buildFromFields(
  "FTK",
  [
    { key: "name", label: "Task Title", required: true, span: 2 },
    { key: "department", label: "Department", type: "select", options: ["Admissions", "Student Records", "Fee Desk", "Library", "Examinations"] },
    { key: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"] },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "assignedTo", label: "Assigned To", type: "select", options: STAFF_NAMES },
    { key: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Completed", "Overdue"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Task", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Priority", accessorKey: "priority", type: "status" },
    { header: "Due", accessorKey: "dueDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "priority", label: "Priority", options: ["Low", "Medium", "High", "Critical"] }],
  defaultStats("status"),
  () => Array.from({ length: 16 }).map((_, i) => ({
    id: makeId("FTK", i), name: pick(["Verify documents", "Process fee", "Issue library card", "Update exam hall"], i),
    department: pick(["Admissions", "Student Records", "Fee Desk", "Library", "Examinations"], i),
    priority: pick(["Low", "Medium", "High", "Critical"], i), dueDate: dateOffset(i),
    assignedTo: pick(STAFF_NAMES, i), status: pick(["Pending", "In Progress", "Completed", "Overdue"], i),
  })),
);

/* ── Student role ── */
export const studentCourses: ModuleConfig = buildFromFields(
  "SCU",
  [
    { key: "name", label: "Course Name", required: true, span: 2 },
    { key: "instructor", label: "Instructor", type: "select", options: STAFF_NAMES },
    { key: "credits", label: "Credits", type: "number" },
    { key: "progress", label: "Progress %", type: "number" },
    { key: "nextClass", label: "Next Class" },
    { key: "status", label: "Status", type: "select", options: ["In Progress", "Completed", "Not Started"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Course", accessorKey: "name" },
    { header: "Instructor", accessorKey: "instructor" },
    { header: "Credits", accessorKey: "credits" },
    { header: "Progress", accessorKey: "progress", type: "percent" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 8 }).map((_, i) => ({
    id: makeId("SCU", i), name: pick(SUBJECTS, i), instructor: pick(STAFF_NAMES, i),
    credits: 3, progress: 30 + i * 8, nextClass: dateOffset(i + 1),
    status: pick(["In Progress", "Completed", "Not Started"], i),
  })),
);

export const studentLive = teacherLiveClasses;
export const studentRecorded = teacherCourseContent;
export const studentAssignments = teacherCreateAssignment;
export const studentQuizzes = teacherCreateQuiz;
export const studentAttendance: ModuleConfig = buildFromFields(
  "SATT",
  [
    { key: "name", label: "Course", required: true, span: 2 },
    { key: "date", label: "Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Present", "Absent", "Late", "Excused"] },
    { key: "instructor", label: "Instructor", type: "select", options: STAFF_NAMES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Course", accessorKey: "name" },
    { header: "Date", accessorKey: "date" },
    { header: "Instructor", accessorKey: "instructor" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ["Present", "Absent", "Late", "Excused"] }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("SATT", i), name: pick(SUBJECTS, i), date: dateOffset(-i),
    status: pick(["Present", "Absent", "Late", "Excused"], i), instructor: pick(STAFF_NAMES, i),
  })),
);

export const studentResults = teacherMarks;
export const studentCertificates = teacherCreateAssignment;
export const studentFees = facultyFees;
export const studentLibrary = teacherCourseContent;
export const studentForum: ModuleConfig = buildFromFields(
  "SFO",
  [
    { key: "name", label: "Topic Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "author", label: "Author" },
    { key: "replies", label: "Replies", type: "number" },
    { key: "lastActivity", label: "Last Activity", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Open", "Pinned", "Closed"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Topic", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Author", accessorKey: "author" },
    { header: "Replies", accessorKey: "replies" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 15 }).map((_, i) => ({
    id: makeId("SFO", i), name: pick(["Help with assignment", "Study group", "Exam tips", "Project partners"], i),
    course: pick(SUBJECTS, i), author: fullName(i + 5), replies: 2 + (i % 12),
    lastActivity: dateOffset(-i), status: pick(["Open", "Pinned", "Closed"], i),
  })),
);

export const studentCalendar = teacherCalendar;
export const studentMessages = teacherMessages;
