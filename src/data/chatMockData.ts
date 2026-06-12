import type { Role } from "@/store/slices/authSlice";
import type { ChatContact, ChatMessage, ChatThread } from "@/types/chat";

function avatar(name: string) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
}

function msg(id: string, senderId: string, text: string, minutesAgo: number): ChatMessage {
  return {
    id,
    senderId,
    text,
    sentAt: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
    read: minutesAgo > 30,
  };
}

/** Maps demo login emails to chat participant IDs. */
export const USER_CHAT_IDS: Record<string, string> = {
  "admin@test.com": "usr-admin",
  "teacher@test.com": "usr-teacher-1",
  "faculty@test.com": "usr-faculty-1",
  "student@test.com": "usr-student-1",
};

export const CHAT_CONTACTS: ChatContact[] = [
  { id: "usr-admin", name: "Alex Morgan", role: "admin", title: "Institution Admin", avatar: avatar("Alex Morgan"), online: true },
  { id: "usr-teacher-1", name: "Priya Sharma", role: "teacher", title: "Computer Science · AI", avatar: avatar("Priya Sharma"), online: true },
  { id: "usr-teacher-2", name: "James Wilson", role: "teacher", title: "Mathematics Dept", avatar: avatar("James Wilson"), online: false },
  { id: "usr-teacher-3", name: "Emily Carter", role: "teacher", title: "English Literature", avatar: avatar("Emily Carter"), online: true },
  { id: "usr-faculty-1", name: "Daniel Reyes", role: "faculty", title: "Academic Operations", avatar: avatar("Daniel Reyes"), online: true },
  { id: "usr-faculty-2", name: "Sarah Lopez", role: "faculty", title: "Admissions Office", avatar: avatar("Sarah Lopez"), online: false },
  { id: "usr-student-1", name: "Maya Chen", role: "student", title: "BSc CS · Year 2", avatar: avatar("Maya Chen"), online: true },
  { id: "usr-student-2", name: "Aarav Sharma", role: "student", title: "BSc CS · Year 2", avatar: avatar("Aarav Sharma"), online: true },
  { id: "usr-student-3", name: "Saanvi Patel", role: "student", title: "MBA · Year 1", avatar: avatar("Saanvi Patel"), online: false },
  { id: "usr-student-4", name: "Liam Smith", role: "student", title: "BBA · Year 3", avatar: avatar("Liam Smith"), online: true },
];

/** Which roles each dashboard role is allowed to message. */
export const CHAT_PERMISSIONS: Record<Role, Role[]> = {
  admin: ["teacher", "faculty", "student"],
  teacher: ["student", "faculty", "admin"],
  faculty: ["student", "teacher", "admin"],
  student: ["teacher", "faculty", "admin"],
};

export function chatUserId(email: string): string {
  return USER_CHAT_IDS[email.trim().toLowerCase()] ?? email;
}

export function getContactById(id: string): ChatContact | undefined {
  return CHAT_CONTACTS.find((c) => c.id === id);
}

export function getContactsForRole(viewerRole: Role, viewerId: string): ChatContact[] {
  const allowed = CHAT_PERMISSIONS[viewerRole];
  return CHAT_CONTACTS.filter((c) => allowed.includes(c.role) && c.id !== viewerId);
}

function thread(id: string, contactId: string, messages: ChatMessage[], unreadCount = 0): ChatThread {
  return { id, contactId, messages, unreadCount };
}

