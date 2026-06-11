
import { attendanceTrend, students } from "@/mockData";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/StatusBadge";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";



export default function AttendancePage() {
  const [section, setSection] = useState("A");
  const [marked, setMarked] = useState<Record<string, "present" | "absent" | "late" | undefined>>({});
  const list = students.filter((s) => s.section === section).slice(0, 12);
  const present = Object.values(marked).filter((v) => v === "present").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Attendance</h1>
        <p className="text-muted-foreground text-sm">Mark and analyze attendance per section.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today's Avg" value="91%" icon="CheckBadgeIcon" tone="success" delta={2} />
        <StatsCard title="Marked" value={`${present}/${list.length}`} icon="PencilSquareIcon" tone="primary" />
        <StatsCard title="On Leave" value={3} icon="ClockIcon" tone="warning" />
        <StatsCard title="Absentees" value={5} icon="XCircleIcon" tone="danger" />
      </div>
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold mb-3">Attendance Trend (14 days)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={attendanceTrend}>
            <defs>
              <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="present" stroke="oklch(0.72 0.18 145)" fill="url(#a1)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold">Mark Attendance · Section {section}</h3>
            <p className="text-xs text-muted-foreground">Tap a status next to each student.</p>
          </div>
          <div className="flex gap-1">
            {["A", "B", "C"].map((s) => (
              <button key={s} onClick={() => setSection(s)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${section === s ? "gradient-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>
                Section {s}
              </button>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-border">
          {list.map((st) => {
            const status = marked[st.id];
            return (
              <li key={st.id} className="flex items-center gap-3 py-2.5">
                <img src={st.avatar} className="w-9 h-9 rounded-full" alt="" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{st.name}</p>
                  <p className="text-xs text-muted-foreground">{st.rollNo}</p>
                </div>
                {status && <Badge tone={status === "present" ? "success" : status === "absent" ? "danger" : "warning"}>{status}</Badge>}
                <div className="flex gap-1">
                  {(["present", "absent", "late"] as const).map((s) => (
                    <button key={s} onClick={() => setMarked((m) => ({ ...m, [st.id]: s }))}
                      className={`px-2 py-1 rounded-md text-xs capitalize transition ${
                        status === s
                          ? s === "present" ? "bg-success text-success-foreground" : s === "absent" ? "bg-danger text-danger-foreground" : "bg-warning text-warning-foreground"
                          : "bg-muted hover:bg-muted/70"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
