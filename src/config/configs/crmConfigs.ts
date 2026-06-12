import type { ModuleConfig } from "../moduleTypes";
import {
  ACTIVE_STATUSES, ALL_PROGRAMS, CRM_STATUSES, INQUIRY_TYPES, LEAD_SOURCES, STAFF_NAMES,
  fullName, makeId, pick, dateOffset,
} from "../moduleConstants";
import { buildFromFields, defaultStats } from "../moduleHelpers";

const crmFields = [
  { key: "name", label: "Contact Name", required: true, span: 2 as const },
  { key: "email", label: "Email", type: "email" as const },
  { key: "phone", label: "Phone", type: "tel" as const },
  { key: "program", label: "Interested Program", type: "select" as const, options: ALL_PROGRAMS },
  { key: "source", label: "Lead Source", type: "select" as const, options: LEAD_SOURCES },
  { key: "inquiryType", label: "Inquiry Type", type: "select" as const, options: INQUIRY_TYPES },
  { key: "assignedTo", label: "Assigned To", type: "select" as const, options: STAFF_NAMES },
  { key: "status", label: "Status", type: "select" as const, options: CRM_STATUSES },
  { key: "followUpDate", label: "Follow-up Date", type: "date" as const },
];

const crmColumns = [
  { header: "ID", accessorKey: "id", type: "mono" as const },
  { header: "Contact", accessorKey: "name" },
  { header: "Program", accessorKey: "program" },
  { header: "Source", accessorKey: "source", type: "badge" as const },
  { header: "Assigned To", accessorKey: "assignedTo" },
  { header: "Status", accessorKey: "status", type: "status" as const },
  { header: "Follow-up", accessorKey: "followUpDate", type: "date" as const },
];

function seedCrm(path: string, label: string) {
  return Array.from({ length: 22 }).map((_, i) => ({
    id: makeId(path.includes("follow") ? "FLW" : path.includes("source") ? "SRC" : "INQ", i),
    name: fullName(i),
    email: fullName(i).toLowerCase().replace(" ", ".") + "@mail.com",
    phone: `+92 300 ${String(1000000 + i).slice(-7)}`,
    program: pick(ALL_PROGRAMS, i),
    source: pick(LEAD_SOURCES, i),
    inquiryType: pick(INQUIRY_TYPES, i),
    assignedTo: pick(STAFF_NAMES, i),
    status: pick(CRM_STATUSES, i),
    followUpDate: dateOffset(i - 5),
  }));
}

export const crmInquiries: ModuleConfig = buildFromFields(
  "INQ", crmFields, crmColumns,
  [
    { id: "status", label: "Status", options: CRM_STATUSES },
    { id: "source", label: "Source", options: LEAD_SOURCES },
    { id: "program", label: "Program", options: ALL_PROGRAMS.slice(0, 8) },
  ],
  defaultStats("status"),
  seedCrm,
);

