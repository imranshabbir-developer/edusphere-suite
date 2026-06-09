import { motion } from "framer-motion";
import { Icon } from "./Icon";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: ReactNode;
  delta?: number;
  icon?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "accent";
  hint?: string;
}

const toneMap = {
  primary: "from-primary/20 to-primary/0 text-primary",
  success: "from-success/20 to-success/0 text-success",
  warning: "from-warning/20 to-warning/0 text-warning",
  danger: "from-danger/20 to-danger/0 text-danger",
  accent: "from-accent/20 to-accent/0 text-accent",
};

export function StatsCard({ title, value, delta, icon, tone = "primary", hint }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${toneMap[tone]} blur-2xl opacity-70 group-hover:opacity-100 transition-opacity`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${toneMap[tone]}`}>
            <Icon name={icon} className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          {typeof delta === "number" && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${delta >= 0 ? "text-success bg-success/10" : "text-danger bg-danger/10"}`}>
              {delta >= 0 ? "+" : ""}{delta}%
            </span>
          )}
        </div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
    </motion.div>
  );
}
