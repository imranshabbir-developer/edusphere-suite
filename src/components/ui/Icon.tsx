import * as Hi from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export function Icon({ name, className }: { name?: string; className?: string }) {
  const C = (name && (Hi as unknown as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[name]) || Hi.Squares2X2Icon;
  return <C className={className ?? "w-5 h-5"} aria-hidden="true" />;
}
