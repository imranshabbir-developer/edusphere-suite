import type { ModuleConfig } from "../moduleTypes";
import {
  ACTIVE_STATUSES, ALL_PROGRAMS, ASSIGNMENT_STATUSES, BOOK_CATEGORIES, BUILDINGS,
  COMM_CHANNELS, DEPARTMENTS, EVENT_TYPES, EXAM_STATUSES, EXAM_TYPES, FEE_STATUSES,
  GRADES, HR_STATUSES, LEAVE_TYPES, PRIORITIES, ROLES_LIST, ROOM_TYPES, ROOMS,
  STAFF_NAMES, SUBJECTS, VEHICLE_TYPES, fullName, makeId, pick, dateOffset,
} from "../moduleConstants";
import { buildFromFields, defaultStats, financeStats } from "../moduleHelpers";

export const staffAttendance: ModuleConfig = buildFromFields(
  "SAT",
  [
    { key: "name", label: "Staff Name", required: true, span: 2 },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "date", label: "Date", type: "date" },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "status", label: "Status", type: "select", options: ["Present", "Absent", "Late", "Half Day", "On Leave"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Staff", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Date", accessorKey: "date" },
    { header: "Check In", accessorKey: "checkIn" },
    { header: "Check Out", accessorKey: "checkOut" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ["Present", "Absent", "Late", "Half Day", "On Leave"] }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("SAT", i), name: fullName(i + 5), department: pick(DEPARTMENTS, i),
    date: dateOffset(-i), checkIn: "08:" + String(30 + (i % 20)).padStart(2, "0"),
    checkOut: "17:" + String(15 + (i % 30)).padStart(2, "0"),
    status: pick(["Present", "Absent", "Late", "Half Day", "On Leave"], i),
  })),
);

export const liveAttendance: ModuleConfig = buildFromFields(
  "LAT",
  [
    { key: "name", label: "Session Name", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "instructor", label: "Instructor", type: "select", options: STAFF_NAMES },
    { key: "room", label: "Room", type: "select", options: ROOMS },
    { key: "present", label: "Present", type: "number" },
    { key: "absent", label: "Absent", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Live", "Completed", "Scheduled"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Session", accessorKey: "name" },
    { header: "Course", accessorKey: "course" },
    { header: "Instructor", accessorKey: "instructor" },
    { header: "Present", accessorKey: "present" },
    { header: "Absent", accessorKey: "absent" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "course", label: "Course", options: SUBJECTS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("LAT", i), name: `${pick(SUBJECTS, i)} - Live Session`,
    course: pick(SUBJECTS, i), instructor: pick(STAFF_NAMES, i), room: pick(ROOMS, i),
    present: 35 + (i % 20), absent: 3 + (i % 8), status: pick(["Live", "Completed", "Scheduled"], i),
  })),
);

