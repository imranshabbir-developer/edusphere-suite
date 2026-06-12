import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDeleteModal } from "@/components/records/ConfirmDeleteModal";
import { ActionFeedbackModal, type FeedbackAction } from "@/components/records/ActionFeedbackModal";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { rolePath } from "@/utils/roleRoutes";
import { addLead, removeLead, type Lead } from "@/store/slices/leadsSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email(),
  phone: z.string().min(7),
  program: z.string().min(2),
  source: z.enum(["Website", "Referral", "Social Media", "Event", "Walk-in", "Email Campaign"]),
  value: z.coerce.number().min(0),
});
type FormData = z.infer<typeof schema>;

export default function LeadsPage() {
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const leads = useAppSelector((s) => s.leads.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Lead | null>(null);
  const [feedback, setFeedback] = useState<FeedbackAction | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const goDetail = (id: string, edit = false) => {
    navigate({
      to: "/$role/crm/leads/$id",
      params: { role, id },
      search: edit ? { edit: "1" } : {},
    });
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((l) => l.stage === "won").length;
    const qualified = leads.filter((l) => ["qualified", "proposal"].includes(l.stage)).length;
    const value = leads.reduce((a, b) => a + b.value, 0);
    return { total, won, qualified, value };
  }, [leads]);

  const onSubmit = (data: FormData) => {
    dispatch(addLead({
      id: `LD-${Date.now()}`,
      ...data,
      stage: "new",
      score: 50,
      owner: "You",
      createdAt: new Date().toISOString(),
    }));
    reset();
    setOpen(false);
    setFeedback("created");
    setFeedbackOpen(true);
  };

  const columns: ColumnDef<Lead>[] = [
    {
      header: "Lead", accessorKey: "name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { header: "Program", accessorKey: "program" },
    { header: "Source", accessorKey: "source", cell: ({ getValue }) => <Badge tone="accent">{String(getValue())}</Badge> },
    { header: "Stage", accessorKey: "stage", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
    { header: "Score", accessorKey: "score", cell: ({ getValue }) => {
      const v = Number(getValue());
      return (
        <div className="flex items-center gap-2 w-28">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full gradient-primary" style={{ width: `${v}%` }} />
          </div>
          <span className="text-xs font-medium w-6 text-right">{v}</span>
        </div>
      );
    } },
    { header: "Value", accessorKey: "value", cell: ({ getValue }) => <span className="font-semibold">${Number(getValue()).toLocaleString()}</span> },
    { header: "Owner", accessorKey: "owner" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm">Track every prospect from inquiry to enrolment.</p>
        </div>
        <div className="flex gap-2">
          <Link to={rolePath(role, "crm", "pipeline")} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">Pipeline view</Link>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
            <PlusIcon className="w-4 h-4" /> New Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Leads" value={stats.total} icon="UsersIcon" tone="primary" />
        <StatsCard title="Qualified" value={stats.qualified} icon="CheckBadgeIcon" tone="accent" delta={6} />
        <StatsCard title="Won" value={stats.won} icon="TrophyIcon" tone="success" delta={12} />
        <StatsCard title="Pipeline Value" value={`$${(stats.value / 1000).toFixed(0)}K`} icon="BanknotesIcon" tone="warning" delta={9} />
      </div>

      <DataTable
        data={leads}
        columns={columns}
        searchPlaceholder="Search leads…"
        onRowClick={(l) => goDetail(l.id)}
        onView={(l) => goDetail(l.id)}
        onEdit={(l) => goDetail(l.id, true)}
        onDelete={(l) => setDeleting(l)}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="Create New Lead"
        footer={<>
          <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg border border-border text-sm">Cancel</button>
          <button form="lead-form" type="submit" className="px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">Create lead</button>
        </>}>
        <form id="lead-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
          {([
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["program", "Program", "text"],
            ["value", "Deal value", "number"],
          ] as const).map(([k, label, type]) => (
            <div key={k} className={k === "name" ? "col-span-2" : ""}>
              <label className="text-xs font-medium">{label}</label>
              <input type={type} {...register(k)} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
              {errors[k] && <p className="text-xs text-danger mt-1">{errors[k]?.message as string}</p>}
            </div>
          ))}
          <div className="col-span-2">
            <label className="text-xs font-medium">Source</label>
            <select {...register("source")} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
              {["Website", "Referral", "Social Media", "Event", "Walk-in", "Email Campaign"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) dispatch(removeLead(deleting.id));
          setFeedback("deleted");
          setFeedbackOpen(true);
        }}
        recordName={deleting?.name}
      />
      <ActionFeedbackModal action={feedback} open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
