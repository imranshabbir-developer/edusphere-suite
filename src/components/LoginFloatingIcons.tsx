"use client";

import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  BookOpenIcon,
  ComputerDesktopIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  LightBulbIcon,
  PencilSquareIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

type IconDef = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  top: string;
  left: string;
  size: string;
  delay: number;
  duration: number;
  rotate?: number;
};

const FLOATING_ICONS: IconDef[] = [
  { Icon: AcademicCapIcon, top: "8%", left: "6%", size: "w-10 h-10 sm:w-12 sm:h-12", delay: 0, duration: 5 },
  { Icon: BookOpenIcon, top: "18%", left: "88%", size: "w-9 h-9 sm:w-11 sm:h-11", delay: 0.6, duration: 6, rotate: 8 },
  { Icon: ComputerDesktopIcon, top: "72%", left: "4%", size: "w-11 h-11 sm:w-14 sm:h-14", delay: 1.2, duration: 5.5 },
  { Icon: VideoCameraIcon, top: "82%", left: "92%", size: "w-9 h-9 sm:w-10 sm:h-10", delay: 0.3, duration: 4.8, rotate: -6 },
  { Icon: ChartBarIcon, top: "42%", left: "2%", size: "w-8 h-8 sm:w-10 sm:h-10", delay: 1.8, duration: 6.2 },
  { Icon: ClipboardDocumentCheckIcon, top: "55%", left: "94%", size: "w-10 h-10 sm:w-12 sm:h-12", delay: 0.9, duration: 5.2, rotate: 5 },
  { Icon: UserGroupIcon, top: "28%", left: "12%", size: "w-8 h-8 sm:w-9 sm:h-9", delay: 2.1, duration: 4.5 },
  { Icon: LightBulbIcon, top: "12%", left: "72%", size: "w-9 h-9 sm:w-11 sm:h-11", delay: 1.5, duration: 5.8, rotate: -4 },
  { Icon: PencilSquareIcon, top: "65%", left: "78%", size: "w-8 h-8 sm:w-10 sm:h-10", delay: 0.4, duration: 6.5 },
  { Icon: GlobeAltIcon, top: "38%", left: "90%", size: "w-9 h-9 sm:w-10 sm:h-10", delay: 2.4, duration: 5 },
];

function FloatingIcon({ def }: { def: IconDef }) {
  const { Icon, top, left, size, delay, duration, rotate = 0 } = def;

  return (
    <motion.div
      className={`absolute ${size} rounded-2xl glass-card shadow-elegant flex items-center justify-center text-primary/45 pointer-events-none`}
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0.45, 0.85, 0.45],
        y: [0, -14, 0],
        rotate: [rotate, rotate + 6, rotate],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon className="w-[55%] h-[55%]" strokeWidth={1.5} />
    </motion.div>
  );
}

export function LoginFloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {FLOATING_ICONS.map((def, i) => (
        <FloatingIcon key={i} def={def} />
      ))}
    </div>
  );
}
