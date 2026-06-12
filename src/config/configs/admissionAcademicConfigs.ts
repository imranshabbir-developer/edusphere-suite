import type { ModuleConfig } from "../moduleTypes";
import {
  ACTIVE_STATUSES, ADMISSION_STATUSES, ALL_PROGRAMS, BATCHES, COLLEGE_NAMES,
  DEPARTMENTS, DEGREE_PROGRAMS, LOCATIONS, SCHOOL_NAMES, SECTIONS, SHORT_COURSES,
  SUBJECTS, UNIVERSITY_NAMES, fullName, makeId, pick, dateOffset,
} from "../moduleConstants";
import { buildFromFields, defaultStats } from "../moduleHelpers";

export const admissionForms: ModuleConfig = buildFromFields(
  "FRM",
  [
    { key: "name", label: "Form Title", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "intake", label: "Intake", type: "select", options: ["Fall 2025", "Spring 2026", "Summer 2026", "Rolling"] },
    { key: "deadline", label: "Deadline", type: "date" },
    { key: "fee", label: "Application Fee", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Draft", "Published", "Closed"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Form", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Intake", accessorKey: "intake", type: "badge" },
    { header: "Deadline", accessorKey: "deadline" },
    { header: "Fee", accessorKey: "fee", type: "currency" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("FRM", i), name: `${pick(ALL_PROGRAMS, i)} Application Form`,
    program: pick(ALL_PROGRAMS, i), intake: pick(["Fall 2025", "Spring 2026", "Summer 2026", "Rolling"], i),
    deadline: dateOffset(30 + i * 5), fee: 50 + (i % 5) * 25, status: pick(["Draft", "Published", "Closed"], i),
  })),
);

export const admissionVerification: ModuleConfig = buildFromFields(
  "VER",
  [
    { key: "name", label: "Applicant Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "documentType", label: "Document", type: "select", options: ["Transcript", "ID Proof", "Recommendation Letter", "Portfolio", "Certificate"] },
    { key: "verifiedBy", label: "Verified By", type: "select", options: ["Admissions Office", "Academic Dept", "External Agency"] },
    { key: "status", label: "Status", type: "select", options: ADMISSION_STATUSES },
    { key: "submittedDate", label: "Submitted", type: "date" },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Applicant", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Document", accessorKey: "documentType", type: "badge" },
    { header: "Verified By", accessorKey: "verifiedBy" },
    { header: "Status", accessorKey: "status", type: "status" },
    { header: "Submitted", accessorKey: "submittedDate" },
  ],
  [{ id: "status", label: "Status", options: ADMISSION_STATUSES }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("VER", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    documentType: pick(["Transcript", "ID Proof", "Recommendation Letter", "Portfolio", "Certificate"], i),
    verifiedBy: pick(["Admissions Office", "Academic Dept", "External Agency"], i),
    status: pick(ADMISSION_STATUSES, i), submittedDate: dateOffset(-i),
  })),
);

export const admissionEnrollment: ModuleConfig = buildFromFields(
  "ENR",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "batch", label: "Batch", type: "select", options: BATCHES },
    { key: "section", label: "Section", type: "select", options: SECTIONS },
    { key: "rollNo", label: "Roll Number" },
    { key: "status", label: "Status", type: "select", options: ["Enrolled", "Pending Payment", "Deferred", "Withdrawn"] },
    { key: "enrolledDate", label: "Enrollment Date", type: "date" },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Section", accessorKey: "section", type: "badge" },
    { header: "Roll No", accessorKey: "rollNo", type: "mono" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("ENR", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    batch: pick(BATCHES, i), section: pick(SECTIONS, i), rollNo: `2025${String(i + 1).padStart(4, "0")}`,
    status: pick(["Enrolled", "Pending Payment", "Deferred", "Withdrawn"], i), enrolledDate: dateOffset(-i * 2),
  })),
);

