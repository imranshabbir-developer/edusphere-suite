import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Soft edge wash: teal left, white center, periwinkle right — used by every modal. */
export function ModalGradientShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border/50 shadow-elegant modal-gradient-bg", className)}>
      <div className="relative">{children}</div>
    </div>
  );
}

export const modalBackdropClass =
  "fixed inset-0 bg-black/40 backdrop-blur-[3px] data-[closed]:opacity-0 transition-opacity duration-200";

export const modalFieldClass =
  "w-full px-3 py-2 rounded-lg border border-border/60 bg-white dark:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition";
