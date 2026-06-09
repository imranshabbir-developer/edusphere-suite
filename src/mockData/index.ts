export interface Student {
  id: string; name: string; email: string; rollNo: string; program: string;
  batch: string; section: string; cgpa: number; attendance: number; status: "Active" | "On Leave" | "Graduated";
  guardian: string; phone: string; avatar: string;
}
export interface Teacher {
  id: string; name: string; email: string; department: string; subjects: string[];
  experience: number; rating: number; status: "Active" | "On Leave"; avatar: string;
}
export interface Course {
  id: string; code: string; title: string; department: string; credits: number;
  enrolled: number; capacity: number; instructor: string; status: "Published" | "Draft" | "Archived"; thumbnail: string;
}
export interface Admission {
  id: string; applicant: string; email: string; program: string; appliedOn: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected" | "Waitlisted"; score: number; documents: number;
}
export interface FeeRecord {
  id: string; student: string; program: string; amount: number; paid: number;
  due: number; status: "Paid" | "Partial" | "Overdue"; dueDate: string; invoice: string;
}
export interface Exam {
  id: string; title: string; program: string; date: string; duration: number;
  type: "Mid-term" | "Final" | "Quiz" | "Practical"; status: "Scheduled" | "Live" | "Completed";
}
export interface Assignment {
  id: string; title: string; course: string; due: string; submissions: number; total: number; status: "Open" | "Closed";
}

const programs = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const depts = ["Computer Science", "Mathematics", "Physics", "Business", "Humanities", "Engineering"];
const first = ["Aarav", "Saanvi", "Vihaan", "Ananya", "Arjun", "Diya", "Liam", "Mia", "Noah", "Sophia", "Lucas", "Isabella", "Elijah", "Charlotte", "Oliver", "Amelia"];
const last = ["Sharma", "Verma", "Patel", "Singh", "Reddy", "Smith", "Johnson", "Brown", "Garcia", "Miller"];

const av = (n: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(n)}`;

export const students: Student[] = Array.from({ length: 60 }).map((_, i) => {
  const name = `${first[i % first.length]} ${last[(i * 2) % last.length]}`;
  return {
    id: `STU-${2000 + i}`,
    name, email: name.toLowerCase().replace(" ", ".") + "@uni.edu",
    rollNo: `2024${String(i + 1).padStart(4, "0")}`,
    program: programs[i % programs.length],
    batch: `${2022 + (i % 3)}-${2026 + (i % 3)}`,
    section: ["A", "B", "C"][i % 3],
    cgpa: +(2.8 + (i % 13) * 0.1).toFixed(2),
    attendance: 65 + (i % 35),
    status: i % 11 === 0 ? "On Leave" : i % 17 === 0 ? "Graduated" : "Active",
    guardian: `${first[(i + 3) % first.length]} ${last[i % last.length]}`,
    phone: `+1 555 1${String(i).padStart(3, "0")}`,
    avatar: av(name),
  };
});

export const teachers: Teacher[] = Array.from({ length: 24 }).map((_, i) => {
  const name = `${first[(i + 5) % first.length]} ${last[(i + 1) % last.length]}`;
  return {
    id: `TCH-${300 + i}`, name, email: name.toLowerCase().replace(" ", ".") + "@uni.edu",
    department: depts[i % depts.length],
    subjects: [["Algorithms", "Data Structures"], ["Calculus", "Linear Algebra"], ["Mechanics", "Optics"], ["Marketing", "Strategy"]][i % 4],
    experience: 2 + (i % 18), rating: +(3.6 + (i % 14) * 0.1).toFixed(1),
    status: i % 9 === 0 ? "On Leave" : "Active", avatar: av(name),
  };
});

export const courses: Course[] = Array.from({ length: 28 }).map((_, i) => ({
  id: `CRS-${500 + i}`,
  code: `CS${100 + i * 10}`,
  title: ["Intro to AI", "Data Structures", "Operating Systems", "Database Systems", "Linear Algebra", "Quantum Physics", "Marketing 101", "Corporate Finance", "World Literature", "Machine Learning", "Cloud Computing", "Cybersecurity"][i % 12] + (i > 11 ? ` II` : ""),
  department: depts[i % depts.length],
  credits: 3 + (i % 3),
  enrolled: 20 + (i * 5) % 80,
  capacity: 100,
  instructor: teachers[i % teachers.length].name,
  status: i % 7 === 0 ? "Draft" : i % 13 === 0 ? "Archived" : "Published",
  thumbnail: `https://images.unsplash.com/photo-${1516321318423 + i * 1000}-f06f8e6dee76?w=400`,
}));

export const admissions: Admission[] = Array.from({ length: 40 }).map((_, i) => {
  const name = `${first[(i + 2) % first.length]} ${last[(i + 4) % last.length]}`;
  const statuses: Admission["status"][] = ["Submitted", "Under Review", "Approved", "Rejected", "Waitlisted"];
  return {
    id: `ADM-${7000 + i}`, applicant: name,
    email: name.toLowerCase().replace(" ", ".") + "@mail.com",
    program: programs[i % programs.length],
    appliedOn: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    status: statuses[i % statuses.length],
    score: 60 + (i * 3) % 40,
    documents: 3 + (i % 5),
  };
});

