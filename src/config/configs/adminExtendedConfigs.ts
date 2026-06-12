import type { ModuleConfig } from "../moduleTypes";
import {
  ACTIVE_STATUSES, ALL_PROGRAMS, BOOK_CATEGORIES, BUILDINGS, COMM_CHANNELS,
  DEPARTMENTS, EVENT_TYPES, HR_STATUSES, LEAVE_TYPES, LOCATIONS, PRIORITIES,
  ROLES_LIST, ROOM_TYPES, ROOMS, STAFF_NAMES, VEHICLE_TYPES, fullName, makeId, pick, dateOffset,
} from "../moduleConstants";
import { buildFromFields, defaultStats, financeStats } from "../moduleHelpers";

export const income: ModuleConfig = buildFromFields(
  "INC",
  [
    { key: "name", label: "Income Source", required: true, span: 2 },
    { key: "category", label: "Category", type: "select", options: ["Tuition Fees", "Donations", "Grants", "Events", "Consulting", "Other"] },
    { key: "amount", label: "Amount (PKR)", type: "number" },
    { key: "receivedDate", label: "Received Date", type: "date" },
    { key: "reference", label: "Reference No." },
    { key: "status", label: "Status", type: "select", options: ["Received", "Pending", "Reconciled"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Source", accessorKey: "name" },
    { header: "Category", accessorKey: "category", type: "badge" },
    { header: "Amount", accessorKey: "amount", type: "currency" },
    { header: "Received", accessorKey: "receivedDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "category", label: "Category", options: ["Tuition Fees", "Donations", "Grants", "Events", "Consulting", "Other"] }],
  financeStats(),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("INC", i), name: `${pick(["Tuition", "Grant", "Donation"], i)} - ${dateOffset(-i * 30)}`,
    category: pick(["Tuition Fees", "Donations", "Grants", "Events", "Consulting", "Other"], i),
    amount: 100000 + i * 50000, receivedDate: dateOffset(-i * 5), reference: `INC-${5000 + i}`,
    status: pick(["Received", "Pending", "Reconciled"], i),
  })),
);

export const expenses: ModuleConfig = buildFromFields(
  "EXP",
  [
    { key: "name", label: "Expense Description", required: true, span: 2 },
    { key: "category", label: "Category", type: "select", options: ["Salaries", "Utilities", "Maintenance", "Supplies", "Marketing", "Equipment"] },
    { key: "amount", label: "Amount (PKR)", type: "number" },
    { key: "paidDate", label: "Paid Date", type: "date" },
    { key: "vendor", label: "Vendor" },
    { key: "status", label: "Status", type: "select", options: ["Paid", "Pending", "Approved", "Rejected"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Description", accessorKey: "name" },
    { header: "Category", accessorKey: "category", type: "badge" },
    { header: "Amount", accessorKey: "amount", type: "currency" },
    { header: "Vendor", accessorKey: "vendor" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "category", label: "Category", options: ["Salaries", "Utilities", "Maintenance", "Supplies", "Marketing", "Equipment"] }],
  financeStats(),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("EXP", i), name: `${pick(["Salaries", "Utilities", "Maintenance"], i)} - ${pick(DEPARTMENTS, i)}`,
    category: pick(["Salaries", "Utilities", "Maintenance", "Supplies", "Marketing", "Equipment"], i),
    amount: 50000 + i * 25000, paidDate: dateOffset(-i * 4), vendor: pick(["ABC Supplies", "Tech Solutions", "City Utilities"], i),
    status: pick(["Paid", "Pending", "Approved", "Rejected"], i),
  })),
);

export const financePayroll: ModuleConfig = buildFromFields(
  "PYR",
  [
    { key: "name", label: "Employee Name", required: true, span: 2 },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "basicSalary", label: "Basic Salary (PKR)", type: "number" },
    { key: "allowances", label: "Allowances (PKR)", type: "number" },
    { key: "deductions", label: "Deductions (PKR)", type: "number" },
    { key: "netPay", label: "Net Pay (PKR)", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Processed", "Pending", "On Hold"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Employee", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Basic", accessorKey: "basicSalary", type: "currency" },
    { header: "Net Pay", accessorKey: "netPay", type: "currency" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "department", label: "Department", options: DEPARTMENTS }],
  financeStats(),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("PYR", i), name: fullName(i + 5), department: pick(DEPARTMENTS, i),
    basicSalary: 80000 + i * 10000, allowances: 15000 + (i % 5) * 3000,
    deductions: 5000 + (i % 3) * 2000, netPay: 90000 + i * 12000,
    status: pick(["Processed", "Pending", "On Hold"], i),
  })),
);

