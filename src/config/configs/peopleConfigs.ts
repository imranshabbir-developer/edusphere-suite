import type { ModuleConfig } from "../moduleTypes";
import {
  ACTIVE_STATUSES, ALL_PROGRAMS, DEPARTMENTS, STAFF_NAMES, fullName, makeId, pick, dateOffset,
} from "../moduleConstants";
import { buildFromFields, defaultStats } from "../moduleHelpers";

export const studentProfiles: ModuleConfig = buildFromFields(
  "PRO",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "email", label: "Email", type: "email" },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "batch", label: "Batch" },
    { key: "bio", label: "Bio", type: "textarea", span: 2 },
    { key: "status", label: "Status", type: "select", options: ["Complete", "Incomplete", "Under Review"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Program", accessorKey: "program" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("PRO", i), name: fullName(i), email: fullName(i).toLowerCase().replace(" ", ".") + "@student.edu",
    program: pick(ALL_PROGRAMS, i), batch: `202${2 + (i % 3)}-202${6 + (i % 3)}`,
    bio: "Student profile with academic interests and extracurricular activities.", status: pick(["Complete", "Incomplete", "Under Review"], i),
  })),
);

export const studentDocuments: ModuleConfig = buildFromFields(
  "DOC",
  [
    { key: "name", label: "Document Title", required: true, span: 2 },
    { key: "student", label: "Student Name" },
    { key: "type", label: "Document Type", type: "select", options: ["Transcript", "ID Card", "Birth Certificate", "Medical", "Character Certificate", "Portfolio"] },
    { key: "uploadedDate", label: "Uploaded", type: "date" },
    { key: "verifiedBy", label: "Verified By", type: "select", options: STAFF_NAMES },
    { key: "status", label: "Status", type: "select", options: ["Verified", "Pending", "Rejected", "Expired"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Document", accessorKey: "name" },
    { header: "Student", accessorKey: "student" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Verified By", accessorKey: "verifiedBy" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["Transcript", "ID Card", "Birth Certificate", "Medical", "Character Certificate", "Portfolio"] }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("DOC", i), name: `${pick(["Transcript", "ID Card", "Birth Certificate", "Medical"], i)} - ${fullName(i)}`,
    student: fullName(i), type: pick(["Transcript", "ID Card", "Birth Certificate", "Medical", "Character Certificate", "Portfolio"], i),
    uploadedDate: dateOffset(-i), verifiedBy: pick(STAFF_NAMES, i), status: pick(["Verified", "Pending", "Rejected", "Expired"], i),
  })),
);

export const guardians: ModuleConfig = buildFromFields(
  "GRD",
  [
    { key: "name", label: "Guardian Name", required: true, span: 2 },
    { key: "student", label: "Student Name" },
    { key: "relation", label: "Relation", type: "select", options: ["Father", "Mother", "Guardian", "Sibling", "Spouse"] },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "occupation", label: "Occupation" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Guardian", accessorKey: "name" },
    { header: "Student", accessorKey: "student" },
    { header: "Relation", accessorKey: "relation", type: "badge" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Occupation", accessorKey: "occupation" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "relation", label: "Relation", options: ["Father", "Mother", "Guardian", "Sibling", "Spouse"] }],
  defaultStats("status"),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("GRD", i), name: fullName(i + 20), student: fullName(i),
    relation: pick(["Father", "Mother", "Guardian", "Sibling", "Spouse"], i),
    phone: `+92 321 ${String(1000000 + i).slice(-7)}`, email: `guardian${i}@mail.com`,
    occupation: pick(["Engineer", "Doctor", "Business", "Teacher", "Government"], i), status: "Active",
  })),
);

export const alumni: ModuleConfig = buildFromFields(
  "ALM",
  [
    { key: "name", label: "Alumni Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "graduationYear", label: "Graduation Year", type: "number" },
    { key: "currentEmployer", label: "Current Employer" },
    { key: "designation", label: "Designation" },
    { key: "status", label: "Status", type: "select", options: ["Active Member", "Inactive", "Donor", "Mentor"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Alumni", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Graduated", accessorKey: "graduationYear" },
    { header: "Employer", accessorKey: "currentEmployer" },
    { header: "Designation", accessorKey: "designation" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 10) }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("ALM", i), name: fullName(i + 30), program: pick(ALL_PROGRAMS, i),
    graduationYear: 2015 + (i % 10), currentEmployer: pick(["Google", "Microsoft", "Startup", "Government", "Self-employed"], i),
    designation: pick(["Software Engineer", "Manager", "Consultant", "Entrepreneur", "Researcher"], i),
    status: pick(["Active Member", "Inactive", "Donor", "Mentor"], i),
  })),
);