export const attendanceReports: ModuleConfig = buildFromFields(
  "ATR",
  [
    { key: "name", label: "Report Title", required: true, span: 2 },
    { key: "scope", label: "Scope", type: "select", options: ["Daily", "Weekly", "Monthly", "Semester"] },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "avgAttendance", label: "Avg Attendance %", type: "number" },
    { key: "generatedDate", label: "Generated", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Generated", "Pending", "Archived"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Report", accessorKey: "name" },
    { header: "Scope", accessorKey: "scope", type: "badge" },
    { header: "Department", accessorKey: "department" },
    { header: "Avg %", accessorKey: "avgAttendance", type: "percent" },
    { header: "Generated", accessorKey: "generatedDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "scope", label: "Scope", options: ["Daily", "Weekly", "Monthly", "Semester"] }],
  defaultStats("status"),
  () => Array.from({ length: 16 }).map((_, i) => ({
    id: makeId("ATR", i), name: `${pick(["Daily", "Weekly", "Monthly"], i)} Attendance Report - ${pick(DEPARTMENTS, i)}`,
    scope: pick(["Daily", "Weekly", "Monthly", "Semester"], i), department: pick(DEPARTMENTS, i),
    avgAttendance: 75 + (i % 20), generatedDate: dateOffset(-i), status: pick(["Generated", "Pending", "Archived"], i),
  })),
);

export const examTypes: ModuleConfig = buildFromFields(
  "EXT",
  [
    { key: "name", label: "Exam Type Name", required: true, span: 2 },
    { key: "weightage", label: "Weightage %", type: "number" },
    { key: "duration", label: "Default Duration (mins)", type: "number" },
    { key: "gradingScale", label: "Grading Scale", type: "select", options: ["Percentage", "GPA 4.0", "Letter Grade", "Pass/Fail"] },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Type", accessorKey: "name" },
    { header: "Weightage", accessorKey: "weightage", type: "percent" },
    { header: "Duration", accessorKey: "duration" },
    { header: "Grading", accessorKey: "gradingScale", type: "badge" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "gradingScale", label: "Grading", options: ["Percentage", "GPA 4.0", "Letter Grade", "Pass/Fail"] }],
  defaultStats("status"),
  () => EXAM_TYPES.map((t, i) => ({
    id: makeId("EXT", i), name: t, weightage: 10 + i * 5, duration: 60 + i * 30,
    gradingScale: pick(["Percentage", "GPA 4.0", "Letter Grade", "Pass/Fail"], i), status: "Active",
  })),
);

export const semesterExams: ModuleConfig = buildFromFields(
  "SEM",
  [
    { key: "name", label: "Exam Title", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
    { key: "examDate", label: "Exam Date", type: "date" },
    { key: "duration", label: "Duration (mins)", type: "number" },
    { key: "status", label: "Status", type: "select", options: EXAM_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Exam", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Subject", accessorKey: "subject", type: "badge" },
    { header: "Date", accessorKey: "examDate" },
    { header: "Duration", accessorKey: "duration" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: EXAM_STATUSES }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("SEM", i), name: `${pick(SUBJECTS, i)} Semester Exam`,
    program: pick(ALL_PROGRAMS, i), subject: pick(SUBJECTS, i),
    examDate: dateOffset(10 + i * 3), duration: 120 + (i % 3) * 30, status: pick(EXAM_STATUSES, i),
  })),
);

export const yearlyExams = semesterExams;
export const examResults: ModuleConfig = buildFromFields(
  "RES",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
    { key: "marks", label: "Marks Obtained", type: "number" },
    { key: "totalMarks", label: "Total Marks", type: "number" },
    { key: "grade", label: "Grade", type: "select", options: GRADES },
    { key: "status", label: "Status", type: "select", options: ["Published", "Pending", "Under Review"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Subject", accessorKey: "subject", type: "badge" },
    { header: "Marks", accessorKey: "marks" },
    { header: "Total", accessorKey: "totalMarks" },
    { header: "Grade", accessorKey: "grade", type: "badge" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "grade", label: "Grade", options: GRADES }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("RES", i), name: fullName(i), program: pick(ALL_PROGRAMS, i), subject: pick(SUBJECTS, i),
    marks: 55 + (i % 45), totalMarks: 100, grade: pick(GRADES, i), status: pick(["Published", "Pending", "Under Review"], i),
  })),
);

export const transcripts: ModuleConfig = buildFromFields(
  "TRN",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "cgpa", label: "CGPA", type: "number" },
    { key: "credits", label: "Credits Earned", type: "number" },
    { key: "issuedDate", label: "Issued Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Issued", "Pending", "Requested", "Revoked"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "CGPA", accessorKey: "cgpa" },
    { header: "Credits", accessorKey: "credits" },
    { header: "Issued", accessorKey: "issuedDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("TRN", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    cgpa: +(2.8 + (i % 12) * 0.1).toFixed(2), credits: 90 + i * 3,
    issuedDate: dateOffset(-i * 5), status: pick(["Issued", "Pending", "Requested", "Revoked"], i),
  })),
);

