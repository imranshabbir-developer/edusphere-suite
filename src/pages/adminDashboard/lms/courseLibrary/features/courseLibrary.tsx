import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { courses } from "@/mockData";
import { ClockIcon, UserGroupIcon, StarIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";



const DEPTS = ["All", "Computer Science", "Mathematics", "Physics", "Business", "Humanities", "Engineering"];

export default function CourseLibrary() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? courses : courses.filter((c) => c.department === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Library</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} courses available across departments.</p>
        </div>
        <Link to="/app/lms/live" className="px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">+ Create Course</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {DEPTS.map((d) => (
          <button key={d} onClick={() => setFilter(d)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === d ? "gradient-primary text-primary-foreground shadow-elegant" : "bg-muted hover:bg-muted/70"}`}>
            {d}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            whileHover={{ y: -4 }} className="glass-card rounded-2xl overflow-hidden group cursor-pointer">
            <div className="aspect-video relative overflow-hidden gradient-hero">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/80 to-transparent" />
              <div className="absolute top-3 left-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs text-primary-foreground/80 font-mono">{c.code}</p>
                <p className="font-semibold text-primary-foreground leading-tight">{c.title}</p>
              </div>
              <PlayCircleIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 text-white/80 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-muted-foreground">{c.department} · {c.credits} credits</p>
              <p className="text-sm">By <span className="font-medium">{c.instructor}</span></p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
                <span className="inline-flex items-center gap-1"><UserGroupIcon className="w-3.5 h-3.5" /> {c.enrolled}/{c.capacity}</span>
                <span className="inline-flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> 12 weeks</span>
                <span className="inline-flex items-center gap-1 text-warning"><StarIcon className="w-3.5 h-3.5 fill-warning" /> 4.{5 + (i % 4)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
