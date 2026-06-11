import { useEffect } from "react";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import {
  CheckCircleIcon,
  TrashIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export type FeedbackAction = "saved" | "deleted" | "created";

const CONFIG: Record<
  FeedbackAction,
  { title: string; message: string; icon: typeof CheckCircleIcon; tone: string }
> = {
  saved: {
    title: "Record saved",
    message: "Your changes have been saved successfully.",
    icon: CheckCircleIcon,
    tone: "from-primary/20 to-accent/10 text-primary",
  },
  deleted: {
    title: "Record deleted",
    message: "The record has been removed from the list.",
    icon: TrashIcon,
    tone: "from-danger/15 to-warning/10 text-danger",
  },
  created: {
    title: "Record created",
    message: "A new record has been added successfully.",
    icon: SparklesIcon,
    tone: "from-success/15 to-accent/10 text-success",
  },
};

export function ActionFeedbackModal({
  action,
  open,
  onClose,
}: {
  action: FeedbackAction | null;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!action) return null;
  const cfg = CONFIG[action];
  const Icon = cfg.icon;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[70]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/35 backdrop-blur-[2px] data-[closed]:opacity-0 transition-opacity duration-200"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-[20rem] overflow-hidden rounded-2xl border border-border/50 shadow-elegant data-[closed]:scale-95 data-[closed]:opacity-0 transition duration-200"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.98 0.02 250), oklch(0.96 0.04 200) 50%, oklch(0.97 0.03 188))",
            }}
          />
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 p-5 text-center"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 p-1 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
            <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.tone} flex items-center justify-center shadow-elegant mb-3`}>
              <Icon className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold">{cfg.title}</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{cfg.message}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold"
            >
              Got it
            </button>
          </motion.div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