export const scholarships: ModuleConfig = buildFromFields(
  "SCH",
  [
    { key: "name", label: "Scholarship Name", required: true, span: 2 },
    { key: "program", label: "Eligible Program", type: "select", options: ALL_PROGRAMS },
    { key: "type", label: "Type", type: "select", options: ["Merit", "Need-based", "Sports", "Research", "Alumni Funded"] },
    { key: "amount", label: "Amount (PKR)", type: "number" },
    { key: "slots", label: "Available Slots", type: "number" },
    { key: "deadline", label: "Deadline", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Open", "Closed", "Reviewing", "Awarded"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Scholarship", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Amount", accessorKey: "amount", type: "currency" },
    { header: "Slots", accessorKey: "slots" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["Merit", "Need-based", "Sports", "Research", "Alumni Funded"] }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("SCH", i), name: `${pick(["Excellence", "Leadership", "STEM", "Arts", "Community"], i)} Scholarship ${i + 1}`,
    program: pick(ALL_PROGRAMS, i), type: pick(["Merit", "Need-based", "Sports", "Research", "Alumni Funded"], i),
    amount: 50000 + i * 25000, slots: 5 + (i % 10), deadline: dateOffset(60 + i * 7),
    status: pick(["Open", "Closed", "Reviewing", "Awarded"], i),
  })),
);

function institutionConfig(idPrefix: string, names: string[], typeLabel: string): ModuleConfig {
  return buildFromFields(
    idPrefix,
    [
      { key: "name", label: `${typeLabel} Name`, required: true, span: 2 },
      { key: "code", label: "Institution Code" },
      { key: "location", label: "Location", type: "select", options: LOCATIONS },
      { key: "principal", label: "Head / Principal" },
      { key: "students", label: "Total Students", type: "number" },
      { key: "established", label: "Established Year", type: "number" },
      { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
    ],
    [
      { header: "ID", accessorKey: "id", type: "mono" },
      { header: "Institution", accessorKey: "name" },
      { header: "Code", accessorKey: "code", type: "mono" },
      { header: "Location", accessorKey: "location", type: "badge" },
      { header: "Head", accessorKey: "principal" },
      { header: "Students", accessorKey: "students" },
      { header: "Status", accessorKey: "status", type: "status" },
    ],
    [{ id: "location", label: "Location", options: LOCATIONS.slice(0, 8) }],
    defaultStats("status"),
    () => Array.from({ length: names.length }).map((_, i) => ({
      id: makeId(idPrefix, i), name: names[i], code: `${idPrefix}-${100 + i}`,
      location: pick(LOCATIONS, i), principal: fullName(i + 10),
      students: 200 + i * 150, established: 1980 + i * 3, status: pick(ACTIVE_STATUSES, i),
    })),
  );
}

export const schools = institutionConfig("SCL", SCHOOL_NAMES, "School");
export const colleges = institutionConfig("COL", COLLEGE_NAMES, "College");
export const universities = institutionConfig("UNI", UNIVERSITY_NAMES, "University");

export const academicDepartments: ModuleConfig = buildFromFields(
  "DPT",
  [
    { key: "name", label: "Department Name", required: true, span: 2 },
    { key: "code", label: "Department Code" },
    { key: "head", label: "Department Head" },
    { key: "faculty", label: "Faculty Count", type: "number" },
    { key: "students", label: "Student Count", type: "number" },
    { key: "established", label: "Established", type: "number" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Department", accessorKey: "name" },
    { header: "Code", accessorKey: "code", type: "mono" },
    { header: "Head", accessorKey: "head" },
    { header: "Faculty", accessorKey: "faculty" },
    { header: "Students", accessorKey: "students" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "name", label: "Department", options: DEPARTMENTS }],
  defaultStats("status"),
  () => DEPARTMENTS.map((d, i) => ({
    id: makeId("DPT", i), name: d, code: `DPT-${100 + i}`, head: fullName(i + 5),
    faculty: 12 + i * 2, students: 150 + i * 40, established: 1990 + i * 2, status: "Active",
  })),
);

export const programs: ModuleConfig = buildFromFields(
  "PRG",
  [
    { key: "name", label: "Program Name", required: true, span: 2 },
    { key: "type", label: "Type", type: "select", options: ["Degree", "Diploma", "Certificate", "Short Course"] },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "duration", label: "Duration" },
    { key: "credits", label: "Credits", type: "number" },
    { key: "fee", label: "Annual Fee (PKR)", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "New Intake"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Program", accessorKey: "name" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Department", accessorKey: "department" },
    { header: "Duration", accessorKey: "duration" },
    { header: "Fee", accessorKey: "fee", type: "currency" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["Degree", "Diploma", "Certificate", "Short Course"] }],
  defaultStats("status"),
  () => [...DEGREE_PROGRAMS, ...SHORT_COURSES].map((p, i) => ({
    id: makeId("PRG", i), name: p,
    type: i < DEGREE_PROGRAMS.length ? "Degree" : "Short Course",
    department: pick(DEPARTMENTS, i),
    duration: i < DEGREE_PROGRAMS.length ? `${3 + (i % 2)} years` : `${8 + (i % 12)} weeks`,
    credits: i < DEGREE_PROGRAMS.length ? 120 + i * 6 : 0,
    fee: i < DEGREE_PROGRAMS.length ? 250000 + i * 50000 : 45000 + i * 5000,
    status: "Active",
  })),
);

export const courses: ModuleConfig = buildFromFields(
  "COU",
  [
    { key: "name", label: "Course Title", required: true, span: 2 },
    { key: "code", label: "Course Code" },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "credits", label: "Credits", type: "number" },
    { key: "instructor", label: "Instructor" },
    { key: "enrolled", label: "Enrolled", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Published", "Draft", "Archived"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Course", accessorKey: "name" },
    { header: "Code", accessorKey: "code", type: "mono" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Credits", accessorKey: "credits" },
    { header: "Instructor", accessorKey: "instructor" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "department", label: "Department", options: DEPARTMENTS }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("COU", i), name: pick(SUBJECTS, i) + (i > 12 ? " II" : ""),
    code: `CS${100 + i * 10}`, department: pick(DEPARTMENTS, i), credits: 3 + (i % 3),
    instructor: fullName(i + 3), enrolled: 25 + i * 3, status: pick(["Published", "Draft", "Archived"], i),
  })),
);