/** Initial conversations seeded per demo account. */
export function seedThreadsForUser(userEmail: string, userRole: Role): ChatThread[] {
  const me = chatUserId(userEmail);
  const contacts = getContactsForRole(userRole, me);

  const pick = (...ids: string[]) =>
    ids
      .map((id) => contacts.find((c) => c.id === id))
      .filter(Boolean) as ChatContact[];

  if (userRole === "admin") {
    const [teacher, faculty, student] = pick("usr-teacher-1", "usr-faculty-1", "usr-student-2");
    return [
      teacher &&
        thread("th-admin-teacher", teacher.id, [
          msg("m1", teacher.id, "Hi Alex, the semester exam schedule draft is ready for review.", 180),
          msg("m2", me, "Thanks Priya — I'll review it this afternoon.", 175),
          msg("m3", teacher.id, "Let me know if any slot conflicts need adjusting.", 120),
        ], 1),
      faculty &&
        thread("th-admin-faculty", faculty.id, [
          msg("m4", faculty.id, "Admission verification queue is at 24 pending files.", 90),
          msg("m5", me, "Please prioritize scholarship applicants first.", 85),
        ], 0),
      student &&
        thread("th-admin-student", student.id, [
          msg("m6", student.id, "Hello, I need help updating my guardian contact details.", 45),
          msg("m7", me, "Hi Aarav — please submit the form under Student Profiles.", 40),
        ], 1),
    ].filter(Boolean) as ChatThread[];
  }

  if (userRole === "teacher") {
    const [student, faculty, admin] = pick("usr-student-1", "usr-faculty-1", "usr-admin");
    return [
      student &&
        thread("th-teacher-student", student.id, [
          msg("m8", student.id, "Professor, could I get an extension on Assignment 3?", 60),
          msg("m9", me, "Hi Maya — share your reason and I'll consider a 2-day extension.", 55),
          msg("m10", student.id, "I had a medical appointment — documentation attached in portal.", 50),
        ], 1),
      faculty &&
        thread("th-teacher-faculty", faculty.id, [
          msg("m11", faculty.id, "Room B-204 is booked for your Friday lab session.", 240),
          msg("m12", me, "Perfect, thank you Daniel.", 235),
        ], 0),
      admin &&
        thread("th-teacher-admin", admin.id, [
          msg("m13", admin.id, "Reminder: faculty performance reviews open next week.", 720),
        ], 1),
    ].filter(Boolean) as ChatThread[];
  }

  if (userRole === "faculty") {
    const [student, teacher, admin] = pick("usr-student-3", "usr-teacher-2", "usr-admin");
    return [
      student &&
        thread("th-faculty-student", student.id, [
          msg("m14", student.id, "Is my enrollment confirmation available yet?", 30),
          msg("m15", me, "Yes Saanvi — it was emailed yesterday. Check spam folder too.", 25),
        ], 0),
      teacher &&
        thread("th-faculty-teacher", teacher.id, [
          msg("m16", teacher.id, "James here — need hall allocation for midterm exams.", 150),
          msg("m17", me, "Hall C-12 is reserved for Mathematics on the 18th.", 145),
        ], 0),
      admin &&
        thread("th-faculty-admin", admin.id, [
          msg("m18", admin.id, "Monthly operations report is due by Friday.", 300),
        ], 1),
    ].filter(Boolean) as ChatThread[];
  }

  // student
  const [teacher, faculty, admin] = pick("usr-teacher-1", "usr-faculty-2", "usr-admin");
  return [
    teacher &&
      thread("th-student-teacher", teacher.id, [
        msg("m19", teacher.id, "Welcome to Intro to AI! Office hours are Wed 2–4 PM.", 1440),
        msg("m20", me, "Thank you! I'll join this Wednesday.", 1430),
        msg("m21", teacher.id, "Great — bring your project draft if ready.", 120),
      ], 1),
    faculty &&
      thread("th-student-faculty", faculty.id, [
        msg("m22", faculty.id, "Your fee installment receipt has been processed.", 480),
        msg("m23", me, "Received, thanks for the update.", 475),
      ], 0),
    admin &&
      thread("th-student-admin", admin.id, [
        msg("m24", admin.id, "Campus maintenance scheduled Saturday 8 AM – 12 PM.", 960),
      ], 0),
  ].filter(Boolean) as ChatThread[];
}
