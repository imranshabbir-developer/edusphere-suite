import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ModalGradientShell, modalBackdropClass } from "@/components/ui/ModalGradientShell";

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  recordName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recordName?: string;
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[70]">
      <DialogBackdrop transition className={modalBackdropClass} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-[22rem] bg-transparent data-[closed]:scale-95 data-[closed]:opacity-0 transition duration-200"
        >
          <ModalGradientShell>
            <div className="p-5">
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-xl bg-danger/15 text-danger flex items-center justify-center mb-3 shadow-elegant">
                  <ExclamationTriangleIcon className="w-6 h-6" />
                </div>
                <DialogTitle className="text-base font-semibold">Delete this record?</DialogTitle>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {recordName
                    ? `"${recordName}" will be permanently removed. This cannot be undone.`
                    : "This record will be permanently removed. This cannot be undone."}
                </p>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg border border-border/70 bg-white/50 dark:bg-white/5 text-sm font-medium hover:bg-white/70 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-lg bg-danger text-danger-foreground text-sm font-semibold shadow-elegant"
                >
                  Delete
                </button>
              </div>
            </div>
          </ModalGradientShell>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