export const fees: FeeRecord[] = Array.from({ length: 36 }).map((_, i) => {
  const amount = 8000 + (i % 6) * 2000;
  const paid = i % 5 === 0 ? 0 : i % 3 === 0 ? amount / 2 : amount;
  return {
    id: `INV-${9000 + i}`,
    student: students[i % students.length].name,
    program: students[i % students.length].program,
    amount, paid, due: amount - paid,
    status: paid === amount ? "Paid" : paid === 0 ? "Overdue" : "Partial",
    dueDate: new Date(Date.now() + (i - 10) * 86400000).toISOString(),
    invoice: `INV-${9000 + i}`,
  };
});

export const exams: Exam[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `EXM-${400 + i}`,
  title: courses[i % courses.length].title + " " + (["Mid-term", "Final", "Quiz"][i % 3]),
  program: programs[i % programs.length],
  date: new Date(Date.now() + (i - 6) * 86400000).toISOString(),
  duration: 60 + (i % 3) * 30,
  type: (["Mid-term", "Final", "Quiz", "Practical"] as const)[i % 4],
  status: i < 6 ? "Completed" : i < 8 ? "Live" : "Scheduled",
}));

export const assignments: Assignment[] = Array.from({ length: 22 }).map((_, i) => ({
  id: `ASG-${800 + i}`,
  title: ["Lab Report", "Essay", "Problem Set", "Group Project", "Case Study"][i % 5] + " #" + (i + 1),
  course: courses[i % courses.length].title,
  due: new Date(Date.now() + (i - 5) * 86400000).toISOString(),
  submissions: 10 + (i * 4) % 50,
  total: 60,
  status: i % 7 === 0 ? "Closed" : "Open",
}));

export const departments = depts.map((name, i) => ({
  id: `DPT-${100 + i}`, name, head: teachers[i % teachers.length].name,
  faculty: 8 + (i * 3) % 20, students: 120 + (i * 50) % 400, established: 1990 + i * 3,
}));

export const announcements = [
  { id: 1, title: "Mid-term exams begin Nov 15", time: "2h ago", type: "exam" },
  { id: 2, title: "New library hours starting Monday", time: "5h ago", type: "info" },
  { id: 3, title: "Spring registration now open", time: "1d ago", type: "academic" },
  { id: 4, title: "Career fair on Friday — 40+ companies", time: "2d ago", type: "event" },
  { id: 5, title: "Scholarship deadline extended", time: "3d ago", type: "finance" },
];

export const upcomingClasses = [
  { id: 1, course: "Intro to AI", time: "10:00 AM", room: "Hall A-204", teacher: "Priya Sharma" },
  { id: 2, course: "Data Structures", time: "11:30 AM", room: "Online", teacher: "Daniel Reyes" },
  { id: 3, course: "Linear Algebra", time: "2:00 PM", room: "Hall B-101", teacher: "Alex Morgan" },
  { id: 4, course: "Marketing 101", time: "3:30 PM", room: "Online", teacher: "Jane Doe" },
];

export const revenueData = [
  { month: "Jan", revenue: 240000, expenses: 180000 },
  { month: "Feb", revenue: 280000, expenses: 195000 },
  { month: "Mar", revenue: 320000, expenses: 210000 },
  { month: "Apr", revenue: 295000, expenses: 200000 },
  { month: "May", revenue: 360000, expenses: 230000 },
  { month: "Jun", revenue: 410000, expenses: 250000 },
  { month: "Jul", revenue: 385000, expenses: 245000 },
  { month: "Aug", revenue: 440000, expenses: 270000 },
  { month: "Sep", revenue: 520000, expenses: 295000 },
  { month: "Oct", revenue: 490000, expenses: 285000 },
  { month: "Nov", revenue: 560000, expenses: 310000 },
  { month: "Dec", revenue: 610000, expenses: 330000 },
];

export const admissionFunnel = [
  { stage: "Inquiries", value: 4200 },
  { stage: "Applications", value: 2850 },
  { stage: "Verified", value: 1980 },
  { stage: "Offered", value: 1320 },
  { stage: "Enrolled", value: 980 },
];

export const attendanceTrend = Array.from({ length: 14 }).map((_, i) => ({
  day: `Day ${i + 1}`,
  present: 80 + Math.round(Math.sin(i / 2) * 10) + (i % 3),
  absent: 20 - Math.round(Math.sin(i / 2) * 10) - (i % 3),
}));

export const leadSourceDist = [
  { name: "Website", value: 38 },
  { name: "Referral", value: 22 },
  { name: "Social Media", value: 18 },
  { name: "Event", value: 12 },
  { name: "Walk-in", value: 6 },
  { name: "Campaign", value: 4 },
];