export const gpaRecords: ModuleConfig = buildFromFields(
  "GPA",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "semester", label: "Semester", type: "select", options: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"] },
    { key: "gpa", label: "GPA", type: "number" },
    { key: "credits", label: "Credits", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Calculated", "Pending", "Revised"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Semester", accessorKey: "semester", type: "badge" },
    { header: "GPA", accessorKey: "gpa" },
    { header: "Credits", accessorKey: "credits" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "semester", label: "Semester", options: ["Semester 1", "Semester 2", "Semester 3", "Semester 4"] }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("GPA", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    semester: pick(["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"], i),
    gpa: +(2.5 + (i % 15) * 0.1).toFixed(2), credits: 15 + (i % 6), status: pick(["Calculated", "Pending", "Revised"], i),
  })),
);

export const cgpaRecords: ModuleConfig = buildFromFields(
  "CGP",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "cgpa", label: "CGPA", type: "number" },
    { key: "totalCredits", label: "Total Credits", type: "number" },
    { key: "standing", label: "Standing", type: "select", options: ["Good Standing", "Probation", "Dean's List", "Graduated"] },
    { key: "status", label: "Status", type: "select", options: ["Active", "Graduated", "Suspended"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "CGPA", accessorKey: "cgpa" },
    { header: "Credits", accessorKey: "totalCredits" },
    { header: "Standing", accessorKey: "standing", type: "badge" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "standing", label: "Standing", options: ["Good Standing", "Probation", "Dean's List", "Graduated"] }],
  defaultStats("status"),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("CGP", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    cgpa: +(2.8 + (i % 12) * 0.1).toFixed(2), totalCredits: 60 + i * 6,
    standing: pick(["Good Standing", "Probation", "Dean's List", "Graduated"], i),
    status: pick(["Active", "Graduated", "Suspended"], i),
  })),
);

export const recordedLectures: ModuleConfig = buildFromFields(
  "REC",
  [
    { key: "name", label: "Lecture Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "instructor", label: "Instructor", type: "select", options: STAFF_NAMES },
    { key: "duration", label: "Duration (mins)", type: "number" },
    { key: "views", label: "Views", type: "number" },
    { key: "uploadedDate", label: "Uploaded", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Published", "Processing", "Draft"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Lecture", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Instructor", accessorKey: "instructor" },
    { header: "Duration", accessorKey: "duration" },
    { header: "Views", accessorKey: "views" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "course", label: "Course", options: SUBJECTS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("REC", i), name: `${pick(SUBJECTS, i)} - Lecture ${i + 1}`,
    course: pick(SUBJECTS, i), instructor: pick(STAFF_NAMES, i), duration: 45 + (i % 4) * 15,
    views: 100 + i * 45, uploadedDate: dateOffset(-i * 2), status: pick(["Published", "Processing", "Draft"], i),
  })),
);

export const lmsAssignments: ModuleConfig = buildFromFields(
  "ASG",
  [
    { key: "name", label: "Assignment Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "totalMarks", label: "Total Marks", type: "number" },
    { key: "submissions", label: "Submissions", type: "number" },
    { key: "status", label: "Status", type: "select", options: ASSIGNMENT_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Assignment", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Due Date", accessorKey: "dueDate" },
    { header: "Marks", accessorKey: "totalMarks" },
    { header: "Submissions", accessorKey: "submissions" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ASSIGNMENT_STATUSES }],
  defaultStats("status"),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("ASG", i), name: `${pick(["Lab Report", "Essay", "Problem Set", "Project"], i)} #${i + 1}`,
    course: pick(SUBJECTS, i), dueDate: dateOffset(7 + i), totalMarks: 100,
    submissions: 15 + (i % 40), status: pick(ASSIGNMENT_STATUSES, i),
  })),
);

