
import { useAppSelector } from "@/store/store";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { revenueData, admissionFunnel, attendanceTrend, leadSourceDist, upcomingClasses, announcements, students, fees, courses } from "@/mockData";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";



const COLORS = ["oklch(0.585 0.214 263)", "oklch(0.72 0.13 188)", "oklch(0.72 0.18 145)", "oklch(0.78 0.16 75)", "oklch(0.64 0.22 25)", "oklch(0.68 0.18 305)"];

const chartTooltip = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    fontSize: "12px",
  },
};

export default function Dashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const role = user?.role ?? "admin";

  const titles: Record<string, string> = {
    admin: "Organization overview",
    teacher: "Today's classes & student insights",
    faculty: "Operations & administrative tasks",
    student: "Your learning at a glance",
  };

  const stats = {
    admin: [
      { title: "Total Students", value: "12,840", delta: 8, icon: "UserGroupIcon", tone: "primary" as const },
      { title: "Active Courses", value: "468", delta: 4, icon: "BookOpenIcon", tone: "accent" as const },
      { title: "Revenue (MTD)", value: "$610K", delta: 12, icon: "BanknotesIcon", tone: "success" as const },
      { title: "New Admissions", value: "1,284", delta: 17, icon: "ClipboardDocumentCheckIcon", tone: "warning" as const },
    ],
    teacher: [
      { title: "Classes Today", value: "6", icon: "VideoCameraIcon", tone: "primary" as const },
      { title: "Students", value: "284", delta: 2, icon: "UserGroupIcon", tone: "accent" as const },
      { title: "Pending Reviews", value: "23", icon: "DocumentTextIcon", tone: "warning" as const },
      { title: "Avg. Rating", value: "4.8", delta: 3, icon: "StarIcon", tone: "success" as const },
    ],
    faculty: [
      { title: "Open Applications", value: "342", delta: 6, icon: "ClipboardDocumentCheckIcon", tone: "primary" as const },
      { title: "Fees Collected", value: "$48K", delta: 9, icon: "BanknotesIcon", tone: "success" as const },
      { title: "Books Issued", value: "1,204", icon: "BookmarkSquareIcon", tone: "accent" as const },
      { title: "Tasks Pending", value: "17", icon: "Cog6ToothIcon", tone: "warning" as const },
    ],
    student: [
      { title: "Enrolled Courses", value: "6", icon: "BookOpenIcon", tone: "primary" as const },
      { title: "Attendance", value: "94%", delta: 2, icon: "CheckBadgeIcon", tone: "success" as const },
      { title: "CGPA", value: "3.84", delta: 1, icon: "AcademicCapIcon", tone: "accent" as const },
      { title: "Pending Tasks", value: "4", icon: "DocumentTextIcon", tone: "warning" as const },
    ],
  }[role];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="text-muted-foreground mt-1">{titles[role]}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground font-medium shadow-elegant text-sm">+ Quick Add</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">View reports</button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Revenue vs Expenses</h3>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Revenue</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.585 0.214 263)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.585 0.214 263)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.13 188)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.72 0.13 188)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip {...chartTooltip} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.585 0.214 263)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="oklch(0.72 0.13 188)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Lead Sources</h3>
          <p className="text-xs text-muted-foreground mb-2">Where conversions came from</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={leadSourceDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {leadSourceDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...chartTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {leadSourceDist.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Admission Funnel</h3>
          <p className="text-xs text-muted-foreground mb-2">Current cycle</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={admissionFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="stage" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="value" fill="oklch(0.585 0.214 263)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Attendance Trend</h3>
          <p className="text-xs text-muted-foreground mb-2">Last 14 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip {...chartTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="present" stroke="oklch(0.72 0.18 145)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="absent" stroke="oklch(0.64 0.22 25)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Upcoming Classes</h3>
          <p className="text-xs text-muted-foreground mb-3">Today's schedule</p>
          <ul className="space-y-2">
            {upcomingClasses.map((c) => (
              <li key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="w-10 h-10 rounded-lg gradient-primary/20 bg-primary/15 text-primary flex items-center justify-center font-semibold text-xs">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border/60">
            <h3 className="font-semibold">Recent Students</h3>
            <p className="text-xs text-muted-foreground">Latest enrolments</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Program</th>
                <th className="px-4 py-2.5">CGPA</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 6).map((s) => (
                <tr key={s.id} className="border-t border-border/60 hover:bg-muted/30">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img src={s.avatar} className="w-8 h-8 rounded-full" alt="" />
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.rollNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.program}</td>
                  <td className="px-4 py-2.5 font-medium">{s.cgpa}</td>
                  <td className="px-4 py-2.5"><Badge tone={statusTone(s.status)}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Announcements</h3>
          <p className="text-xs text-muted-foreground mb-3">Latest updates</p>
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li key={a.id} className="flex gap-3">
                <div className="w-1 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Top Courses</h3>
          <ul className="space-y-2.5">
            {courses.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm">
                    <p className="font-medium truncate">{c.title}</p>
                    <span className="text-muted-foreground">{c.enrolled}/{c.capacity}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                    <div className="h-full gradient-primary" style={{ width: `${(c.enrolled / c.capacity) * 100}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Fees Outstanding</h3>
          <ul className="space-y-2">
            {fees.filter((f) => f.status !== "Paid").slice(0, 5).map((f) => (
              <li key={f.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border/60 last:border-0">
                <div>
                  <p className="font-medium">{f.student}</p>
                  <p className="text-xs text-muted-foreground">{f.program} · {f.invoice}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${f.due.toLocaleString()}</p>
                  <Badge tone={statusTone(f.status)}>{f.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