export const invoices: ModuleConfig = buildFromFields(
  "INV",
  [
    { key: "name", label: "Client / Student", required: true, span: 2 },
    { key: "invoiceNo", label: "Invoice No." },
    { key: "amount", label: "Amount (PKR)", type: "number" },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "description", label: "Description", span: 2 },
    { key: "status", label: "Status", type: "select", options: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Client", accessorKey: "name" },
    { header: "Invoice", accessorKey: "invoiceNo", type: "mono" },
    { header: "Amount", accessorKey: "amount", type: "currency" },
    { header: "Due Date", accessorKey: "dueDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"] }],
  financeStats(),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("INV", i), name: fullName(i), invoiceNo: `INV-${9000 + i}`,
    amount: 50000 + i * 15000, dueDate: dateOffset(15 + i), description: `Fee invoice for ${pick(ALL_PROGRAMS, i)}`,
    status: pick(["Draft", "Sent", "Paid", "Overdue", "Cancelled"], i),
  })),
);

export const accounting: ModuleConfig = buildFromFields(
  "ACC",
  [
    { key: "name", label: "Account Name", required: true, span: 2 },
    { key: "code", label: "Account Code" },
    { key: "type", label: "Type", type: "select", options: ["Asset", "Liability", "Equity", "Revenue", "Expense"] },
    { key: "balance", label: "Balance (PKR)", type: "number" },
    { key: "lastUpdated", label: "Last Updated", type: "date" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Account", accessorKey: "name" },
    { header: "Code", accessorKey: "code", type: "mono" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Balance", accessorKey: "balance", type: "currency" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["Asset", "Liability", "Equity", "Revenue", "Expense"] }],
  financeStats(),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("ACC", i), name: pick(["Cash", "Accounts Receivable", "Tuition Revenue", "Salaries Expense", "Equipment"], i) + ` Account`,
    code: `ACC-${100 + i}`, type: pick(["Asset", "Liability", "Equity", "Revenue", "Expense"], i),
    balance: 100000 + i * 75000, lastUpdated: dateOffset(-i), status: "Active",
  })),
);

export const recruitment: ModuleConfig = buildFromFields(
  "RCT",
  [
    { key: "name", label: "Job Title", required: true, span: 2 },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "positions", label: "Open Positions", type: "number" },
    { key: "applicants", label: "Applicants", type: "number" },
    { key: "postedDate", label: "Posted Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: HR_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Position", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Open", accessorKey: "positions" },
    { header: "Applicants", accessorKey: "applicants" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: HR_STATUSES }],
  defaultStats("status"),
  () => Array.from({ length: 16 }).map((_, i) => ({
    id: makeId("RCT", i), name: `${pick(["Professor", "Assistant Professor", "Lab Assistant", "Admin Officer"], i)} - ${pick(DEPARTMENTS, i)}`,
    department: pick(DEPARTMENTS, i), positions: 1 + (i % 3), applicants: 5 + i * 3,
    postedDate: dateOffset(-i * 7), status: pick(HR_STATUSES, i),
  })),
);

export const employees: ModuleConfig = buildFromFields(
  "EMP",
  [
    { key: "name", label: "Employee Name", required: true, span: 2 },
    { key: "employeeId", label: "Employee ID" },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "designation", label: "Designation" },
    { key: "joinDate", label: "Join Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Probation", "On Leave", "Terminated"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Employee", accessorKey: "name" },
    { header: "Emp ID", accessorKey: "employeeId", type: "mono" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Designation", accessorKey: "designation" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "department", label: "Department", options: DEPARTMENTS }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("EMP", i), name: fullName(i + 10), employeeId: `EMP-${3000 + i}`,
    department: pick(DEPARTMENTS, i), designation: pick(["Manager", "Officer", "Executive", "Coordinator"], i),
    joinDate: dateOffset(-365 * (1 + (i % 5))), status: pick(["Active", "Probation", "On Leave", "Terminated"], i),
  })),
);

export const leave: ModuleConfig = buildFromFields(
  "LVE",
  [
    { key: "name", label: "Employee Name", required: true, span: 2 },
    { key: "leaveType", label: "Leave Type", type: "select", options: LEAVE_TYPES },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "days", label: "Days", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Approved", "Pending", "Rejected", "Cancelled"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Employee", accessorKey: "name" },
    { header: "Type", accessorKey: "leaveType", type: "badge" },
    { header: "Start", accessorKey: "startDate" },
    { header: "Days", accessorKey: "days" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "leaveType", label: "Type", options: LEAVE_TYPES }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("LVE", i), name: fullName(i + 8), leaveType: pick(LEAVE_TYPES, i),
    startDate: dateOffset(i + 1), endDate: dateOffset(i + 3), days: 1 + (i % 5),
    status: pick(["Approved", "Pending", "Rejected", "Cancelled"], i),
  })),
);

