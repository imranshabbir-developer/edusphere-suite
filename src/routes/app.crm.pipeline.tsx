import { createFileRoute } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { moveStage, type Lead } from "@/redux/slices/leadsSlice";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/StatusBadge";

export const Route = createFileRoute("/app/crm/pipeline")({ component: PipelinePage });

const STAGES: { key: Lead["stage"]; label: string; tone: "primary" | "warning" | "success" | "danger" | "default" }[] = [
  { key: "new", label: "New", tone: "primary" },
  { key: "contacted", label: "Contacted", tone: "default" },
  { key: "qualified", label: "Qualified", tone: "warning" },
  { key: "proposal", label: "Proposal", tone: "warning" },
  { key: "won", label: "Won", tone: "success" },
  { key: "lost", label: "Lost", tone: "danger" },
];

function PipelinePage() {
  const leads = useAppSelector((s) => s.leads.items);
  const dispatch = useAppDispatch();

  const onDrop = (e: React.DragEvent, stage: Lead["stage"]) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) dispatch(moveStage({ id, stage }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground text-sm">Drag cards across stages to update status.</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {STAGES.map((s) => {
          const items = leads.filter((l) => l.stage === s.key);
          const total = items.reduce((a, b) => a + b.value, 0);
          return (
            <div key={s.key} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, s.key)}
              className="min-w-[280px] w-72 glass-card rounded-2xl p-3 flex flex-col">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <Badge tone={s.tone}>{s.label}</Badge>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <span className="text-xs font-semibold">${(total / 1000).toFixed(0)}K</span>
              </div>
              <div className="space-y-2 overflow-y-auto scrollbar-thin">
                {items.map((l) => (
                  <motion.div key={l.id} layout draggable
                    onDragStart={(e) => { (e as unknown as DragEvent).dataTransfer?.setData("text/plain", l.id); }}
                    whileHover={{ y: -2 }}
                    className="bg-background border border-border rounded-xl p-3 cursor-grab active:cursor-grabbing">
                    <p className="text-sm font-semibold truncate">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.program}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs">${l.value.toLocaleString()}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{l.score}</span>
                    </div>
                  </motion.div>
                ))}
                {items.length === 0 && <div className="text-center text-xs text-muted-foreground py-8">Drop leads here</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