export const lmsQuizzes: ModuleConfig = buildFromFields(
  "QUZ",
  [
    { key: "name", label: "Quiz Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "questions", label: "Questions", type: "number" },
    { key: "duration", label: "Duration (mins)", type: "number" },
    { key: "attempts", label: "Attempts Allowed", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Closed"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Quiz", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Questions", accessorKey: "questions" },
    { header: "Duration", accessorKey: "duration" },
    { header: "Attempts", accessorKey: "attempts" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "course", label: "Course", options: SUBJECTS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("QUZ", i), name: `${pick(SUBJECTS, i)} Quiz ${i + 1}`,
    course: pick(SUBJECTS, i), questions: 10 + (i % 20), duration: 15 + (i % 4) * 10,
    attempts: 1 + (i % 3), status: pick(["Active", "Draft", "Closed"], i),
  })),
);

export const discussions: ModuleConfig = buildFromFields(
  "DIS",
  [
    { key: "name", label: "Topic Title", required: true, span: 2 },
    { key: "course", label: "Course", type: "select", options: SUBJECTS },
    { key: "author", label: "Author" },
    { key: "replies", label: "Replies", type: "number" },
    { key: "lastActivity", label: "Last Activity", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Open", "Pinned", "Closed", "Archived"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Topic", accessorKey: "name" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Author", accessorKey: "author" },
    { header: "Replies", accessorKey: "replies" },
    { header: "Last Activity", accessorKey: "lastActivity" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "course", label: "Course", options: SUBJECTS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("DIS", i), name: `Discussion: ${pick(["Assignment help", "Exam prep", "Project ideas", "Course feedback"], i)}`,
    course: pick(SUBJECTS, i), author: fullName(i), replies: 2 + (i % 15),
    lastActivity: dateOffset(-i), status: pick(["Open", "Pinned", "Closed", "Archived"], i),
  })),
);

export const certificates: ModuleConfig = buildFromFields(
  "CRT",
  [
    { key: "name", label: "Certificate Name", required: true, span: 2 },
    { key: "recipient", label: "Recipient" },
    { key: "course", label: "Course/Program", type: "select", options: ALL_PROGRAMS },
    { key: "issuedDate", label: "Issued Date", type: "date" },
    { key: "certificateNo", label: "Certificate No." },
    { key: "status", label: "Status", type: "select", options: ["Issued", "Pending", "Revoked", "Expired"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Certificate", accessorKey: "name" },
    { header: "Recipient", accessorKey: "recipient" },
    { header: "Course", accessorKey: "course", type: "badge" },
    { header: "Cert No.", accessorKey: "certificateNo", type: "mono" },
    { header: "Issued", accessorKey: "issuedDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ["Issued", "Pending", "Revoked", "Expired"] }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("CRT", i), name: `Certificate of Completion - ${pick(ALL_PROGRAMS, i)}`,
    recipient: fullName(i), course: pick(ALL_PROGRAMS, i), issuedDate: dateOffset(-i * 10),
    certificateNo: `CERT-${2025000 + i}`, status: pick(["Issued", "Pending", "Revoked", "Expired"], i),
  })),
);

export const feePlans: ModuleConfig = buildFromFields(
  "FPL",
  [
    { key: "name", label: "Plan Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "amount", label: "Total Amount (PKR)", type: "number" },
    { key: "installments", label: "Installments", type: "number" },
    { key: "dueDay", label: "Due Day of Month", type: "number" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Plan", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Amount", accessorKey: "amount", type: "currency" },
    { header: "Installments", accessorKey: "installments" },
    { header: "Due Day", accessorKey: "dueDay" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 10) }],
  financeStats(),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("FPL", i), name: `${pick(ALL_PROGRAMS, i)} Fee Plan`,
    program: pick(ALL_PROGRAMS, i), amount: 150000 + i * 25000, installments: 2 + (i % 4),
    dueDay: 5 + (i % 20), status: "Active",
  })),
);

export const installments: ModuleConfig = buildFromFields(
  "INS",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "installmentNo", label: "Installment #", type: "number" },
    { key: "amount", label: "Amount (PKR)", type: "number" },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: FEE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Installment", accessorKey: "installmentNo" },
    { header: "Amount", accessorKey: "amount", type: "currency" },
    { header: "Due Date", accessorKey: "dueDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: FEE_STATUSES }],
  financeStats(),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("INS", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    installmentNo: 1 + (i % 4), amount: 40000 + (i % 5) * 10000,
    dueDate: dateOffset(i * 15), status: pick(FEE_STATUSES, i),
  })),
);

