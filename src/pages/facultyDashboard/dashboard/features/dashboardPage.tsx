import { StatsCard } from "@/components/ui/StatsCard";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { COLORS, chartTooltip, DashboardHero } from "@/components/dashboard/dashboardShared";
import {
  facultyApplicationStatus, facultyFeeTrend, facultyDeptWorkload,
  facultyPendingAdmissions, facultyTodayTasks, fees,
} from "@/mockData";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const priorityTone = (p: string) =>
  p === "High" ? "danger" : p === "Medium" ? "warning" : "default";

export default function FacultyDashboard() {
  const stats = [
    { title: "Open Applications", value: "342", delta: 6, icon: "ClipboardDocumentCheckIcon", tone: "primary" as const },
    { title: "Fees Collected", value: "$48K", delta: 9, icon: "BanknotesIcon", tone: "success" as const },
    { title: "Books Issued", value: "1,204", icon: "BookmarkSquareIcon", tone: "accent" as const },
    { title: "Tasks Pending", value: "17", icon: "Cog6ToothIcon", tone: "warning" as const },
  ];

  return (
    <div className="space-y-6">
      <DashboardHero
        subtitle="Operations desk — admissions, fees, library, and daily tasks"
        actions={
          <>
            <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground font-medium shadow-elegant text-sm">Process Application</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Record Payment</button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Application Pipeline</h3>
          <p className="text-xs text-muted-foreground mb-2">Current admission cycle</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={facultyApplicationStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {facultyApplicationStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...chartTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {facultyApplicationStatus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground truncate">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Fee Collection Trend</h3>
              <p className="text-xs text-muted-foreground">Collected vs pending — last 6 months</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Collected</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Pending</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={facultyFeeTrend}>
              <defs>
                <linearGradient id="facFeeG1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.585 0.214 263)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="oklch(0.585 0.214 263)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="facFeeG2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip {...chartTooltip} />
              <Area type="monotone" dataKey="collected" stroke="oklch(0.585 0.214 263)" fill="url(#facFeeG1)" strokeWidth={2} />
              <Area type="monotone" dataKey="pending" stroke="oklch(0.78 0.16 75)" fill="url(#facFeeG2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Workload by Department</h3>
          <p className="text-xs text-muted-foreground mb-2">Open operational tasks</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={facultyDeptWorkload}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="dept" stroke="var(--muted-foreground)" fontSize={9} angle={-20} textAnchor="end" height={50} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="tasks" fill="oklch(0.72 0.13 188)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Today's Task Queue</h3>
          <p className="text-xs text-muted-foreground mb-3">Assigned to your desk</p>
          <ul className="space-y-2">
            {facultyTodayTasks.map((t) => (
              <li key={t.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{t.task}</p>
                  <p className="text-xs text-muted-foreground">{t.dept} · {t.due}</p>
                </div>
                <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Overdue Fees</h3>
          <p className="text-xs text-muted-foreground mb-3">Requires follow-up</p>
          <ul className="space-y-2">
            {fees.filter((f) => f.status === "Overdue").slice(0, 5).map((f) => (
              <li key={f.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border/60 last:border-0">
                <div className="min-w-0">
                  <p className="font-medium truncate">{f.student}</p>
                  <p className="text-xs text-muted-foreground">{f.invoice}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">${f.due.toLocaleString()}</p>
                  <Badge tone={statusTone(f.status)}>{f.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border/60">
          <h3 className="font-semibold">Applications Awaiting Review</h3>
          <p className="text-xs text-muted-foreground">Submitted or under verification</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Applicant</th>
              <th className="px-4 py-2.5">Program</th>
              <th className="px-4 py-2.5">Score</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {facultyPendingAdmissions.map((a) => (
              <tr key={a.id} className="border-t border-border/60 hover:bg-muted/30">
                <td className="px-4 py-2.5">
                  <p className="font-medium">{a.applicant}</p>
                  <p className="text-xs text-muted-foreground">{a.email}</p>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{a.program}</td>
                <td className="px-4 py-2.5 font-medium">{a.score}</td>
                <td className="px-4 py-2.5"><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