export const hrmsPayroll = financePayroll;

export const appraisals: ModuleConfig = buildFromFields(
  "APR",
  [
    { key: "name", label: "Employee Name", required: true, span: 2 },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "reviewPeriod", label: "Review Period" },
    { key: "score", label: "Score", type: "number" },
    { key: "reviewer", label: "Reviewer", type: "select", options: STAFF_NAMES },
    { key: "status", label: "Status", type: "select", options: ["Completed", "In Progress", "Pending", "Overdue"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Employee", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Period", accessorKey: "reviewPeriod" },
    { header: "Score", accessorKey: "score" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ["Completed", "In Progress", "Pending", "Overdue"] }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("APR", i), name: fullName(i + 12), department: pick(DEPARTMENTS, i),
    reviewPeriod: pick(["Q1 2025", "Q2 2025", "Annual 2024"], i), score: 60 + (i % 40),
    reviewer: pick(STAFF_NAMES, i), status: pick(["Completed", "In Progress", "Pending", "Overdue"], i),
  })),
);

export const books: ModuleConfig = buildFromFields(
  "BOK",
  [
    { key: "name", label: "Book Title", required: true, span: 2 },
    { key: "isbn", label: "ISBN" },
    { key: "author", label: "Author" },
    { key: "category", label: "Category", type: "select", options: BOOK_CATEGORIES },
    { key: "copies", label: "Total Copies", type: "number" },
    { key: "available", label: "Available", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Available", "Limited", "Out of Stock", "Archived"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Title", accessorKey: "name" },
    { header: "Author", accessorKey: "author" },
    { header: "ISBN", accessorKey: "isbn", type: "mono" },
    { header: "Category", accessorKey: "category", type: "badge" },
    { header: "Available", accessorKey: "available" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "category", label: "Category", options: BOOK_CATEGORIES }],
  defaultStats("status"),
  () => Array.from({ length: 24 }).map((_, i) => ({
    id: makeId("BOK", i), name: pick(["Introduction to Algorithms", "Clean Code", "Physics Vol I", "Marketing Management", "Database Systems"], i),
    isbn: `978-${1000000000 + i}`, author: fullName(i + 40),
    category: pick(BOOK_CATEGORIES, i), copies: 5 + (i % 10), available: 1 + (i % 5),
    status: pick(["Available", "Limited", "Out of Stock", "Archived"], i),
  })),
);

export const libraryCategories: ModuleConfig = buildFromFields(
  "LCT",
  [
    { key: "name", label: "Category Name", required: true, span: 2 },
    { key: "code", label: "Category Code" },
    { key: "books", label: "Total Books", type: "number" },
    { key: "shelfLocation", label: "Shelf Location" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Category", accessorKey: "name" },
    { header: "Code", accessorKey: "code", type: "mono" },
    { header: "Books", accessorKey: "books" },
    { header: "Location", accessorKey: "shelfLocation" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "name", label: "Category", options: BOOK_CATEGORIES }],
  defaultStats("status"),
  () => BOOK_CATEGORIES.map((c, i) => ({
    id: makeId("LCT", i), name: c, code: `CAT-${100 + i}`, books: 50 + i * 20,
    shelfLocation: `${pick(BUILDINGS, i)} - Shelf ${i + 1}`, status: "Active",
  })),
);

export const borrowing: ModuleConfig = buildFromFields(
  "BRW",
  [
    { key: "name", label: "Book Title", required: true, span: 2 },
    { key: "borrower", label: "Borrower Name" },
    { key: "borrowDate", label: "Borrow Date", type: "date" },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Borrowed", "Overdue", "Returned", "Renewed"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Book", accessorKey: "name" },
    { header: "Borrower", accessorKey: "borrower" },
    { header: "Borrowed", accessorKey: "borrowDate" },
    { header: "Due", accessorKey: "dueDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "status", label: "Status", options: ["Borrowed", "Overdue", "Returned", "Renewed"] }],
  defaultStats("status"),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("BRW", i), name: pick(["Introduction to Algorithms", "Clean Code", "Database Systems"], i),
    borrower: fullName(i), borrowDate: dateOffset(-i * 5), dueDate: dateOffset(14 - i),
    status: pick(["Borrowed", "Overdue", "Returned", "Renewed"], i),
  })),
);

