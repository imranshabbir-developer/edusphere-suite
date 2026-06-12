/** Shared realistic constants for EduSphere LMS — schools, colleges, universities & short courses */

export const FIRST_NAMES = [
  "Aarav", "Saanvi", "Vihaan", "Ananya", "Arjun", "Diya", "Rahul", "Priya",
  "Imran", "Fatima", "Hassan", "Ayesha", "Omar", "Zainab", "Ali", "Sara",
  "Liam", "Mia", "Noah", "Sophia", "Lucas", "Isabella", "Elijah", "Charlotte",
];

export const LAST_NAMES = [
  "Sharma", "Verma", "Patel", "Singh", "Khan", "Ahmed", "Malik", "Hussain",
  "Reddy", "Gupta", "Smith", "Johnson", "Brown", "Garcia", "Miller", "Wilson",
];

export const STAFF_NAMES = [
  "Dr. Priya Sharma", "Prof. Daniel Reyes", "Alex Morgan", "Jane Doe",
  "Mark Lee", "Dr. Fatima Khan", "Prof. Hassan Ahmed", "Sarah Johnson",
  "Michael Chen", "Dr. Ayesha Malik", "James Wilson", "Emily Davis",
];

export const SCHOOL_NAMES = [
  "Green Valley International School", "Sunrise Academy", "Cambridge Model School",
  "Edusphere Primary & Secondary", "Beacon House School System", "City Grammar School",
  "Oxford Public School", "Heritage High School", "Future Leaders Academy", "Starlight School",
];

export const COLLEGE_NAMES = [
  "National College of Engineering", "City Arts & Science College", "Edusphere Polytechnic",
  "Metropolitan Business College", "TechBridge Intermediate College", "Global Commerce College",
  "Institute of Applied Sciences", "Premier Pre-University College",
];

export const UNIVERSITY_NAMES = [
  "Edusphere University", "Global Tech University", "National Institute of Technology",
  "Metropolitan State University", "International Business University", "Science & Arts University",
];

export const DEGREE_PROGRAMS = [
  "B.Tech Computer Science", "B.Tech Software Engineering", "BBA Business Administration",
  "MBA Executive", "M.Tech Artificial Intelligence", "B.Sc Physics", "BA English Literature",
  "B.Com Accounting", "M.Sc Data Science", "PhD Computer Science",
];

export const SHORT_COURSES = [
  "Full Stack Web Development", "Artificial Intelligence Fundamentals", "Digital Marketing Mastery",
  "UI/UX Design Bootcamp", "Data Science with Python", "Cloud Computing (AWS)",
  "Cybersecurity Essentials", "Graphic Design Professional", "Mobile App Development (React Native)",
  "Machine Learning for Beginners", "SEO & Content Marketing", "Blockchain Basics",
];

export const ALL_PROGRAMS = [...DEGREE_PROGRAMS, ...SHORT_COURSES];

export const DEPARTMENTS = [
  "Computer Science", "Mathematics", "Physics", "Business Administration",
  "Humanities", "Engineering", "Electrical Engineering", "Mechanical Engineering",
  "Marketing", "Finance", "Biology", "Chemistry", "English", "Economics",
];

export const SUBJECTS = [
  "Data Structures", "Algorithms", "Operating Systems", "Database Systems",
  "Linear Algebra", "Calculus", "Quantum Physics", "Organic Chemistry",
  "Corporate Finance", "Marketing Strategy", "World Literature", "Machine Learning",
  "Web Development", "Digital Marketing", "UI/UX Design", "Cloud Architecture",
];

export const COURSE_TITLES = [
  "Introduction to Artificial Intelligence", "Data Structures & Algorithms", "Operating Systems",
  "Database Management Systems", "Linear Algebra", "Quantum Mechanics", "Marketing Fundamentals",
  "Corporate Finance", "World Literature", "Machine Learning", "Cloud Computing",
  "Cybersecurity", "Full Stack Web Development", "Digital Marketing", "UI/UX Design Principles",
];

export const SECTIONS = ["A", "B", "C", "D"];
export const BATCHES = ["2022-2026", "2023-2027", "2024-2028", "2025-2029", "Jan 2025 Cohort", "Jun 2025 Cohort"];

export const LEAD_SOURCES = ["Website", "Referral", "Social Media", "Education Fair", "Walk-in", "Google Ads", "WhatsApp"];
export const INQUIRY_TYPES = ["Admission", "Course Info", "Fee Structure", "Scholarship", "Campus Visit", "Transfer"];
export const CRM_STATUSES = ["New", "Contacted", "Qualified", "In Progress", "Converted", "Lost"];
export const ADMISSION_STATUSES = ["Draft", "Submitted", "Under Review", "Verified", "Approved", "Rejected", "Enrolled"];
export const ACTIVE_STATUSES = ["Active", "Inactive", "Pending", "Suspended", "Archived"];
export const FEE_STATUSES = ["Paid", "Partial", "Overdue", "Waived", "Pending"];
export const EXAM_TYPES = ["Mid-term", "Final", "Quiz", "Practical", "Viva", "Assignment"];
export const EXAM_STATUSES = ["Scheduled", "Live", "Completed", "Cancelled", "Postponed"];
export const ASSIGNMENT_STATUSES = ["Open", "Closed", "Draft", "Grading"];
export const BOOK_CATEGORIES = ["Computer Science", "Mathematics", "Physics", "Business", "Literature", "Reference", "Journals"];
export const ROOM_TYPES = ["Single", "Double", "Triple", "Dormitory"];
export const VEHICLE_TYPES = ["Bus", "Van", "Mini Bus", "Car"];
export const EVENT_TYPES = ["Workshop", "Seminar", "Conference", "Webinar", "Career Fair"];
export const HR_STATUSES = ["Open", "Interviewing", "Offered", "Hired", "Closed"];
export const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Maternity", "Unpaid"];
export const COMM_CHANNELS = ["Email", "SMS", "Push Notification", "In-App", "WhatsApp"];
export const ROLES_LIST = ["Admin", "Teacher", "Faculty", "Student", "Accountant", "Librarian", "HR Manager"];
export const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];
export const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const LOCATIONS = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Multan", "Faisalabad",
  "New York", "London", "Dubai", "Singapore", "Toronto", "Sydney",
];

export const BUILDINGS = ["Block A", "Block B", "Block C", "Main Building", "Science Block", "Admin Block"];
export const ROOMS = ["A-101", "A-204", "B-101", "B-302", "C-201", "Lab-1", "Lab-2", "Hall-A", "Online"];

export function fullName(i: number): string {
  return `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 2) % LAST_NAMES.length]}`;
}

export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function pick<T>(arr: T[], i: number): T {
  return arr[((i % arr.length) + arr.length) % arr.length];
}

export function makeId(prefix: string, i: number): string {
  return `${prefix}-${1000 + i}`;
}

export function dateOffset(days: number): string {
  return new Date(Date.now() + days * 86400000).toLocaleDateString();
}

export function isoDateOffset(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString();
}
