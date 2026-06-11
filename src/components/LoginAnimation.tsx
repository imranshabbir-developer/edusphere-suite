"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import loginAnimation from "@/assets/login3.json";

const animationData =
  (loginAnimation as { default?: typeof loginAnimation }).default ?? loginAnimation;

export function LoginAnimation({ className = "relative w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] max-w-full" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const anim = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => anim.destroy();
  }, []);

  return (
    <div ref={containerRef} className={className} aria-hidden />
  );
}
