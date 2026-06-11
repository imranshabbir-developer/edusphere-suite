import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] data-[closed]:opacity-0 transition-opacity duration-200"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-[22rem] overflow-hidden rounded-2xl border border-border/50 shadow-elegant data-[closed]:scale-95 data-[closed]:opacity-0 transition duration-200"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.98 0.02 25), oklch(0.97 0.03 250))",
            }}
          />
          <div className="relative z-10 p-5">
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-xl bg-danger/10 text-danger flex items-center justify-center mb-3">
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
                className="flex-1 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2 rounded-lg bg-danger text-danger-foreground text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