export const discounts: ModuleConfig = buildFromFields(
  "DSC",
  [
    { key: "name", label: "Discount Name", required: true, span: 2 },
    { key: "type", label: "Type", type: "select", options: ["Merit", "Sibling", "Early Bird", "Staff Child", "Alumni"] },
    { key: "percentage", label: "Discount %", type: "number" },
    { key: "maxAmount", label: "Max Amount (PKR)", type: "number" },
    { key: "validUntil", label: "Valid Until", type: "date" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Discount", accessorKey: "name" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Discount %", accessorKey: "percentage", type: "percent" },
    { header: "Max Amount", accessorKey: "maxAmount", type: "currency" },
    { header: "Valid Until", accessorKey: "validUntil" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["Merit", "Sibling", "Early Bird", "Staff Child", "Alumni"] }],
  defaultStats("status"),
  () => Array.from({ length: 15 }).map((_, i) => ({
    id: makeId("DSC", i), name: `${pick(["Merit", "Sibling", "Early Bird"], i)} Discount ${i + 1}`,
    type: pick(["Merit", "Sibling", "Early Bird", "Staff Child", "Alumni"], i),
    percentage: 5 + (i % 4) * 5, maxAmount: 50000 + i * 10000,
    validUntil: dateOffset(90 + i * 10), status: "Active",
  })),
);

export const fines: ModuleConfig = buildFromFields(
  "FIN",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "reason", label: "Reason", type: "select", options: ["Late Fee", "Library Overdue", "Hostel Damage", "Exam Absence", "ID Card Replacement"] },
    { key: "amount", label: "Fine Amount (PKR)", type: "number" },
    { key: "issuedDate", label: "Issued Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Pending", "Paid", "Waived", "Overdue"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Reason", accessorKey: "reason", type: "badge" },
    { header: "Amount", accessorKey: "amount", type: "currency" },
    { header: "Issued", accessorKey: "issuedDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "reason", label: "Reason", options: ["Late Fee", "Library Overdue", "Hostel Damage", "Exam Absence", "ID Card Replacement"] }],
  financeStats(),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("FIN", i), name: fullName(i),
    reason: pick(["Late Fee", "Library Overdue", "Hostel Damage", "Exam Absence", "ID Card Replacement"], i),
    amount: 500 + (i % 10) * 500, issuedDate: dateOffset(-i * 3),
    status: pick(["Pending", "Paid", "Waived", "Overdue"], i),
  })),
);

export const receipts: ModuleConfig = buildFromFields(
  "RCP",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "receiptNo", label: "Receipt No." },
    { key: "amount", label: "Amount (PKR)", type: "number" },
    { key: "paymentMethod", label: "Payment Method", type: "select", options: ["Cash", "Bank Transfer", "Credit Card", "Online", "Cheque"] },
    { key: "paidDate", label: "Paid Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Issued", "Void", "Reissued"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Receipt No.", accessorKey: "receiptNo", type: "mono" },
    { header: "Amount", accessorKey: "amount", type: "currency" },
    { header: "Method", accessorKey: "paymentMethod", type: "badge" },
    { header: "Paid Date", accessorKey: "paidDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "paymentMethod", label: "Method", options: ["Cash", "Bank Transfer", "Credit Card", "Online", "Cheque"] }],
  financeStats(),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("RCP", i), name: fullName(i), receiptNo: `RCP-${2025000 + i}`,
    amount: 25000 + (i % 8) * 15000, paymentMethod: pick(["Cash", "Bank Transfer", "Credit Card", "Online", "Cheque"], i),
    paidDate: dateOffset(-i), status: pick(["Issued", "Void", "Reissued"], i),
  })),
);
