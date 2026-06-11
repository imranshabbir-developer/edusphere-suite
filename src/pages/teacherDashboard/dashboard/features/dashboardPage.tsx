import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/StatusBadge";
import { COLORS, chartTooltip, DashboardHero } from "@/components/dashboard/dashboardShared";
import {
  teacherEngagement, teacherSubmissionsByCourse, teacherGradeDist,
  teacherPendingGrading, teacherClassSchedule,
} from "@/mockData";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export default function TeacherDashboard() {
  const stats = [
    { title: "Classes Today", value: "4", icon: "VideoCameraIcon", tone: "primary" as const },
    { title: "My Students", value: "284", delta: 2, icon: "UserGroupIcon", tone: "accent" as const },
    { title: "Pending Reviews", value: "23", icon: "DocumentTextIcon", tone: "warning" as const },
    { title: "Avg. Rating", value: "4.8", delta: 3, icon: "StarIcon", tone: "success" as const },
  ];

  return (
    <div className="space-y-6">
      <DashboardHero
        subtitle="Today's classes, student engagement, and grading queue"
        actions={
          <>
            <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground font-medium shadow-elegant text-sm">Start Live Class</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Grade Submissions</button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Class Engagement</h3>
              <p className="text-xs text-muted-foreground">Participation & attendance this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={teacherEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[60, 100]} />
              <Tooltip {...chartTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="participation" name="Participation %" stroke="oklch(0.585 0.214 263)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="oklch(0.72 0.18 145)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Grade Distribution</h3>
          <p className="text-xs text-muted-foreground mb-2">Across your courses</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={teacherGradeDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {teacherGradeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...chartTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs justify-center">
            {teacherGradeDist.map((g, i) => (
              <span key={g.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {g.name}: {g.value}%
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Assignment Submissions</h3>
          <p className="text-xs text-muted-foreground mb-2">By course — submitted vs pending</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={teacherSubmissionsByCourse} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis type="category" dataKey="course" stroke="var(--muted-foreground)" fontSize={10} width={90} />
              <Tooltip {...chartTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="submitted" name="Submitted" fill="oklch(0.72 0.18 145)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="pending" name="Pending" fill="oklch(0.78 0.16 75)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Today's Schedule</h3>
          <p className="text-xs text-muted-foreground mb-3">Your classes for today</p>
          <ul className="space-y-2">
            {teacherClassSchedule.map((c) => (
              <li key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-semibold text-xs">
                  {c.time.split(" ")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.course}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.section} · {c.room}</p>
                </div>
                <Badge tone={c.room === "Online" ? "primary" : "default"}>{c.room === "Online" ? "Live" : c.room}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Pending Grading</h3>
          <p className="text-xs text-muted-foreground mb-3">Submissions awaiting review</p>
          <ul className="space-y-2">
            {teacherPendingGrading.map((p) => (
              <li key={p.id} className="p-2.5 rounded-lg border border-border/60 hover:bg-muted/40">
                <p className="text-sm font-medium">{p.student}</p>
                <p className="text-xs text-muted-foreground">{p.assignment} · {p.course}</p>
                <p className="text-[11px] text-warning mt-1">Submitted {p.submitted}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