export const crmFollowUps: ModuleConfig = buildFromFields(
  "FLW",
  [
    { key: "name", label: "Lead Name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: ALL_PROGRAMS },
    { key: "assignedTo", label: "Assigned To", type: "select", options: STAFF_NAMES },
    { key: "followUpType", label: "Follow-up Type", type: "select", options: ["Call", "Email", "Meeting", "WhatsApp", "Campus Visit"] },
    { key: "status", label: "Status", type: "select", options: ["Scheduled", "Completed", "Missed", "Rescheduled"] },
    { key: "followUpDate", label: "Date", type: "date" },
    { key: "notes", label: "Notes", type: "textarea", span: 2 },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Lead", accessorKey: "name" },
    { header: "Program", accessorKey: "program" },
    { header: "Type", accessorKey: "followUpType", type: "badge" },
    { header: "Assigned To", accessorKey: "assignedTo" },
    { header: "Status", accessorKey: "status", type: "status" },
    { header: "Date", accessorKey: "followUpDate" },
  ],
  [
    { id: "status", label: "Status", options: ["Scheduled", "Completed", "Missed", "Rescheduled"] },
    { id: "followUpType", label: "Type", options: ["Call", "Email", "Meeting", "WhatsApp", "Campus Visit"] },
  ],
  defaultStats("status"),
  (_, __) => Array.from({ length: 20 }).map((_, i) => ({
    id: makeId("FLW", i), name: fullName(i), program: pick(ALL_PROGRAMS, i),
    assignedTo: pick(STAFF_NAMES, i), followUpType: pick(["Call", "Email", "Meeting", "WhatsApp", "Campus Visit"], i),
    status: pick(["Scheduled", "Completed", "Missed", "Rescheduled"], i), followUpDate: dateOffset(i - 3),
    notes: "Follow-up regarding admission and program details.",
  })),
);

export const crmSources: ModuleConfig = buildFromFields(
  "SRC",
  [
    { key: "name", label: "Source Name", required: true, span: 2 },
    { key: "channel", label: "Channel", type: "select", options: LEAD_SOURCES },
    { key: "campaign", label: "Campaign" },
    { key: "leadsGenerated", label: "Leads Generated", type: "number" },
    { key: "conversionRate", label: "Conversion %", type: "number" },
    { key: "status", label: "Status", type: "select", options: ACTIVE_STATUSES },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Source", accessorKey: "name" },
    { header: "Channel", accessorKey: "channel", type: "badge" },
    { header: "Campaign", accessorKey: "campaign" },
    { header: "Leads", accessorKey: "leadsGenerated" },
    { header: "Conversion", accessorKey: "conversionRate", type: "percent" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "channel", label: "Channel", options: LEAD_SOURCES }],
  defaultStats("status"),
  () => Array.from({ length: 18 }).map((_, i) => ({
    id: makeId("SRC", i), name: `${pick(LEAD_SOURCES, i)} Campaign ${i + 1}`,
    channel: pick(LEAD_SOURCES, i), campaign: `Spring 2025 - ${pick(ALL_PROGRAMS, i)}`,
    leadsGenerated: 50 + i * 12, conversionRate: 8 + (i % 15), status: pick(ACTIVE_STATUSES, i),
  })),
);

export const crmAnalytics: ModuleConfig = buildFromFields(
  "ANL",
  [
    { key: "name", label: "Report Name", required: true, span: 2 },
    { key: "metric", label: "Metric", type: "select", options: ["Conversion Rate", "Lead Volume", "Source ROI", "Pipeline Value", "Response Time"] },
    { key: "period", label: "Period", type: "select", options: ["Weekly", "Monthly", "Quarterly", "Yearly"] },
    { key: "value", label: "Value", type: "number" },
    { key: "target", label: "Target", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["On Track", "Below Target", "Above Target"] },
  ],
  [
    { header: "ID", accessorKey: "id", type: "mono" },
    { header: "Report", accessorKey: "name" },
    { header: "Metric", accessorKey: "metric", type: "badge" },
    { header: "Period", accessorKey: "period" },
    { header: "Value", accessorKey: "value" },
    { header: "Target", accessorKey: "target" },
    { header: "Status", accessorKey: "status", type: "status" },
  ],
  [{ id: "metric", label: "Metric", options: ["Conversion Rate", "Lead Volume", "Source ROI", "Pipeline Value", "Response Time"] }],
  defaultStats("status"),
  () => Array.from({ length: 15 }).map((_, i) => ({
    id: makeId("ANL", i), name: `CRM Analytics - ${pick(["Conversion", "Lead Volume", "ROI"], i)}`,
    metric: pick(["Conversion Rate", "Lead Volume", "Source ROI", "Pipeline Value", "Response Time"], i),
    period: pick(["Weekly", "Monthly", "Quarterly", "Yearly"], i),
    value: 15 + i * 3, target: 20 + i * 2, status: pick(["On Track", "Below Target", "Above Target"], i),
  })),
);