export const returns: ModuleConfig = buildFromFields(
  "RTN",
  [
    { key: "name", label: "Book Title", required: true, span: 2 },
    { key: "borrower", label: "Borrower Name" },
    { key: "returnDate", label: "Return Date", type: "date" },
    { key: "fine", label: "Fine (PKR)", type: "number" },
    { key: "condition", label: "Condition", type: "select", options: ["Good", "Damaged", "Lost"] },
    { key: "status", label: "Status", type: "select", options: ["Returned", "Fine Pending", "Processed"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Book", accessorKey: "name" },
    { header: "Borrower", accessorKey: "borrower" },
    { header: "Returned", accessorKey: "returnDate" },
    { header: "Fine", accessorKey: "fine", type: "currency" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "condition", label: "Condition", options: ["Good", "Damaged", "Lost"] }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("RTN", i), name: pick(["Introduction to Algorithms", "Clean Code", "Physics Vol I"], i),
    borrower: fullName(i), returnDate: dateOffset(-i), fine: i % 4 === 0 ? 500 : 0,
    condition: pick(["Good", "Damaged", "Lost"], i), status: pick(["Returned", "Fine Pending", "Processed"], i),
  })),
);

export const hostelRooms: ModuleConfig = buildFromFields(
  "RM",
  [
    { key: "name", label: "Room Number", required: true },
    { key: "building", label: "Building", type: "select", options: BUILDINGS },
    { key: "type", label: "Room Type", type: "select", options: ROOM_TYPES },
    { key: "capacity", label: "Capacity", type: "number" },
    { key: "occupied", label: "Occupied", type: "number" },
    { key: "monthlyRent", label: "Monthly Rent (PKR)", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Available", "Full", "Maintenance", "Reserved"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Room", accessorKey: "name" },
    { header: "Building", accessorKey: "building", type: "badge" },
    { header: "Type", accessorKey: "type" },
    { header: "Capacity", accessorKey: "capacity" },
    { header: "Occupied", accessorKey: "occupied" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ROOM_TYPES }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("RM", i), name: `${pick(BUILDINGS, i).slice(-1)}-${100 + i}`,
    building: pick(BUILDINGS, i), type: pick(ROOM_TYPES, i), capacity: 1 + (i % 3),
    occupied: i % 4 === 0 ? 0 : 1 + (i % 2), monthlyRent: 15000 + i * 2000,
    status: pick(["Available", "Full", "Maintenance", "Reserved"], i),
  })),
);

