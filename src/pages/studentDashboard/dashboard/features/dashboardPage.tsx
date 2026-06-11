import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/StatusBadge";
import { chartTooltip, DashboardHero } from "@/components/dashboard/dashboardShared";
import {
  studentCourseProgress, studentStudyHours, studentGradeTrend,
  studentAssignmentsDue, studentRecentGrades, studentAnnouncements, upcomingClasses,
} from "@/mockData";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const gradeTone = (g: string) =>
  g.startsWith("A") ? "success" : g.startsWith("B") ? "primary" : "warning";

export default function StudentDashboard() {
  const stats = [
    { title: "Enrolled Courses", value: "6", icon: "BookOpenIcon", tone: "primary" as const },
    { title: "Attendance", value: "94%", delta: 2, icon: "CheckBadgeIcon", tone: "success" as const },
    { title: "CGPA", value: "3.84", delta: 1, icon: "AcademicCapIcon", tone: "accent" as const },
    { title: "Pending Tasks", value: "4", icon: "DocumentTextIcon", tone: "warning" as const },
  ];

  const myClasses = upcomingClasses.slice(0, 4);

  return (
    <div className="space-y-6">
      <DashboardHero
        subtitle="Your learning progress, upcoming classes, and assignments"
        actions={
          <>
            <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground font-medium shadow-elegant text-sm">Join Live Class</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">View Assignments</button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Course Progress</h3>
          <p className="text-xs text-muted-foreground mb-4">Completion across enrolled courses</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={studentCourseProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="course" stroke="var(--muted-foreground)" fontSize={10} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="progress" name="Progress %" fill="oklch(0.585 0.214 263)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">GPA Trend</h3>
          <p className="text-xs text-muted-foreground mb-2">Semester-over-semester</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={studentGradeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="term" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[3.4, 4]} />
              <Tooltip {...chartTooltip} />
              <Line type="monotone" dataKey="gpa" name="GPA" stroke="oklch(0.72 0.13 188)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.72 0.13 188)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Weekly Study Hours</h3>
          <p className="text-xs text-muted-foreground mb-2">Time spent learning this week</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={studentStudyHours}>
              <defs>
                <linearGradient id="stuStudyG1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.13 188)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="oklch(0.72 0.13 188)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip {...chartTooltip} />
              <Area type="monotone" dataKey="hours" name="Hours" stroke="oklch(0.72 0.13 188)" fill="url(#stuStudyG1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Upcoming Classes</h3>
          <p className="text-xs text-muted-foreground mb-3">Your schedule today</p>
          <ul className="space-y-2">
            {myClasses.map((c) => (
              <li key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-semibold text-xs">
                  {c.time.split(" ")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.course}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.teacher} · {c.room}</p>
                </div>
                <Badge tone={c.room === "Online" ? "primary" : "default"}>{c.room === "Online" ? "Live" : c.room}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Assignments Due</h3>
          <p className="text-xs text-muted-foreground mb-3">Open submissions</p>
          <ul className="space-y-2">
            {studentAssignmentsDue.map((a) => (
              <li key={a.id} className="p-2.5 rounded-lg border border-border/60 hover:bg-muted/40">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.course}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-warning">Due {a.dueLabel}</span>
                  <span className="text-[11px] text-muted-foreground">{a.submissions}/{a.total} submitted</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border/60">
            <h3 className="font-semibold">Recent Grades</h3>
            <p className="text-xs text-muted-foreground">Latest assessment results</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5">Course</th>
                <th className="px-4 py-2.5">Assessment</th>
                <th className="px-4 py-2.5">Score</th>
                <th className="px-4 py-2.5">Grade</th>
              </tr>
            </thead>
            <tbody>
              {studentRecentGrades.map((g, i) => (
                <tr key={i} className="border-t border-border/60 hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium">{g.course}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{g.item}</td>
                  <td className="px-4 py-2.5">{g.score}%</td>
                  <td className="px-4 py-2.5"><Badge tone={gradeTone(g.grade)}>{g.grade}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Your Updates</h3>
          <p className="text-xs text-muted-foreground mb-3">Personal notifications</p>
          <ul className="space-y-3">
            {studentAnnouncements.map((a) => (
              <li key={a.id} className="flex gap-3">
                <div className="w-1 rounded-full bg-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
