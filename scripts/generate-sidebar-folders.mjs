import fs from "fs";
import path from "path";

const src = path.resolve("src/pages");

const adminDomains = {
  crm: ["leads", "inquiries", "followUps", "pipeline", "sources", "analytics"],
  admissions: ["applications", "forms", "verification", "enrollment", "scholarships"],
  academics: ["schools", "colleges", "universities", "departments", "programs", "courses", "subjects", "batches", "sections"],
  students: ["list", "profiles", "documents", "guardians", "alumni"],
  faculty: ["teachers", "staff", "departments", "contracts", "performance"],
  attendance: ["students", "staff", "live", "reports"],
  examinations: ["types", "semester", "yearly", "examSchedule", "results", "transcripts", "gpa", "cgpa"],
  lms: ["courseLibrary", "recorded", "liveClasses", "assignments", "quizzes", "discussions", "certificates"],
  feeManagement: ["plans", "feeCollection", "installments", "discounts", "fines", "receipts"],
  financeErp: ["income", "expenses", "payroll", "invoices", "accounting"],
  hrms: ["recruitment", "employees", "leave", "payroll", "appraisals"],
  library: ["books", "categories", "borrowing", "returns"],
  hostel: ["rooms", "occupancy", "allocation"],
  transport: ["vehicles", "routes", "drivers"],
  events: ["workshops", "seminars", "conferences"],
  communication: ["email", "sms", "notifications", "announcements"],
  reports: ["academic", "finance", "attendance", "admission"],
  settings: ["roles", "permissions", "organization", "branding", "integrations"],
};

const implemented = new Set([
  "adminDashboard/crm/leads",
  "adminDashboard/crm/pipeline",
  "adminDashboard/admissions/applications",
  "adminDashboard/students/list",
  "adminDashboard/faculty/teachers",
  "adminDashboard/attendance/students",
  "adminDashboard/examinations/examSchedule",
  "adminDashboard/lms/courseLibrary",
  "adminDashboard/lms/liveClasses",
  "adminDashboard/feeManagement/feeCollection",
]);

for (const [domain, items] of Object.entries(adminDomains)) {
  for (const item of items) {
    const key = `adminDashboard/${domain}/${item}`;
    if (implemented.has(key)) continue;

    const dir = path.join(src, "adminDashboard", domain, item);
    const featuresDir = path.join(dir, "features");
    fs.mkdirSync(featuresDir, { recursive: true });

    const featureName = item === domain ? `${item}Page` : `${item}Page`;
    const featurePath = path.join(featuresDir, `${featureName}.tsx`);
    if (!fs.existsSync(featurePath)) {
      fs.writeFileSync(
        featurePath,
        `export { default } from "@/pages/adminDashboard/genericModule/features/genericModule";\n`
      );
    }

    const indexPath = path.join(dir, "index.tsx");
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(
        indexPath,
        `import Page from "./features/${featureName}";\n\nexport default Page;\n`
      );
    }
    console.log("Created placeholder:", key);
  }
}

const teacherDomains = {
  dashboard: ["dashboard"],
  myClasses: ["liveClasses", "upcomingClasses", "recordedClasses"],
  courses: ["courseContent", "lectures", "materials"],
  students: ["studentList", "attendance", "performance"],
  assignments: ["createAssignment", "submissions", "evaluation"],
  quizzes: ["createQuiz", "results"],
  examinations: ["marksEntry", "gradeBook"],
  other: ["calendar", "messaging", "certificates"],
};

for (const [domain, items] of Object.entries(teacherDomains)) {
  for (const item of items) {
    const dir = path.join(src, "teacherDashboard", domain, item);
    const featuresDir = path.join(dir, "features");
    fs.mkdirSync(featuresDir, { recursive: true });
    const featureName = `${item}Page`;
    const featurePath = path.join(featuresDir, `${featureName}.tsx`);
    if (!fs.existsSync(featurePath)) {
      const reexport =
        domain === "dashboard"
          ? 'export { default } from "@/pages/adminDashboard/dashboard/features/dashboardPage";\n'
          : 'export { default } from "@/pages/adminDashboard/genericModule/features/genericModule";\n';
      fs.writeFileSync(featurePath, reexport);
    }
    const indexPath = path.join(dir, "index.tsx");
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, `import Page from "./features/${featureName}";\n\nexport default Page;\n`);
    }
    console.log("Created teacher:", `teacherDashboard/${domain}/${item}`);
  }
}

const facultyDomains = {
  dashboard: ["dashboard"],
  operations: ["admissions", "students", "attendance", "exams", "fees", "library"],
  other: ["reports", "communication", "tasks"],
};

for (const [domain, items] of Object.entries(facultyDomains)) {
  for (const item of items) {
    const dir = path.join(src, "facultyDashboard", domain, item);
    const featuresDir = path.join(dir, "features");
    fs.mkdirSync(featuresDir, { recursive: true });
    const featureName = `${item}Page`;
    const featurePath = path.join(featuresDir, `${featureName}.tsx`);
    if (!fs.existsSync(featurePath)) {
      const reexport =
        domain === "dashboard"
          ? 'export { default } from "@/pages/adminDashboard/dashboard/features/dashboardPage";\n'
          : 'export { default } from "@/pages/adminDashboard/genericModule/features/genericModule";\n';
      fs.writeFileSync(featurePath, reexport);
    }
    const indexPath = path.join(dir, "index.tsx");
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, `import Page from "./features/${featureName}";\n\nexport default Page;\n`);
    }
    console.log("Created faculty:", `facultyDashboard/${domain}/${item}`);
  }
}

const studentDomains = {
  dashboard: ["dashboard"],
  learning: ["courses", "liveClasses", "recorded", "assignments", "quizzes"],
  academic: ["attendance", "results", "certificates", "fees"],
  community: ["library", "forum", "calendar", "messages"],
};

for (const [domain, items] of Object.entries(studentDomains)) {
  for (const item of items) {
    const dir = path.join(src, "studentDashboard", domain, item);
    const featuresDir = path.join(dir, "features");
    fs.mkdirSync(featuresDir, { recursive: true });
    const featureName = `${item}Page`;
    const featurePath = path.join(featuresDir, `${featureName}.tsx`);
    if (!fs.existsSync(featurePath)) {
      const reexport =
        domain === "dashboard"
          ? 'export { default } from "@/pages/adminDashboard/dashboard/features/dashboardPage";\n'
          : 'export { default } from "@/pages/adminDashboard/genericModule/features/genericModule";\n';
      fs.writeFileSync(featurePath, reexport);
    }
    const indexPath = path.join(dir, "index.tsx");
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, `import Page from "./features/${featureName}";\n\nexport default Page;\n`);
    }
    console.log("Created student:", `studentDashboard/${domain}/${item}`);
  }
}

// profileSetting at pages root (shared across roles)
console.log("Done generating sidebar folders");