export const facultyStaff: ModuleConfig = buildFromFields(
  "STF",
  [
    { key: "name", label: "Staff Name", required: true, span: 2 },
    { key: "email", label: "Email", type: "email" },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "designation", label: "Designation", type: "select", options: ["Professor", "Associate Professor", "Assistant Professor", "Lab Assistant", "Admin Staff"] },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "joinDate", label: "Join Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Active", "On Leave", "Resigned"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Staff", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Designation", accessorKey: "designation" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Join Date", accessorKey: "joinDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "department", label: "Department", options: DEPARTMENTS }],
  defaultStats("status"),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("STF", i), name: fullName(i + 5), email: fullName(i + 5).toLowerCase().replace(" ", ".") + "@staff.edu",
    department: pick(DEPARTMENTS, i), designation: pick(["Professor", "Associate Professor", "Assistant Professor", "Lab Assistant", "Admin Staff"], i),
    phone: `+92 333 ${String(1000000 + i).slice(-7)}`, joinDate: dateOffset(-365 * (2 + (i % 5))),
    status: pick(["Active", "On Leave", "Resigned"], i),
  })),
);

export const facultyContracts: ModuleConfig = buildFromFields(
  "CON",
  [
    { key: "name", label: "Employee Name", required: true, span: 2 },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "contractType", label: "Contract Type", type: "select", options: ["Permanent", "Fixed Term", "Visiting", "Consultant"] },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "salary", label: "Monthly Salary (PKR)", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Expiring Soon", "Expired", "Renewed"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Employee", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Type", accessorKey: "contractType" },
    { header: "Salary", accessorKey: "salary", type: "currency" },
    { header: "End Date", accessorKey: "endDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "contractType", label: "Type", options: ["Permanent", "Fixed Term", "Visiting", "Consultant"] }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("CON", i), name: fullName(i + 8), department: pick(DEPARTMENTS, i),
    contractType: pick(["Permanent", "Fixed Term", "Visiting", "Consultant"], i),
    startDate: dateOffset(-365), endDate: dateOffset(365 + i * 30), salary: 80000 + i * 15000,
    status: pick(["Active", "Expiring Soon", "Expired", "Renewed"], i),
  })),
);

export const facultyPerformance: ModuleConfig = buildFromFields(
  "PER",
  [
    { key: "name", label: "Faculty Name", required: true, span: 2 },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "rating", label: "Performance Rating", type: "number" },
    { key: "studentsRating", label: "Student Rating", type: "number" },
    { key: "publications", label: "Publications", type: "number" },
    { key: "reviewPeriod", label: "Review Period", type: "select", options: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Annual 2024"] },
    { key: "status", label: "Status", type: "select", options: ["Excellent", "Good", "Satisfactory", "Needs Improvement"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Faculty", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Rating", accessorKey: "rating" },
    { header: "Student Rating", accessorKey: "studentsRating" },
    { header: "Publications", accessorKey: "publications" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "reviewPeriod", label: "Period", options: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Annual 2024"] }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("PER", i), name: fullName(i + 12), department: pick(DEPARTMENTS, i),
    rating: 3.5 + (i % 15) * 0.1, studentsRating: 3.8 + (i % 12) * 0.1,
    publications: i % 8, reviewPeriod: pick(["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Annual 2024"], i),
    status: pick(["Excellent", "Good", "Satisfactory", "Needs Improvement"], i),
  })),
);

export const facultyDepartments: ModuleConfig = buildFromFields(
  "FDP",
  [
    { key: "name", label: "Department Name", required: true, span: 2 },
    { key: "head", label: "Department Head" },
    { key: "facultyCount", label: "Faculty Count", type: "number" },
    { key: "budget", label: "Annual Budget (PKR)", type: "number" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Department", accessorKey: "name" },
    { header: "Head", accessorKey: "head" },
    { header: "Faculty", accessorKey: "facultyCount" },
    { header: "Budget", accessorKey: "budget", type: "currency" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "name", label: "Department", options: DEPARTMENTS }],
  defaultStats("status"),
  () => DEPARTMENTS.slice(0, 10).map((d, i) => ({
    id: makeId("FDP", i), name: d, head: fullName(i + 15), facultyCount: 8 + i * 2,
    budget: 500000 + i * 100000, status: "Active",
  })),
);
