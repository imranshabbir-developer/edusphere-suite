import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { ModalGradientShell, modalBackdropClass } from "./ModalGradientShell";

export function Modal({
  open, onClose, title, children, footer, size = "md",
}: {
  open: boolean; onClose: () => void; title?: string; children: ReactNode; footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sz = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop transition className={modalBackdropClass} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`w-full ${sz} bg-transparent data-[closed]:scale-95 data-[closed]:opacity-0 transition duration-200`}
        >
          <ModalGradientShell>
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-white/20 dark:bg-white/5">
                <DialogTitle className="text-lg font-semibold tracking-tight">{title}</DialogTitle>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10 transition"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
            {footer && (
              <div className="px-5 py-4 border-t border-border/40 bg-white/15 dark:bg-white/5 flex justify-end gap-2">
                {footer}
              </div>
            )}
          </ModalGradientShell>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