export const occupancy: ModuleConfig = buildFromFields(
  "OCC",
  [
    { key: "name", label: "Hostel Block", required: true, span: 2 },
    { key: "totalRooms", label: "Total Rooms", type: "number" },
    { key: "occupiedRooms", label: "Occupied", type: "number" },
    { key: "occupancyRate", label: "Occupancy %", type: "number" },
    { key: "reportDate", label: "Report Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Normal", "High Demand", "Low Occupancy"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Block", accessorKey: "name" },
    { header: "Total Rooms", accessorKey: "totalRooms" },
    { header: "Occupied", accessorKey: "occupiedRooms" },
    { header: "Occupancy %", accessorKey: "occupancyRate", type: "percent" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => BUILDINGS.map((b, i) => ({
    id: makeId("OCC", i), name: `${b} Hostel`, totalRooms: 40 + i * 10,
    occupiedRooms: 30 + i * 8, occupancyRate: 70 + (i % 25), reportDate: dateOffset(0),
    status: pick(["Normal", "High Demand", "Low Occupancy"], i),
  })),
);

export const allocation: ModuleConfig = buildFromFields(
  "ALC",
  [
    { key: "name", label: "Student Name", required: true, span: 2 },
    { key: "room", label: "Room Number" },
    { key: "building", label: "Building", type: "select", options: BUILDINGS },
    { key: "allocatedDate", label: "Allocated Date", type: "date" },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "status", label: "Status", type: "select", options: ["Allocated", "Pending", "Transferred", "Vacated"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Student", accessorKey: "name" },
    { header: "Room", accessorKey: "room", type: "mono" },
    { header: "Building", accessorKey: "building", type: "badge" },
    { header: "Program", accessorKey: "program" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "building", label: "Building", options: BUILDINGS }],
  defaultStats("status"),
  () => Array.from({ length: 22 }).map((_, i) => ({
    id: makeId("ALC", i), name: fullName(i), room: `${pick(BUILDINGS, i).slice(-1)}-${100 + i}`,
    building: pick(BUILDINGS, i), allocatedDate: dateOffset(-i * 10), program: pick(ALL_PROGRAMS, i),
    status: pick(["Allocated", "Pending", "Transferred", "Vacated"], i),
  })),
);

export const vehicles: ModuleConfig = buildFromFields(
  "VEH",
  [
    { key: "name", label: "Vehicle Number", required: true },
    { key: "type", label: "Type", type: "select", options: VEHICLE_TYPES },
    { key: "capacity", label: "Capacity", type: "number" },
    { key: "driver", label: "Assigned Driver" },
    { key: "route", label: "Route" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Maintenance", "Inactive"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Vehicle", accessorKey: "name" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Capacity", accessorKey: "capacity" },
    { header: "Driver", accessorKey: "driver" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: VEHICLE_TYPES }],
  defaultStats("status"),
  () => Array.from({ length: 15 }).map((_, i) => ({
    id: makeId("VEH", i), name: `EDU-${1000 + i}`, type: pick(VEHICLE_TYPES, i),
    capacity: 20 + (i % 3) * 15, driver: fullName(i + 25), route: `Route ${String.fromCharCode(65 + (i % 5))}`,
    status: pick(["Active", "Maintenance", "Inactive"], i),
  })),
);

export const routes: ModuleConfig = buildFromFields(
  "RTE",
  [
    { key: "name", label: "Route Name", required: true, span: 2 },
    { key: "startPoint", label: "Start Point" },
    { key: "endPoint", label: "End Point" },
    { key: "stops", label: "Stops", type: "number" },
    { key: "distance", label: "Distance (km)", type: "number" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Route", accessorKey: "name" },
    { header: "Start", accessorKey: "startPoint" },
    { header: "End", accessorKey: "endPoint" },
    { header: "Stops", accessorKey: "stops" },
    { header: "Distance", accessorKey: "distance" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 12 }).map((_, i) => ({
    id: makeId("RTE", i), name: `Route ${String.fromCharCode(65 + i)} - Campus`,
    startPoint: pick(LOCATIONS, i), endPoint: "Edusphere Campus",
    stops: 3 + (i % 5), distance: 5 + i * 3, status: "Active",
  })),
);

export const drivers: ModuleConfig = buildFromFields(
  "DRV",
  [
    { key: "name", label: "Driver Name", required: true, span: 2 },
    { key: "licenseNo", label: "License No." },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "vehicle", label: "Assigned Vehicle" },
    { key: "experience", label: "Experience (years)", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Active", "On Leave", "Suspended"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Driver", accessorKey: "name" },
    { header: "License", accessorKey: "licenseNo", type: "mono" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Vehicle", accessorKey: "vehicle" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 12 }).map((_, i) => ({
    id: makeId("DRV", i), name: fullName(i + 50), licenseNo: `DL-${10000 + i}`,
    phone: `+92 300 ${String(2000000 + i).slice(-7)}`, vehicle: `EDU-${1000 + i}`,
    experience: 3 + (i % 15), status: pick(["Active", "On Leave", "Suspended"], i),
  })),
);

export const workshops: ModuleConfig = buildFromFields(
  "WKS",
  [
    { key: "name", label: "Workshop Title", required: true, span: 2 },
    { key: "instructor", label: "Instructor", type: "select", options: STAFF_NAMES },
    { key: "venue", label: "Venue" },
    { key: "eventDate", label: "Date", type: "date" },
    { key: "registrations", label: "Registrations", type: "number" },
    { key: "capacity", label: "Capacity", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Upcoming", "Live", "Completed", "Cancelled"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Workshop", accessorKey: "name" },
    { header: "Instructor", accessorKey: "instructor" },
    { header: "Venue", accessorKey: "venue" },
    { header: "Date", accessorKey: "eventDate" },
    { header: "Registered", accessorKey: "registrations" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 16 }).map((_, i) => ({
    id: makeId("WKS", i), name: `${pick(["Web Dev", "AI", "Digital Marketing", "UI/UX"], i)} Workshop`,
    instructor: pick(STAFF_NAMES, i), venue: pick(ROOMS, i), eventDate: dateOffset(10 + i * 7),
    registrations: 20 + i * 5, capacity: 50, status: pick(["Upcoming", "Live", "Completed", "Cancelled"], i),
  })),
);

export const seminars = workshops;
export const conferences: ModuleConfig = buildFromFields(
  "CNF",
  [
    { key: "name", label: "Conference Title", required: true, span: 2 },
    { key: "theme", label: "Theme" },
    { key: "venue", label: "Venue" },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "participants", label: "Participants", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Planning", "Registration Open", "Live", "Completed"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Conference", accessorKey: "name" },
    { header: "Theme", accessorKey: "theme", type: "badge" },
    { header: "Venue", accessorKey: "venue" },
    { header: "Start", accessorKey: "startDate" },
    { header: "Participants", accessorKey: "participants" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => Array.from({ length: 10 }).map((_, i) => ({
    id: makeId("CNF", i), name: `Edusphere ${pick(["Tech", "Education", "Research", "Innovation"], i)} Conference ${2025}`,
    theme: pick(["AI in Education", "Future of Learning", "Digital Transformation", "Sustainable Campus"], i),
    venue: "Main Auditorium", startDate: dateOffset(30 + i * 14), endDate: dateOffset(32 + i * 14),
    participants: 100 + i * 50, status: pick(["Planning", "Registration Open", "Live", "Completed"], i),
  })),
);

export const emailCampaigns: ModuleConfig = buildFromFields(
  "EML",
  [
    { key: "name", label: "Campaign Name", required: true, span: 2 },
    { key: "subject", label: "Email Subject", span: 2 },
    { key: "audience", label: "Audience", type: "select", options: ["All Students", "Prospective Students", "Alumni", "Faculty", "Parents"] },
    { key: "sent", label: "Sent Count", type: "number" },
    { key: "openRate", label: "Open Rate %", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Draft", "Scheduled", "Sent", "Paused"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Campaign", accessorKey: "name" },
    { header: "Audience", accessorKey: "audience", type: "badge" },
    { header: "Sent", accessorKey: "sent" },
    { header: "Open Rate", accessorKey: "openRate", type: "percent" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "audience", label: "Audience", options: ["All Students", "Prospective Students", "Alumni", "Faculty", "Parents"] }],
  defaultStats("status"),
  () => Array.from({ length: 15 }).map((_, i) => ({
    id: makeId("EML", i), name: `${pick(["Admission", "Fee Reminder", "Event", "Newsletter"], i)} Campaign ${i + 1}`,
    subject: pick(["Apply Now for Fall 2025", "Fee Payment Reminder", "Join Our Workshop", "Monthly Newsletter"], i),
    audience: pick(["All Students", "Prospective Students", "Alumni", "Faculty", "Parents"], i),
    sent: 500 + i * 200, openRate: 25 + (i % 30), status: pick(["Draft", "Scheduled", "Sent", "Paused"], i),
  })),
);

export const sms: ModuleConfig = buildFromFields(
  "SMS",
  [
    { key: "name", label: "Message Title", required: true, span: 2 },
    { key: "recipient", label: "Recipient Group", type: "select", options: ["All Students", "Parents", "Faculty", "Specific Batch"] },
    { key: "message", label: "Message", type: "textarea", span: 2 },
    { key: "sentCount", label: "Sent Count", type: "number" },
    { key: "sentDate", label: "Sent Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Sent", "Scheduled", "Failed", "Draft"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Title", accessorKey: "name" },
    { header: "Recipients", accessorKey: "recipient", type: "badge" },
    { header: "Sent", accessorKey: "sentCount" },
    { header: "Date", accessorKey: "sentDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "recipient", label: "Recipients", options: ["All Students", "Parents", "Faculty", "Specific Batch"] }],
  defaultStats("status"),
  () => Array.from({ length: 15 }).map((_, i) => ({
    id: makeId("SMS", i), name: pick(["Fee Reminder", "Class Cancelled", "Exam Schedule", "Holiday Notice"], i),
    recipient: pick(["All Students", "Parents", "Faculty", "Specific Batch"], i),
    message: "Important update from Edusphere University.", sentCount: 200 + i * 100,
    sentDate: dateOffset(-i), status: pick(["Sent", "Scheduled", "Failed", "Draft"], i),
  })),
);

export const notifications: ModuleConfig = buildFromFields(
  "NTF",
  [
    { key: "name", label: "Notification Title", required: true, span: 2 },
    { key: "channel", label: "Channel", type: "select", options: COMM_CHANNELS },
    { key: "targetRole", label: "Target Role", type: "select", options: ROLES_LIST },
    { key: "sentDate", label: "Sent Date", type: "date" },
    { key: "readRate", label: "Read Rate %", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Sent", "Scheduled", "Draft"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Title", accessorKey: "name" },
    { header: "Channel", accessorKey: "channel", type: "badge" },
    { header: "Target", accessorKey: "targetRole" },
    { header: "Read Rate", accessorKey: "readRate", type: "percent" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "channel", label: "Channel", options: COMM_CHANNELS }],
  defaultStats("status"),
  () => Array.from({ length: 15 }).map((_, i) => ({
    id: makeId("NTF", i), name: pick(["New Assignment Posted", "Grade Published", "Fee Due", "Event Reminder"], i),
    channel: pick(COMM_CHANNELS, i), targetRole: pick(ROLES_LIST, i),
    sentDate: dateOffset(-i), readRate: 60 + (i % 35), status: pick(["Sent", "Scheduled", "Draft"], i),
  })),
);

export const commAnnouncements: ModuleConfig = buildFromFields(
  "ANN",
  [
    { key: "name", label: "Announcement Title", required: true, span: 2 },
    { key: "category", label: "Category", type: "select", options: ["Academic", "Exam", "Event", "Finance", "General"] },
    { key: "publishedDate", label: "Published Date", type: "date" },
    { key: "expiresDate", label: "Expires Date", type: "date" },
    { key: "priority", label: "Priority", type: "select", options: PRIORITIES },
    { key: "status", label: "Status", type: "select", options: ["Published", "Draft", "Archived"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Title", accessorKey: "name" },
    { header: "Category", accessorKey: "category", type: "badge" },
    { header: "Priority", accessorKey: "priority", type: "status" },
    { header: "Published", accessorKey: "publishedDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "category", label: "Category", options: ["Academic", "Exam", "Event", "Finance", "General"] }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("ANN", i), name: pick(["Mid-term exams begin", "Spring registration open", "Career fair Friday", "Scholarship deadline"], i),
    category: pick(["Academic", "Exam", "Event", "Finance", "General"], i),
    publishedDate: dateOffset(-i), expiresDate: dateOffset(30 - i),
    priority: pick(PRIORITIES, i), status: pick(["Published", "Draft", "Archived"], i),
  })),
);

export const reportAcademic: ModuleConfig = buildFromFields(
  "RAC",
  [
    { key: "name", label: "Report Name", required: true, span: 2 },
    { key: "department", label: "Department", type: "select", options: DEPARTMENTS },
    { key: "period", label: "Period", type: "select", options: ["Monthly", "Quarterly", "Semester", "Annual"] },
    { key: "generatedDate", label: "Generated", type: "date" },
    { key: "generatedBy", label: "Generated By", type: "select", options: STAFF_NAMES },
    { key: "status", label: "Status", type: "select", options: ["Generated", "Pending", "Archived"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Report", accessorKey: "name" },
    { header: "Department", accessorKey: "department", type: "badge" },
    { header: "Period", accessorKey: "period" },
    { header: "Generated", accessorKey: "generatedDate" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "period", label: "Period", options: ["Monthly", "Quarterly", "Semester", "Annual"] }],
  defaultStats("status"),
  () => Array.from({ length: 14 }).map((_, i) => ({
    id: makeId("RAC", i), name: `Academic Performance - ${pick(DEPARTMENTS, i)}`,
    department: pick(DEPARTMENTS, i), period: pick(["Monthly", "Quarterly", "Semester", "Annual"], i),
    generatedDate: dateOffset(-i * 7), generatedBy: pick(STAFF_NAMES, i), status: pick(["Generated", "Pending", "Archived"], i),
  })),
);

export const reportFinance = reportAcademic;
export const reportAttendance = reportAcademic;
export const reportAdmission = reportAcademic;

export const settingsRoles: ModuleConfig = buildFromFields(
  "ROL",
  [
    { key: "name", label: "Role Name", required: true, span: 2 },
    { key: "description", label: "Description", type: "textarea", span: 2 },
    { key: "users", label: "Assigned Users", type: "number" },
    { key: "permissions", label: "Permissions Count", type: "number" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Role", accessorKey: "name" },
    { header: "Users", accessorKey: "users" },
    { header: "Permissions", accessorKey: "permissions" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => ROLES_LIST.map((r, i) => ({
    id: makeId("ROL", i), name: r, description: `${r} role with module-specific access.`,
    users: 5 + i * 8, permissions: 10 + i * 5, status: "Active",
  })),
);

export const settingsPermissions: ModuleConfig = buildFromFields(
  "PRM",
  [
    { key: "name", label: "Permission Name", required: true, span: 2 },
    { key: "module", label: "Module", type: "select", options: ["CRM", "Admissions", "Academics", "Finance", "LMS", "Settings"] },
    { key: "action", label: "Action", type: "select", options: ["View", "Create", "Edit", "Delete", "Export"] },
    { key: "roles", label: "Assigned Roles" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Permission", accessorKey: "name" },
    { header: "Module", accessorKey: "module", type: "badge" },
    { header: "Action", accessorKey: "action" },
    { header: "Roles", accessorKey: "roles" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "module", label: "Module", options: ["CRM", "Admissions", "Academics", "Finance", "LMS", "Settings"] }],
  defaultStats("status"),
  () => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("PRM", i), name: `${pick(["View", "Create", "Edit", "Delete"], i)} ${pick(["Students", "Fees", "Courses", "Reports"], i)}`,
    module: pick(["CRM", "Admissions", "Academics", "Finance", "LMS", "Settings"], i),
    action: pick(["View", "Create", "Edit", "Delete", "Export"], i),
    roles: pick(ROLES_LIST, i), status: "Active",
  })),
);

export const settingsOrganization: ModuleConfig = buildFromFields(
  "ORG",
  [
    { key: "name", label: "Organization Name", required: true, span: 2 },
    { key: "type", label: "Type", type: "select", options: ["University", "College", "School", "Training Institute"] },
    { key: "location", label: "Location", type: "select", options: LOCATIONS },
    { key: "website", label: "Website" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Organization", accessorKey: "name" },
    { header: "Type", accessorKey: "type", type: "badge" },
    { header: "Location", accessorKey: "location" },
    { header: "Website", accessorKey: "website" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "type", label: "Type", options: ["University", "College", "School", "Training Institute"] }],
  defaultStats("status"),
  () => [
    { id: "ORG-1000", name: "Edusphere University", type: "University", location: "Karachi", website: "www.edusphere.edu", phone: "+92 21 1234567", status: "Active" },
    { id: "ORG-1001", name: "Edusphere Training Institute", type: "Training Institute", location: "Lahore", website: "courses.edusphere.edu", phone: "+92 42 7654321", status: "Active" },
    { id: "ORG-1002", name: "Green Valley School", type: "School", location: "Islamabad", website: "www.greenvalley.edu", phone: "+92 51 9876543", status: "Active" },
  ],
);

export const settingsBranding: ModuleConfig = buildFromFields(
  "BRD",
  [
    { key: "name", label: "Brand Element", required: true, span: 2 },
    { key: "primaryColor", label: "Primary Color" },
    { key: "secondaryColor", label: "Secondary Color" },
    { key: "logoUrl", label: "Logo URL" },
    { key: "fontFamily", label: "Font Family", type: "select", options: ["Inter", "Roboto", "Open Sans", "Poppins"] },
    { key: "status", label: "Status", type: "select", options: ["Active", "Draft"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Element", accessorKey: "name" },
    { header: "Primary", accessorKey: "primaryColor" },
    { header: "Secondary", accessorKey: "secondaryColor" },
    { header: "Font", accessorKey: "fontFamily", type: "badge" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [],
  defaultStats("status"),
  () => [
    { id: "BRD-1000", name: "Main Campus Branding", primaryColor: "#4F46E5", secondaryColor: "#06B6D4", logoUrl: "/logo.svg", fontFamily: "Inter", status: "Active" },
    { id: "BRD-1001", name: "Short Courses Portal", primaryColor: "#059669", secondaryColor: "#F59E0B", logoUrl: "/courses-logo.svg", fontFamily: "Poppins", status: "Active" },
  ],
);

export const settingsIntegrations: ModuleConfig = buildFromFields(
  "INT",
  [
    { key: "name", label: "Integration Name", required: true, span: 2 },
    { key: "provider", label: "Provider", type: "select", options: ["Google Workspace", "Microsoft 365", "Zoom", "Stripe", "PayPal", "Twilio", "SendGrid"] },
    { key: "apiKey", label: "API Key (masked)" },
    { key: "lastSync", label: "Last Sync", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Connected", "Disconnected", "Error", "Pending"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Integration", accessorKey: "name" },
    { header: "Provider", accessorKey: "provider", type: "badge" },
    { header: "Last Sync", accessorKey: "lastSync" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "provider", label: "Provider", options: ["Google Workspace", "Microsoft 365", "Zoom", "Stripe", "PayPal", "Twilio", "SendGrid"] }],
  defaultStats("status"),
  () => ["Google Workspace", "Microsoft 365", "Zoom", "Stripe", "Twilio"].map((p, i) => ({
    id: makeId("INT", i), name: `${p} Integration`, provider: p, apiKey: "••••••••",
    lastSync: dateOffset(-i), status: pick(["Connected", "Disconnected", "Error", "Pending"], i),
  })),
);
