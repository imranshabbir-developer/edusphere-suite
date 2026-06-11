import { motion } from "framer-motion";
import { useAppSelector } from "@/store/store";
import type { ReactNode } from "react";

export const COLORS = [
  "oklch(0.585 0.214 263)",
  "oklch(0.72 0.13 188)",
  "oklch(0.72 0.18 145)",
  "oklch(0.78 0.16 75)",
  "oklch(0.64 0.22 25)",
  "oklch(0.68 0.18 305)",
];

export const chartTooltip = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    fontSize: "12px",
  },
};

export function DashboardHero({
  subtitle,
  actions,
}: {
  subtitle: string;
  actions?: ReactNode;
}) {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </motion.div>
  );
}