export const subjects: ModuleConfig = buildFromFields(
  "SUB",
  [
    { key: "name", label: "Subject Name", required: true, span: 2 },
    { key: "code", label: "Subject Code" },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "creditHours", label: "Credit Hours", type: "number" },
    { key: "type", label: "Type", type: "select", options: ["Core", "Elective", "Lab", "Project"] },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Subject", accessorKey: "name" },
    { header: "Code", accessorKey: "code", type: "mono" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Credits", accessorKey: "creditHours" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["Core", "Elective", "Lab", "Project"] }],
  defaultStats("status"),
  () => SUBJECTS.map((s, i) => ({
    id: makeId("SUB", i), name: s, code: `SUB-${200 + i}`, department: pick(DEPARTMENTS, i),
    creditHours: 3 + (i % 2), type: pick(["Core", "Elective", "Lab", "Project"], i), status: "Active",
  })),
);

export const batches: ModuleConfig = buildFromFields(
  "BAT",
  [
    { key: "name", label: "Batch Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "capacity", label: "Capacity", type: "number" },
    { key: "enrolled", label: "Enrolled", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Upcoming", "Completed", "Full"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Batch", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Start", accessorKey: "startDate" },
    { header: "Capacity", accessorKey: "capacity" },
    { header: "Enrolled", accessorKey: "enrolled" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 10) }],
  defaultStats("status"),
  () => BATCHES.map((b, i) => ({
    id: makeId("BAT", i), name: b, program: pick(ALL_PROGRAMS, i),
    startDate: dateOffset(-i * 30), endDate: dateOffset(365 - i * 30),
    capacity: 60 + i * 10, enrolled: 40 + i * 8, status: pick(["Active", "Upcoming", "Completed", "Full"], i),
  })),
);

export const sections: ModuleConfig = buildFromFields(
  "SEC",
  [
    { key: "name", label: "Section Name", required: true },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "batch", label: "Batch", type: "select", options: BATCHES },
    { key: "room", label: "Room" },
    { key: "students", label: "Students", type: "number" },
    { key: "advisor", label: "Class Advisor" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Section", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Room", accessorKey: "room" },
    { header: "Students", accessorKey: "students" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "batch", label: "Batch", options: BATCHES }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("SEC", i), name: `Section ${pick(SECTIONS, i)}`,
    program: pick(ALL_PROGRAMS, i), batch: pick(BATCHES, i),
    room: pick(["A-101", "B-204", "C-302", "Lab-1"], i), students: 25 + (i % 15),
    advisor: fullName(i + 8), status: "Active",
  })),
);
